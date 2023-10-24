import { Config, StackContext } from 'sst/constructs';

export function RDS({ stack, app }: StackContext) {
  const config = [new Config.Secret(stack, 'DB_URL')];

  app.addDefaultFunctionBinding(config);

  // DB connection for local dev can be overridden
  // https://docs.sst.dev/environment-variables#is_local
  const localDatabaseUrl = process.env['DB_URL'];
  if (process.env.IS_LOCAL && localDatabaseUrl) {
    app.addDefaultFunctionEnv({
      ['DB_URL']: localDatabaseUrl,
    });
  }
}
