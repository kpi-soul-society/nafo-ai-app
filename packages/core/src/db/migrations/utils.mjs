import { CreateTableBuilder, sql } from 'kysely';

/**
 * @template T
 * @template C
 * @param builder {CreateTableBuilder<T, C>}
 */
export const addDefaultColumns = (builder) => {
  return builder
    .addColumn('id', 'char(26)', (col) => col.primaryKey().notNull())
    .addColumn('createdAt', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updatedAt', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`));
};

/**
 *
 * @param  {string[]} args
 */
export const mysqlEnum = (args) => {
  return sql`enum(${sql.join(args.map(sql.literal))})`;
};
