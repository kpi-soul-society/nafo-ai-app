import {
  CreateCheckoutSessionSchema,
  createCheckoutSessionSchema,
  updateUserSchema,
} from '@nafo-ai/core/common/validation';
import { Creation } from '@nafo-ai/core/creation';
import { SQL } from '@nafo-ai/core/db/sql';
import { Payment } from '@nafo-ai/core/payment';
import { CurrencyToTotalPaymentAmount, User } from '@nafo-ai/core/user';
import { Response } from 'sst/node/api';
import { Config } from 'sst/node/config';

import { builder } from '../builder';

export const UserRoleType = builder.enumType('UserRole', {
  values: ['ADMIN', 'CUSTOMER'],
});

export const CurrencyType = builder.enumType('Currency', {
  values: ['USD', 'UAH', 'EUR'],
});

export const CheckoutSessionType = builder.objectRef<{ checkoutUrl: string }>('CheckoutSession').implement({
  fields: (t) => ({
    checkoutUrl: t.exposeString('checkoutUrl'),
  }),
});

export const CurrencyToTotalDonation = builder
  .objectRef<CurrencyToTotalPaymentAmount>('CurrencyToTotalDonation')
  .implement({
    fields: (t) => ({
      USD: t.exposeFloat('USD'),
      UAH: t.exposeFloat('UAH'),
      EUR: t.exposeFloat('EUR'),
    }),
  });

export const UserStatsType = builder.objectRef<string>('UserStats').implement({
  fields: (t) => ({
    totalCreations: t.field({
      type: 'Int',
      resolve: async (userId) =>
        (
          await Creation.getByUserId(
            userId,
            {
              page: 1,
              limit: 1,
            },
            true
          )
        ).total,
    }),
    totalReferrals: t.field({
      type: 'Int',
      resolve: async (userId) => User.getNumberOfReferrals(userId),
    }),
    totalDonationsByCurrency: t.field({
      type: CurrencyToTotalDonation,
      resolve: (userId) => User.getTotalPaymentAmountByCurrency(userId),
    }),
  }),
});

const UserType = builder.objectRef<SQL.Row['user']>('User').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    firstName: t.exposeString('firstName', { nullable: true }),
    lastName: t.exposeString('lastName', { nullable: true }),
    avatarUrl: t.exposeString('avatarUrl', { nullable: true }),
    role: t.field({
      type: UserRoleType,
      resolve: (user) => user.role,
    }),
    isLaunchWaitlistMember: t.exposeInt('isLaunchWaitlistMember'),
    isActive: t.exposeInt('isActive'),
    tokenNumber: t.exposeInt('tokenNumber'),
    createdAt: t.field({
      type: 'String',
      resolve: (user) => user.createdAt.toISOString(),
    }),
    updatedAt: t.field({
      type: 'String',
      resolve: (user) => user.updatedAt.toISOString(),
    }),
  }),
});

builder.queryFields((t) => ({
  user: t.field({
    type: UserType,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_, args) => {
      const result = await User.getOne({ id: args.id });

      if (!result) {
        throw new Error('User not found');
      }

      return result;
    },
  }),

  me: t.field({
    type: UserType,
    resolve: async (_, __, ctx) => {
      if (ctx.type !== 'user') {
        throw new Response({
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized' }),
        });
      }

      const result = await User.getOne({ id: ctx.properties.userId });

      if (!result) {
        throw new Error('User not found');
      }

      return result;
    },
  }),

  myStats: t.field({
    type: UserStatsType,
    resolve: async (_, __, ctx) => {
      if (ctx.type !== 'user') {
        throw new Error('Not authenticated');
      }
      return ctx.properties.userId;
    },
  }),
}));

builder.mutationFields((t) => ({
  createCheckoutSession: t.field({
    type: CheckoutSessionType,
    validate: {
      schema: createCheckoutSessionSchema.pick({ amount: true, currency: true }),
    },
    args: {
      amount: t.arg.int({
        required: true,
      }),
      currency: t.arg({
        type: CurrencyType,
        required: true,
      }),
    },
    resolve: async (_, args, ctx) => {
      if (ctx.type !== 'user') {
        throw new Response({
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized' }),
        });
      }
      const body = args;
      const merchantData = [{ key: 'userId', value: ctx.properties.userId }];

      return Payment.createCheckoutSession({
        ...(body as CreateCheckoutSessionSchema),
        metadata: merchantData,
        orderDescription: 'Donation to United24 through nafoai.com',
        onSuccessRedirectUrl: `${Config.WEBSITE_URL}/editor`,
      });
    },
  }),

  setUserReferrerId: t.field({
    type: UserType,
    validate: {
      schema: updateUserSchema.pick({ referrerId: true }).required(),
    },
    args: {
      referrerId: t.arg.string({
        required: true,
      }),
    },
    resolve: async (_, args, ctx) => {
      if (ctx.type !== 'user') {
        throw new Response({
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized' }),
        });
      }

      const referrer = await User.getOne({ id: args.referrerId });
      if (!referrer) {
        throw new Error('Referrer not found');
      }

      await User.updateById(ctx.properties.userId, {
        referrerId: args.referrerId,
      });
      const user = await User.getById(ctx.properties.userId);

      return user;
    },
  }),

  deleteMyUser: t.field({
    type: 'Boolean',
    resolve: async (_, __, ctx) => {
      if (ctx.type !== 'user') {
        throw new Response({
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized' }),
        });
      }

      const existingUser = await User.getOne({ id: ctx.properties.userId });
      if (!existingUser) {
        throw new Error('User not found');
      }

      return User.deleteById(ctx.properties.userId);
    },
  }),
}));
