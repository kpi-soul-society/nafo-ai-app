export * as Support from './support';

import { InsertObject } from 'kysely';
import { ulid } from 'ulid';

import { supportRequestCreatedEvent } from './common/validation';
import { SQL } from './db/sql';
import { DB } from './db/sql.generated';
import { event } from './event';

export const create = async (payload: InsertSupportRequest) => {
  const id = payload.id || ulid().toLowerCase();
  return SQL.DB.insertInto('supportRequest')
    .values({ ...payload, id })
    .execute();
};

export const getById = async (id: string) => {
  return SQL.DB.selectFrom('supportRequest').selectAll().where('id', '=', id).executeTakeFirstOrThrow();
};

export const Events = {
  SupportRequestCreated: event('support.request-created', supportRequestCreatedEvent),
};

export type InsertSupportRequest = InsertObject<DB, 'supportRequest'> & { id?: string };
