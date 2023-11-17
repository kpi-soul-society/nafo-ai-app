// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Kysely } from 'kysely';
import { addDefaultColumns } from './utils.mjs';

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  // Style
  await db.schema
    .createTable('style')
    .$call(addDefaultColumns)
    .addColumn('name', 'varchar(100)', (col) => col.notNull().unique())
    .addColumn('imageUrl', 'varchar(300)', (col) => col.notNull())
    .addColumn('prompt', 'text', (col) => col.notNull())
    .addColumn('negativePrompt', 'text', (col) => col.notNull())
    .execute();

  // CreationStyle
  await db.schema
    .createTable('creationStyle')
    .$call(addDefaultColumns)
    .addColumn('creationId', 'char(26)', (col) => col.references('creation.id').notNull().onDelete('cascade'))
    .addColumn('styleId', 'char(26)', (col) => col.references('style.id').notNull().onDelete('cascade'))
    .execute();
  await db.schema
    .createIndex('unique_creation_style_pairs')
    .on('creationStyle')
    .columns(['creationId', 'styleId'])
    .unique()
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.dropTable('style').execute();
  await db.dropTable('creationStyle').execute();
}
