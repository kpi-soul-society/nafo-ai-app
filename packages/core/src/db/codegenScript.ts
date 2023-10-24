import { DialectManager, Generator } from 'kysely-codegen';

export const generateTypesFromDBSchema = async () => {
  const dialectManager = new DialectManager();
  const dialect = dialectManager.getDialect('mysql');

  const db = await dialect.introspector.connect({
    connectionString: process.env.DB_URL || '',
    dialect,
  });
  const generator = new Generator();

  await generator.generate({
    camelCase: true,
    db,
    dialect,
    outFile: './sql.generated.ts',
  });

  await db.destroy();
};
