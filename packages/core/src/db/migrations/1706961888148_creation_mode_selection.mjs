// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Kysely } from 'kysely';
import { addDefaultColumns } from './utils.mjs';
import { ulid } from 'ulid';

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .createTable('creation_mode')
    .$call(addDefaultColumns)
    .addColumn('name', 'varchar(100)', (col) => col.notNull().unique())
    .execute();

  const avatarModeId = ulid().toLowerCase();
  const artworkModeId = ulid().toLowerCase();
  await db
    .insertInto('creation_mode')
    .values([
      {
        id: avatarModeId,
        name: 'avatar',
      },
      {
        id: artworkModeId,
        name: 'artwork',
      },
    ])
    .execute();

  await db.schema
    .alterTable('creation')
    .addColumn('modeId', 'varchar(100)', (col) => col.notNull().references('creation_mode.id'))
    .addColumn('imageUrl', 'varchar(300)', (col) => col.notNull())
    .execute();

  await db.updateTable('creation').set({ modeId: avatarModeId }).execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {}
