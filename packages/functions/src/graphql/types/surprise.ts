import { SQL } from '@nafo-ai/core/db/sql';
import { SurprisePrompt } from '@nafo-ai/core/surprise';
import { Response } from 'sst/node/api';

import { builder } from '../builder';

export const SurprisePromptType = builder.objectRef<SQL.Row['surprisePrompt']>('SurprisePrompt').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
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
  surprisePrompts: t.field({
    type: [SurprisePromptType],
    resolve: async (_, __, ctx) => {
      if (ctx.type !== 'user') {
        throw new Response({
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized' }),
        });
      }

      return SurprisePrompt.list();
    },
  }),
}));
