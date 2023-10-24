// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Kysely } from 'kysely';
import { addDefaultColumns, mysqlEnum } from './utils.mjs';

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  // Support requests
  const supportRequestResolutionStatus = mysqlEnum(['NEW', 'RESOLVED', 'IN_PROGRESS', 'DECLINED']);
  await db.schema
    .createTable('supportRequest')
    .$call(addDefaultColumns)
    .addColumn('customerEmail', 'text', (col) => col.notNull())
    .addColumn('subject', 'text', (col) => col.notNull())
    .addColumn('details', 'text', (col) => col.notNull())
    .addColumn('resolutionStatus', supportRequestResolutionStatus, (col) => col.notNull().defaultTo('NEW'))
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema.dropTable('supportRequest').execute();
}
