export * as SurprisePrompt from './surprise';

import { SQL } from './db/sql';

export const list = async () => {
  return SQL.DB.selectFrom('surprisePrompt').selectAll().orderBy('createdAt', 'desc').execute();
};
