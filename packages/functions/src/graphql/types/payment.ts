import { SQL } from '@nafo-ai/core/db/sql';
import { Payment } from '@nafo-ai/core/payment';
import { Response } from 'sst/node/api';

import { builder } from '../builder';

export const TokenAcquisitionStatusType = builder.enumType('TokenAcquisitionStatus', {
  values: ['IN_PROGRESS', 'APPROVED', 'DECLINED', 'EXPIRED', 'INITIATED'],
});

const TokenAcquisitionType = builder.objectRef<SQL.Row['tokenAcquisition']>('TokenAcquisition').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    userId: t.exposeString('userId'),
    tokenNumber: t.exposeInt('tokenNumber'),
    paymentProviderTransactionId: t.exposeString('paymentProviderTransactionId', { nullable: true }),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error - This is numeric type in the DB
    donationCurrencyToTokenExchangeRate: t.exposeFloat('donationCurrencyToTokenExchangeRate'),
    status: t.field({
      type: TokenAcquisitionStatusType,
      resolve: (tokenAcquisition) => tokenAcquisition.status,
    }),
    createdAt: t.field({
      type: 'String',
      resolve: (creation) => creation.createdAt.toISOString(),
    }),
    updatedAt: t.field({
      type: 'String',
      resolve: (creation) => creation.updatedAt.toISOString(),
    }),
  }),
});

builder.queryFields((t) => ({
  tokenAcquisition: t.field({
    type: TokenAcquisitionType,
    args: {
      tokenAcquisitionId: t.arg.string({ required: true }),
    },
    resolve: async (_, args, ctx) => {
      if (ctx.type !== 'user') {
        throw new Response({
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized' }),
        });
      }
      const result = await Payment.getTokenAcquisitionById(args.tokenAcquisitionId);

      if (!result) {
        throw new Error('Token acquisition not found');
      }

      return result;
    },
  }),
}));
