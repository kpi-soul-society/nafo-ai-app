import { Function, Script, StackContext } from 'sst/constructs';

export function DatabaseMigrations({ stack }: StackContext) {
  const migrationFunction = new Function(stack, 'DBMigrationScriptLambda', {
    enableLiveDev: false,
    handler: 'packages/core/src/db/migrationScript.handler',
    runtime: 'nodejs18.x',
    copyFiles: [
      {
        from: 'packages/core/src/db/migrations',
        to: 'packages/core/src/db/migrations',
      },
      {
        from: 'packages/core/package.json',
        to: 'packages/core/package.json',
      },
    ],
    timeout: '3 minutes',
    nodejs: {
      install: ['kysely', 'ulid'],
    },
  });

  // script to run migrations for us during deployment
  const script = new Script(stack, 'DBMigrationScript', {
    onCreate: migrationFunction,
    onUpdate: migrationFunction,
  });

  return { migrationFunction, script };
}
