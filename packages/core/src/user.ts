export * as User from './user';
import { InsertObject, sql, UpdateObject } from 'kysely';
import { ulid } from 'ulid';

import { userPaymentStatusUpdatedEvent } from './common/validation';
import { USER_REFERRAL_BONUS_TOKENS } from './common/validation/constants';
import { SQL } from './db/sql';
import { DB, TokenAcquisition } from './db/sql.generated';
import { event } from './event';

export async function getOne({ id, email }: GetUser) {
  let query = SQL.DB.selectFrom('user').selectAll();

  if (id) {
    query = query.where('id', '=', id);
  }
  if (email) {
    query = query.where('email', '=', email);
  }

  return query.executeTakeFirst();
}

export const getById = async (userId: string) => {
  return SQL.DB.selectFrom('user').selectAll().where('id', '=', userId).executeTakeFirstOrThrow();
};

export const getByEmail = async (email: string) => {
  return SQL.DB.selectFrom('user').selectAll().where('email', '=', email).executeTakeFirst();
};

export const create = async (payload: CreateUser) => {
  const id = payload.id || ulid().toLowerCase();
  await SQL.DB.insertInto('user')
    .values([{ ...payload, id }])
    .execute();

  return getById(id);
};

export const deleteById = async (userId: string) => {
  await SQL.DB.deleteFrom('user').where('id', '=', userId).execute();
  return true;
};

export const updateById = async (userId: string, payload: UpdateUser) => {
  await SQL.DB.updateTable('user')
    .set({ ...payload, updatedAt: sql`now()` })
    .where('id', '=', userId)
    .execute();
};

export const getTotalPaymentAmountByCurrency = async (userId: string): Promise<CurrencyToTotalPaymentAmount> => {
  const result = await SQL.DB.selectFrom('tokenAcquisition')
    .select([
      (eb) => eb.fn.coalesce(eb.fn.sum<number>('donation'), sql<number>`0`).as('totalAmount'),
      'donationCurrency',
    ])
    .where('status', '=', 'APPROVED')
    .where('userId', '=', userId)
    .groupBy('donationCurrency')
    .execute();

  const totalPaymentAmountByCurrency = result.reduce<CurrencyToTotalPaymentAmount>(
    (acc, curr) => {
      const { donationCurrency, totalAmount } = curr as {
        donationCurrency: keyof CurrencyToTotalPaymentAmount;
        totalAmount: number;
      };

      const roundedDonationAmountInCurrency = parseFloat((totalAmount / 100).toFixed(2));
      acc[donationCurrency] = roundedDonationAmountInCurrency;
      return acc;
    },
    { USD: 0, UAH: 0, EUR: 0 }
  );

  return totalPaymentAmountByCurrency;
};

export const getNumberOfReferrals = async (userId: string): Promise<number> => {
  const result = await SQL.DB.selectFrom('user')
    .select((eb) => eb.fn.count<number>('id').as('referralsCount'))
    .where('referrerId', '=', userId)
    .executeTakeFirstOrThrow();

  return result.referralsCount;
};

export const updatePaymentStatus = async (payload: UpdatePaymentStatus) => {
  const existingAcquisition = await SQL.DB.selectFrom('tokenAcquisition')
    .selectAll()
    .where('paymentProviderTransactionId', '=', payload.paymentProviderTransactionId)
    .executeTakeFirst();
  if (!existingAcquisition) {
    console.log(`Could not find payment with transaction id ${payload.paymentProviderTransactionId}`);
    return;
  }

  if (existingAcquisition.status === 'APPROVED' || existingAcquisition.status === 'DECLINED') {
    console.log('Payment is already at latest status, no update needed');
    return;
  }

  if (existingAcquisition.status === payload.orderStatus) {
    console.log('Payment is already at the incoming status, no update needed');
    return;
  }

  await SQL.DB.updateTable('tokenAcquisition')
    .set({ status: payload.orderStatus })
    .where('paymentProviderTransactionId', '=', payload.paymentProviderTransactionId)
    .execute();

  return SQL.DB.selectFrom('tokenAcquisition')
    .selectAll()
    .where('paymentProviderTransactionId', '=', payload.paymentProviderTransactionId)
    .executeTakeFirstOrThrow();
};

export const acquireTokens = async (payload: AcquireTokens) => {
  const { tokenAcquisition } = await SQL.DB.transaction().execute(async (trx) => {
    const existingAcquisition = await trx
      .selectFrom('tokenAcquisition')
      .selectAll()
      .where('paymentProviderTransactionId', '=', payload.paymentProviderTransactionId)
      .executeTakeFirst();
    if (!existingAcquisition) {
      throw new Error(`Could not find token acquisition with transaction id ${payload.paymentProviderTransactionId}`);
    }

    if (existingAcquisition.status === 'APPROVED') {
      console.log(`acquistion ${existingAcquisition.id} was already approved, not adding user tokens`, payload);
      return { tokenAcquisition: existingAcquisition };
    }
    const user = await trx.selectFrom('user').selectAll().where('id', '=', payload.userId).executeTakeFirst();
    if (!user) {
      throw new Error(`User ${payload.userId} who started the payment was not found`);
    }

    const updateTokenAcquisitionPayload: UpdateObject<DB, 'tokenAcquisition'> = {
      status: 'APPROVED',
    };
    let tokenNumberToSetOnUser = user.tokenNumber;

    // Add referral bonus if user has a referrer and this is their first approved donation
    if (user.referrerId) {
      const atLeastOnePreviouslyApprovedAcquisition = await trx
        .selectFrom('tokenAcquisition')
        .select('id')
        .where('status', '=', 'APPROVED')
        .where('userId', '=', user.id)
        .executeTakeFirst();

      if (!atLeastOnePreviouslyApprovedAcquisition) {
        updateTokenAcquisitionPayload.referralTokenBonus = USER_REFERRAL_BONUS_TOKENS;
        tokenNumberToSetOnUser += USER_REFERRAL_BONUS_TOKENS;

        const referrer = await trx.selectFrom('user').selectAll().where('id', '=', user.referrerId).executeTakeFirst();

        if (referrer) {
          await trx
            .updateTable('user')
            .set({ tokenNumber: referrer.tokenNumber + USER_REFERRAL_BONUS_TOKENS })
            .where('id', '=', referrer.id)
            .execute();
          await trx
            .insertInto('userTokenHistory')
            .values([
              {
                id: ulid().toLowerCase(),
                userId: referrer.id,
                userTokenNumberBefore: referrer.tokenNumber,
                userTokenNumberAfter: referrer.tokenNumber + USER_REFERRAL_BONUS_TOKENS,
                referredUserId: user.id,
              },
            ])
            .execute();
        } else {
          console.error(`Could not find referrer with id ${user.referrerId}`);
        }
      }
    }

    await trx
      .updateTable('tokenAcquisition')
      .set(updateTokenAcquisitionPayload)
      .where('paymentProviderTransactionId', '=', payload.paymentProviderTransactionId)
      .execute();
    const tokenAcquisition = await trx
      .selectFrom('tokenAcquisition')
      .selectAll()
      .where('paymentProviderTransactionId', '=', payload.paymentProviderTransactionId)
      .executeTakeFirstOrThrow();
    tokenNumberToSetOnUser += tokenAcquisition.tokenNumber;

    await trx
      .updateTable('user')
      .set({ tokenNumber: tokenNumberToSetOnUser, isActive: 1 })
      .where('id', '=', user.id)
      .execute();
    await trx
      .insertInto('userTokenHistory')
      .values([
        {
          id: ulid().toLowerCase(),
          userId: user.id,
          tokenAcquisitionId: tokenAcquisition.id,
          userTokenNumberBefore: user.tokenNumber,
          userTokenNumberAfter: tokenNumberToSetOnUser,
        },
      ])
      .execute();

    return { tokenAcquisition };
  });

  return tokenAcquisition;
};

export const isActivated = async (userId: string) => {
  return SQL.DB.selectFrom('user')
    .selectAll()
    .innerJoin('tokenAcquisition', 'tokenAcquisition.userId', 'user.id')
    .where('user.id', '=', userId)
    .executeTakeFirst();
};

export const Events = {
  PaymentStatusUpdated: event('user.payment-status-updated', userPaymentStatusUpdatedEvent),
};

export interface GetUser {
  id?: string;
  email?: string;
}

export type CreateUser = InsertObject<DB, 'user'> & { id?: string };
export type UpdateUser = UpdateObject<DB, 'user'>;
export interface AcquireTokens {
  donation: number;
  donationCurrency: string;
  paymentProviderTransactionId: string;
  userId: string;
}
export interface UpdatePaymentStatus {
  orderStatus: TokenAcquisition['status'];
  paymentProviderTransactionId: string;
}

export interface CurrencyToTotalPaymentAmount {
  USD: number;
  UAH: number;
  EUR: number;
}
