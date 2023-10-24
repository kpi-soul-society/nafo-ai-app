export * as Style from './style';
import { InsertObject } from 'kysely';
import { ulid } from 'ulid';

import { SQL } from './db/sql';
import { DB } from './db/sql.generated';

export const list = async () => {
  return SQL.DB.selectFrom('style').selectAll().orderBy('createdAt', 'desc').execute();
};

export const getById = async (id: string) => {
  return SQL.DB.selectFrom('style').selectAll().where('id', '=', id).executeTakeFirstOrThrow();
};

export const create = async (payload: CreateStyle) => {
  const id = payload.id || ulid().toLowerCase();
  await SQL.DB.insertInto('style')
    .values({ ...payload, id })
    .execute();

  return getById(id);
};

export type CreateStyle = InsertObject<DB, 'style'> & { id?: string };
