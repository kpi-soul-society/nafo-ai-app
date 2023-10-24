import { SQL } from '@nafo-ai/core/db/sql';
import { Style } from '@nafo-ai/core/style';
import { Response } from 'sst/node/api';

import { builder } from '../builder';

export const StyleType = builder.objectRef<SQL.Row['style']>('Style').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    imageUrl: t.exposeString('imageUrl'),
    prompt: t.exposeString('prompt'),
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
  styles: t.field({
    type: [StyleType],
    resolve: async (_, __, ctx) => {
      if (ctx.type !== 'user') {
        throw new Response({
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized' }),
        });
      }

      return Style.list();
    },
  }),
}));
