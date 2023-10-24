// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Kysely } from 'kysely';
import { addDefaultColumns } from './utils.mjs';

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  // Surprise prompt
  await db.schema
    .createTable('surprisePrompt')
    .$call(addDefaultColumns)
    .addColumn('prompt', 'text', (col) => col.notNull())
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema.dropTable('surprisePrompt').execute();
}
