import { CreationMode } from '@nafo-ai/core/creation-mode';
import { SQL } from '@nafo-ai/core/db/sql';
import { Response } from 'sst/node/api';

import { builder } from '../builder';

export const CreationModeType = builder.objectRef<SQL.Row['creationMode']>('CreationMode').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    imageUrl: t.exposeString('imageUrl', { nullable: true }),
    createdAt: t.field({
      type: 'String',
      resolve: (style) => style.createdAt.toISOString(),
      nullable: true,
    }),
    updatedAt: t.field({
      type: 'String',
      resolve: (style) => style.updatedAt.toISOString(),
      nullable: true,
    }),
  }),
});

builder.queryFields((t) => ({
  creationModes: t.field({
    type: [CreationModeType],
    resolve: async (_, __, ctx) => {
      if (ctx.type !== 'user') {
        throw new Response({
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized' }),
        });
      }

      return CreationMode.list();
    },
  }),
}));
