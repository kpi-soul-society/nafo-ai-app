// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Kysely } from 'kysely';
import { addDefaultColumns, mysqlEnum } from './utils.mjs';

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable('creation')
    .addColumn('parentCreationId', 'char(26)', (col) => col.references('creation.id').onDelete('set null'))
    .addColumn('deletedAt', 'timestamp')
    .execute();

  const tokenAcquisitionStatus = mysqlEnum(['INITIATED', 'IN_PROGRESS', 'APPROVED', 'DECLINED', 'EXPIRED']);

  // Add tokens to user
  await db.schema
    .alterTable('user')
    .addColumn('tokenNumber', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('referrerId', 'char(26)', (col) => col.references('user.id').onDelete('set null'))
    .addColumn('isActive', 'boolean', (col) => col.notNull().defaultTo(false))
    .execute();

  // Token acquisition
  await db.schema
    .createTable('tokenAcquisition')
    .$call(addDefaultColumns)
    .addColumn('userId', 'char(26)', (col) => col.references('user.id').notNull().onDelete('cascade'))
    .addColumn('tokenNumber', 'integer', (col) => col.notNull())
    .addColumn('referralTokenBonus', 'integer')
    .addColumn('donation', 'bigint', (col) => col.notNull())
    .addColumn('donationCurrency', 'varchar(10)', (col) => col.notNull())
    .addColumn('paymentProviderTransactionId', 'varchar(100)', (col) => col.unique())
    .addColumn('donationCurrencyToTokenExchangeRate', 'decimal(6,2)', (col) => col.notNull())
    .addColumn('status', tokenAcquisitionStatus, (col) => col.notNull())
    .execute();

  // Token history
  await db.schema
    .createTable('userTokenHistory')
    .$call(addDefaultColumns)
    .addColumn('userId', 'char(26)', (col) => col.references('user.id').notNull().onDelete('cascade'))
    .addColumn('userTokenNumberBefore', 'integer', (col) => col.notNull())
    .addColumn('userTokenNumberAfter', 'integer', (col) => col.notNull())
    .addColumn('referredUserId', 'char(26)', (col) => col.references('user.id').onDelete('cascade'))
    .addColumn('tokenAcquisitionId', 'char(26)', (col) => col.references('tokenAcquisition.id').onDelete('cascade'))
    .addColumn('creationId', 'char(26)', (col) => col.references('creation.id').onDelete('cascade'))
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema.dropTable('userTokenHistory').execute();
  await db.schema.dropTable('tokenAcquisition').execute();
  await db.schema.dropColumn('user', 'tokenNumber').execute();
}
