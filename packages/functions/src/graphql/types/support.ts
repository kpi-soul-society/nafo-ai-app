import { createSupportRequestSchema } from '@nafo-ai/core/common/validation';
import { Support } from '@nafo-ai/core/support';
import { ulid } from 'ulid';

import { builder } from '../builder';

builder.mutationFields((t) => ({
  createSupportRequest: t.field({
    type: 'Boolean',
    validate: {
      schema: createSupportRequestSchema,
    },
    args: {
      customerEmail: t.arg.string({
        required: true,
      }),
      subject: t.arg.string({
        required: true,
      }),
      details: t.arg.string({
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const id = ulid().toLowerCase();
      await Support.create({ ...args, id });
      await Support.Events.SupportRequestCreated.publish({ id });

      return true;
    },
  }),
}));
