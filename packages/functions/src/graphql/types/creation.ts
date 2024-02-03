import {
  deleteCreationSchema,
  updateCreationThumbnailSchema,
  UserCreationsPaginationSchema,
  userCreationsPaginationSchema,
} from '@nafo-ai/core/common/validation';
import { Creation } from '@nafo-ai/core/creation';
import { SQL } from '@nafo-ai/core/db/sql';
import { Response } from 'sst/node/api';

import { builder } from '../builder';

import { StyleType } from './style';
import { VariationType } from './variation';

export const CreationCompletionStatusType = builder.enumType('CreationCompletionStatus', {
  values: ['IN_PROGRESS', 'COMPLETED', 'PENDING'],
});

const CreationType = builder.objectRef<SQL.Row['creation']>('Creation').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    iterationCount: t.exposeInt('iterationCount'),
    variationCount: t.exposeInt('variationCount'),
    textPrompt: t.exposeString('textPrompt', { nullable: true }),
    resultImageUrl: t.exposeString('resultImageUrl', { nullable: true }),
    startingImageUrl: t.exposeString('startingImageUrl', { nullable: true }),
    negativePrompt: t.exposeString('negativePrompt', { nullable: true }),
    parentCreationId: t.exposeString('parentCreationId', { nullable: true }),
    modeId: t.exposeString('modeId', { nullable: true }),
    completionStatus: t.field({
      type: CreationCompletionStatusType,
      resolve: (creation) => creation.completionStatus,
    }),
    variations: t.field({
      type: [VariationType],
      resolve: (creation) => Creation.variations(creation.id),
    }),
    styles: t.field({
      type: [StyleType],
      resolve: (creation) => Creation.styles(creation.id),
    }),
    createdAt: t.field({
      type: 'String',
      resolve: (creation) => creation.createdAt.toISOString(),
    }),
    updatedAt: t.field({
      type: 'String',
      resolve: (creation) => creation.updatedAt.toISOString(),
    }),
  }),
});

const PaginatedCreationsType = builder
  .objectRef<{ creations: SQL.Row['creation'][]; page: number; limit: number; lastPage: number; total: number }>(
    'PaginatedCreations'
  )
  .implement({
    fields: (t) => ({
      creations: t.field({
        type: [CreationType],
        resolve: (paginatedCreations) => paginatedCreations.creations,
      }),
      page: t.exposeInt('page'),
      limit: t.exposeInt('limit'),
      lastPage: t.exposeInt('lastPage'),
      total: t.exposeInt('total'),
    }),
  });

builder.queryFields((t) => ({
  creation: t.field({
    type: CreationType,
    args: {
      creationId: t.arg.string({ required: true }),
    },
    resolve: async (_, args, ctx) => {
      if (ctx.type !== 'user') {
        throw new Response({
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized' }),
        });
      }
      const result = await Creation.getById(args.creationId);

      if (!result) {
        throw new Error('Creation not found');
      }

      return result;
    },
  }),
  myCreations: t.field({
    type: PaginatedCreationsType,
    validate: {
      schema: userCreationsPaginationSchema,
    },
    args: {
      page: t.arg.int({
        defaultValue: 1,
      }),
      limit: t.arg.int({
        defaultValue: 6,
      }),
    },
    resolve: (_, args, ctx) => {
      if (ctx.type !== 'user') {
        throw new Response({
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized' }),
        });
      }

      return Creation.getByUserId(ctx.properties.userId, args as UserCreationsPaginationSchema);
    },
  }),
}));

builder.mutationFields((t) => ({
  setCreationThumbnail: t.field({
    type: CreationType,
    validate: {
      schema: updateCreationThumbnailSchema,
    },
    args: {
      creationId: t.arg.string({
        required: true,
      }),
      thumbnailUrl: t.arg.string({
        required: true,
      }),
    },
    resolve: async (_, args, ctx) => {
      if (ctx.type !== 'user') {
        throw new Response({
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized' }),
        });
      }

      const variations = await Creation.variations(args.creationId);
      if (!variations.length) {
        throw new Error('Creation has no variations');
      }
      const allowedThumbnailUrls = variations.map((v) => v.imageUrl);
      if (!allowedThumbnailUrls.includes(args.thumbnailUrl)) {
        throw new Error('Thumbnail image url does not belong to creation variation3');
      }

      const updatedCreation = await Creation.updateById(args.creationId, { resultImageUrl: args.thumbnailUrl });
      if (!updatedCreation) {
        throw new Error('Creation not found');
      }

      return updatedCreation;
    },
  }),
  deleteCreation: t.field({
    type: 'Boolean',
    validate: {
      schema: deleteCreationSchema,
    },
    args: {
      creationId: t.arg.string({
        required: true,
      }),
    },
    resolve: async (_, args, ctx) => {
      if (ctx.type !== 'user') {
        throw new Response({
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized' }),
        });
      }

      await Creation.softDeleteById(args.creationId);
      return true;
    },
  }),
}));
