export * as Variation from './variation';
import { InsertObject, UpdateObject } from 'kysely';
import { From } from 'kysely/dist/cjs/parser/table-parser';
import { ulid } from 'ulid';

import { CommunityVariationsPaginationSchema } from './common/validation/schemas/variation';
import { SQL } from './db/sql';
import { DB } from './db/sql.generated';

export const getById = async (id: string) => {
  return SQL.DB.selectFrom('variation').selectAll().where('id', '=', id).executeTakeFirstOrThrow();
};

export const create = async (payload: CreateVariation) => {
  const id = payload.id || ulid().toLowerCase();
  await SQL.DB.insertInto('variation')
    .values({ ...payload, id })
    .execute();

  return getById(id);
};

export const getSharedWithCommunity = async (pagination: CommunityVariationsPaginationSchema) => {
  const { page, limit } = pagination;
  const countedVariations = await SQL.DB.selectFrom('variation')
    .innerJoin('creation', 'creation.id', 'variation.creationId')
    .select((eb) => eb.fn.count<number>('variation.id').as('variationCount'))
    .where('isSharedToCommunity', '=', 1)
    .where('creation.completionStatus', '=', 'COMPLETED')
    .where('creation.deletedAt', 'is', null)
    .executeTakeFirstOrThrow();
  const total = countedVariations.variationCount;
  const lastPage = Math.ceil(total / pagination.limit);

  const variations = await SQL.DB.selectFrom('variation')
    .innerJoin('creation', 'creation.id', 'variation.creationId')
    .selectAll()
    .where('isSharedToCommunity', '=', 1)
    .where('creation.completionStatus', '=', 'COMPLETED')
    .where('creation.deletedAt', 'is', null)
    .offset((page - 1) * limit)
    .limit(limit)
    .orderBy('variation.createdAt', 'desc')
    .execute();

  return { variations, page, limit, lastPage, total };
};

export const updateById = async (
  id: string,
  payload: UpdateObject<From<DB, 'variation'>, 'variation', 'variation'>
) => {
  await SQL.DB.updateTable('variation').set(payload).where('id', '=', id).executeTakeFirst();
  return getById(id);
};

export type CreateVariation = InsertObject<DB, 'variation'> & { id?: string };
