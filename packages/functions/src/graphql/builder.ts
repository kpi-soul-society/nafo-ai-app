import SchemaBuilder from '@pothos/core';
import ValidationPlugin from '@pothos/plugin-validation';
import { SessionValue } from 'sst/node/auth';

export const builder = new SchemaBuilder<{
  Context: SessionValue;
}>({
  plugins: [ValidationPlugin],
  validationOptions: {
    // optionally customize how errors are formatted
    validationError: (zodError, args, context, info) => {
      // the default behavior is to just throw the zod error directly
      return zodError;
    },
  },
});

builder.queryType({});
builder.mutationType({});
