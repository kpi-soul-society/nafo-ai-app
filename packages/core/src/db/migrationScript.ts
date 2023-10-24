import { CamelCasePlugin, Kysely, Migration, Migrator, MysqlDialect } from 'kysely';
import { createPool } from 'mysql2';
import { Config } from 'sst/node/config';

export const handler = async () => {
  await migrate('/var/task/packages/core/src/db/migrations');

  return 'Migrations finished';
};

export const migrate = async (migrationSource: string) => {
  const k = new Kysely({
    dialect: new MysqlDialect({
      pool: createPool({
        uri: process.env.DB_URL || Config.DB_URL,
      }),
    }),
    plugins: [new CamelCasePlugin()],
  });

  const migrator = new Migrator({
    db: k,
    provider: new DynamicFileMigrationProvider(migrationSource),
  });
  const { error, results } = await migrator.migrateToLatest();
  await k.destroy();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });
  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }

  return 'Migrations finished';
};

class DynamicFileMigrationProvider {
  #migrationFolder;
  constructor(migrationFolder: string) {
    this.#migrationFolder = migrationFolder;
  }

  async getMigrations() {
    // avoid top-level ndoe dependencies
    const fs = await import('fs/promises');
    const path = await import('path');

    const migrations: Record<string, Migration> = {};
    const files = await fs.readdir(this.#migrationFolder);
    for (const fileName of files) {
      if (
        fileName.endsWith('.js') ||
        fileName.endsWith('.mjs') ||
        (fileName.endsWith('.mts') && !fileName.endsWith('.d.mts'))
      ) {
        const [name] = path.basename(fileName).split('.');
        const fullPath = path.join(this.#migrationFolder, fileName);

        const migration = await import(fullPath);

        // handle esModuleInterop export's `default` prop...
        if (isMigration(migration?.default)) {
          migrations[name] = migration;
        } else if (isMigration(migration)) {
          migrations[name] = migration;
        }
        continue;
      }
    }
    return migrations;
  }
}

function isMigration(obj: any) {
  return typeof obj === 'object' && obj !== null && typeof obj.up === 'function';
}
