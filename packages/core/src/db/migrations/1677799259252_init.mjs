// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Kysely } from 'kysely';
import { addDefaultColumns, mysqlEnum } from './utils.mjs';

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  const userRoleDataType = mysqlEnum(['ADMIN', 'CUSTOMER']);
  const imageGenerationCompletionStatusDataType = mysqlEnum(['PENDING', 'IN_PROGRESS', 'COMPLETED']);

  // User
  await db.schema
    .createTable('user')
    .$call(addDefaultColumns)
    .addColumn('email', 'varchar(100)', (col) => col.notNull().unique())
    .addColumn('authProviderToItsUserIdentifierMap', 'json', (col) => col.notNull())
    .addColumn('firstName', 'varchar(100)')
    .addColumn('lastName', 'varchar(100)')
    .addColumn('avatarUrl', 'varchar(300)')
    .addColumn('role', userRoleDataType, (col) => col.notNull().defaultTo('CUSTOMER'))
    .addColumn('isLaunchWaitlistMember', 'boolean', (col) => col.notNull().defaultTo(false))
    .execute();

  // Creation
  await db.schema
    .createTable('creation')
    .$call(addDefaultColumns)
    .addColumn('userId', 'char(26)', (col) => col.references('user.id').notNull().onDelete('cascade'))
    .addColumn('iterationCount', 'integer', (col) => col.notNull())
    .addColumn('variationCount', 'integer', (col) => col.notNull())
    .addColumn('textPrompt', 'text')
    .addColumn('enhancedTextPrompt', 'text')
    .addColumn('negativePrompt', 'text')
    .addColumn('startingImageUrl', 'varchar(300)')
    .addColumn('resultImageUrl', 'varchar(300)')
    .addColumn('completionStatus', imageGenerationCompletionStatusDataType, (col) => col.notNull())
    .execute();

  // Variation
  await db.schema
    .createTable('variation')
    .$call(addDefaultColumns)
    .addColumn('creationId', 'char(26)', (col) => col.references('creation.id').notNull().onDelete('cascade'))
    .addColumn('imageUrl', 'varchar(300)')
    .addColumn('isSharedToCommunity', 'boolean', (col) => col.notNull().defaultTo(false))
    .execute();

  // Upscale
  await db.schema
    .createTable('upscale')
    .$call(addDefaultColumns)
    .addColumn('variationId', 'char(26)', (col) => col.references('variation.id').notNull().onDelete('cascade'))
    .addColumn('imageUrl', 'varchar(300)')
    .addColumn('completionStatus', imageGenerationCompletionStatusDataType, (col) => col.notNull())
    .addColumn('factor', 'integer', (col) => col.notNull())
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema.dropTable('upscale').execute();
  await db.schema.dropTable('variation').execute();
  await db.schema.dropTable('creation').execute();
  await db.schema.dropTable('user').execute();
}
