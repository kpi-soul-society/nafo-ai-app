import { CamelCasePlugin, Kysely, MysqlDialect, Selectable } from 'kysely';
import { createPool } from 'mysql2';
import { Config } from 'sst/node/config';

import type { DB as Database } from './sql.generated';

export const DB = new Kysely<Database>({
  dialect: new MysqlDialect({
    pool: createPool({
      uri: process.env.DB_URL || Config.DB_URL,
    }),
  }),
  plugins: [new CamelCasePlugin()],
});

export type Row = {
  [Key in keyof Database]: Selectable<Database[Key]>;
};

export * as SQL from './sql';
