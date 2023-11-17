export * as Creation from './creation';
import { S3Client } from '@aws-sdk/client-s3';
import { SendMessageCommand, SendMessageCommandInput, SQSClient } from '@aws-sdk/client-sqs';
import { InsertObject, Selectable, sql, UpdateObject } from 'kysely';
import { From } from 'kysely/dist/cjs/parser/table-parser';
import { Bucket } from 'sst/node/bucket';
import { Queue } from 'sst/node/queue';
import { ulid } from 'ulid';

import { NotEnoughTokensError, UserNotFoundError } from './common/errors';
import {
  creationCompletionStatusUpdatedEvent,
  CreationGenerationStyleSchema,
  ServerCreationGenerationSchema,
  UserCreationsPaginationSchema,
} from './common/validation';
import { SQL } from './db/sql';
import { DB, Style, Variation } from './db/sql.generated';
import { createPresignedUploadUrl, getPublicReadUrl, uploadFile } from './s3/utils';
import { event } from './event';

export const getOne = async ({ id }: GetCreation) => {
  let query = SQL.DB.selectFrom('creation').selectAll();

  if (id) {
    query = query.where('id', '=', id);
  }

  return query.executeTakeFirst();
};

export const getById = async (id: string) => {
  return SQL.DB.selectFrom('creation').selectAll().where('id', '=', id).executeTakeFirstOrThrow();
};

export const getByUserId = async (userId: string, pagination: UserCreationsPaginationSchema, withDeleted?: boolean) => {
  const { page, limit } = pagination;
  let countQuery = SQL.DB.selectFrom('creation')
    .select((eb) => eb.fn.count<number>('id').as('creationCount'))
    .where('userId', '=', userId);
  if (!withDeleted) {
    countQuery = countQuery.where('deletedAt', 'is', null);
  }
  const countedCreations = await countQuery.executeTakeFirstOrThrow();
  const total = countedCreations.creationCount;
  const lastPage = Math.ceil(total / pagination.limit);

  let creationsQuery = SQL.DB.selectFrom('creation').selectAll().where('userId', '=', userId);
  if (!withDeleted) {
    creationsQuery = creationsQuery.where('deletedAt', 'is', null);
  }
  const creations = await creationsQuery
    .offset((page - 1) * limit)
    .limit(limit)
    .orderBy('createdAt', 'desc')
    .execute();

  return { creations, page, limit, lastPage, total };
};

export const getStaleCreations = async () => {
  return SQL.DB.selectFrom('creation')
    .selectAll()
    .where('completionStatus', '!=', 'COMPLETED')
    .where('createdAt', '<', sql`now() - interval 5 minute`)
    .where('deletedAt', 'is', null)
    .execute();
};

export const updateById = async (id: string, payload: UpdateObject<From<DB, 'creation'>, 'creation', 'creation'>) => {
  await SQL.DB.updateTable('creation').set(payload).where('id', '=', id).executeTakeFirst();
  return getById(id);
};

export const softDeleteById = async (id: string) => {
  await SQL.DB.updateTable('creation')
    .set({ deletedAt: sql`now()` })
    .where('id', '=', id)
    .execute();
  return true;
};

export const create = async (payload: InsertCreation) => {
  const id = payload.id || ulid().toLowerCase();
  await SQL.DB.insertInto('creation')
    .values([{ ...payload, id }])
    .execute();

  return getById(id);
};

export const variations = async (creationId: string) => {
  const creation = await SQL.DB.selectFrom('creation')
    .select('resultImageUrl')
    .select('id')
    .where('id', '=', creationId)
    .executeTakeFirst();

  if (!creation) {
    throw new Error('Creation not found');
  }

  const variations = await SQL.DB.selectFrom('variation')
    .selectAll()
    .where('creationId', '=', creationId)
    .orderBy('createdAt', 'desc')
    .execute();

  return variations.sort((a, b) => {
    if (a.imageUrl === creation.resultImageUrl) return -1;
    if (b.imageUrl === creation.resultImageUrl) return 1;

    return 0;
  });
};

export const styles = async (creationId: string) => {
  return SQL.DB.selectFrom('style')
    .innerJoin('creationStyle', 'creationStyle.styleId', 'style.id')
    .where('creationStyle.creationId', '=', creationId)
    .selectAll('style')
    .execute();
};

export async function dispatchCreationGeneration(payload: ServerCreationGenerationSchema) {
  const client = new S3Client({});
  const { selectedStyles, startingImage, ...rest } = payload;
  const initialCreationId = ulid().toLowerCase();
  const initialCreation: InsertCreation = {
    ...rest,
    completionStatus: 'PENDING',
    id: initialCreationId,
  };

  const { creation } = await SQL.DB.transaction().execute(async (trx) => {
    await trx.insertInto('creation').values(initialCreation).execute();
    const creation = await trx
      .selectFrom('creation')
      .selectAll()
      .where('id', '=', initialCreationId)
      .executeTakeFirstOrThrow();

    const user = await trx.selectFrom('user').selectAll().where('id', '=', creation.userId).executeTakeFirst();
    if (!user) {
      throw new UserNotFoundError(creation.userId);
    }
    if (user.tokenNumber < 1) {
      throw new NotEnoughTokensError(
        `User ${user.id} has not enough tokens. Balance: ${user.tokenNumber} tokens, but at least 1 is required to generate a creation.`
      );
    }

    await trx
      .updateTable('user')
      .set({ tokenNumber: user.tokenNumber - 1 })
      .where('user.id', '=', creation.userId)
      .execute();
    await trx
      .insertInto('userTokenHistory')
      .values([
        {
          id: ulid().toLowerCase(),
          userId: creation.userId,
          creationId: creation.id,
          userTokenNumberBefore: user.tokenNumber,
          userTokenNumberAfter: user.tokenNumber - 1,
        },
      ])
      .execute();

    if (startingImage) {
      const startingImageS3Key = `users/${creation.userId}/creations/${creation.id}/starting-image.${
        startingImage.mimetype?.split('/')[1] ?? 'png'
      }`;
      await uploadFile(client, {
        bucket: Bucket.Creations.bucketName,
        key: startingImageS3Key,
        body: startingImage.content,
      });

      const startingImageUrl = getPublicReadUrl({ bucket: Bucket.Creations.bucketName, key: startingImageS3Key });
      await trx
        .updateTable('creation')
        .set({ startingImageUrl: startingImageUrl })
        .where('creation.id', '=', creation.id)
        .execute();
    }

    // For the model to generate quality images, the prompt needs to be enhanced with specific text depending on the style
    if (selectedStyles?.length && payload.textPrompt && selectedStyles[0].prompt.includes('{prompt}')) {
      const stylePrompt = selectedStyles[0].prompt; // only a single style is supported now
      const enhancedTextPrompt = stylePrompt.replace('{prompt}', payload.textPrompt); // paste user's prompt into the style's prompt template

      await trx.updateTable('creation').set({ enhancedTextPrompt }).where('creation.id', '=', creation.id).execute();

      const insertCreationStyleConnectionsPayload: InsertObject<DB, 'creationStyle'>[] = selectedStyles.map(
        (s: CreationGenerationStyleSchema) => {
          return { id: ulid().toLocaleLowerCase(), creationId: creation.id, styleId: s.id };
        }
      );
      await trx.insertInto('creationStyle').values(insertCreationStyleConnectionsPayload).execute();
    }

    if (selectedStyles?.length) {
      const negativePrompt = payload.negativePrompt?.length
        ? `${payload.negativePrompt} ${selectedStyles[0].negativePrompt}`
        : selectedStyles[0].negativePrompt;
      await trx.updateTable('creation').set({ negativePrompt }).where('creation.id', '=', creation.id).execute();
    }

    // Insert variations into the DB, so that we have the ids to use for the S3 keys
    const variationPayloads: InsertObject<DB, 'variation'>[] = [];
    for (let i = 0; i < payload.variationCount; i++) {
      variationPayloads.push({
        id: ulid().toLowerCase(),
        creationId: creation.id,
      });
    }
    await trx.insertInto('variation').values(variationPayloads).execute();

    // Generate S3 upload urls for the creation and variations
    const variationsWithImageUrls: Selectable<Variation>[] = [];
    const variationUploadUrls: string[] = [];
    await Promise.all(
      variationPayloads.map(async (variation) => {
        const s3Key = `users/${creation.userId}/creations/${creation.id}/variations/${variation.id}.png`;

        const uploadUrl = await createPresignedUploadUrl(client, {
          bucket: Bucket.Creations.bucketName,
          key: s3Key,
        });
        const readUrl = getPublicReadUrl({
          bucket: Bucket.Creations.bucketName,
          key: s3Key,
        });

        await trx
          .updateTable('variation')
          .set({ imageUrl: readUrl })
          .where('variation.id', '=', variation.id)
          .execute();
        const updatedVariation = await trx
          .selectFrom('variation')
          .selectAll()
          .where('id', '=', variation.id)
          .executeTakeFirstOrThrow();
        variationsWithImageUrls.push(updatedVariation);
        variationUploadUrls.push(uploadUrl);
      })
    );

    await trx
      .updateTable('creation')
      .set({ resultImageUrl: variationsWithImageUrls[0].imageUrl })
      .where('creation.id', '=', creation.id)
      .execute();
    const creationBeforeGenerationStart = await trx
      .selectFrom('creation')
      .selectAll()
      .where('id', '=', creation.id)
      .executeTakeFirstOrThrow();

    const generationPayload = {
      variationUploadUrls,
      textPrompt: creationBeforeGenerationStart.enhancedTextPrompt || creationBeforeGenerationStart.textPrompt,
      startingImageUrl: creationBeforeGenerationStart.startingImageUrl,
      iterationCount: creationBeforeGenerationStart.iterationCount,
      userId: creationBeforeGenerationStart.userId,
      creationId: creationBeforeGenerationStart.id,
      negativePrompt: creationBeforeGenerationStart.negativePrompt,
      styles: selectedStyles,
    } as CreationGenerationMessagePayload;

    console.log(generationPayload);

    // Queue up requests to the image generation service
    const sqs = new SQSClient({});
    const message: SendMessageCommandInput = {
      QueueUrl: Queue.CreationGeneration.queueUrl,
      MessageBody: JSON.stringify(generationPayload),
    };
    const command = new SendMessageCommand(message);
    await sqs.send(command);

    return {
      creation: creationBeforeGenerationStart,
      variations: variationsWithImageUrls,
    };
  });

  return creation;
}

export const Events = {
  CreationCompletionStatusUpdated: event('creation.completion-status-updated', creationCompletionStatusUpdatedEvent),
};

export interface DispatchCreationGeneration {
  userId: string;
  iterationCount: number;
  variationCount: number;
  textPrompt?: string;
  selectedStyles?: Selectable<Style>[];
  startingImage?: {
    content: Buffer;
    filename: string;
    mimetype: string;
  };
}

export type InsertCreation = InsertObject<DB, 'creation'> & { id?: string };

export interface DispatchCreationGenerationRequestDto {
  iterationCount: number;
  variationCount: number;
  textPrompt: string;
}

export interface CreationGenerationMessagePayload {
  variationUploadUrls: string[];
  textPrompt: string;
  iterationCount: number;
  negativePrompt?: string;
  userId: string;
  creationId: string;
  startingImageUrl?: string;
}

export interface GetCreation {
  id?: string;
}
