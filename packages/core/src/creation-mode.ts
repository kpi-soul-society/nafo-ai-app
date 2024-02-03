export * as CreationMode from './creation-mode';

import { SQL } from './db/sql';

export const list = async () => {
  return SQL.DB.selectFrom('creationMode').selectAll().orderBy('createdAt', 'desc').execute();
};
