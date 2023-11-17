import type { ColumnType } from 'kysely';

export type Decimal = ColumnType<string, string | number, string | number>;

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Json = ColumnType<JsonValue, string, string>;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | null | number | string;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export interface Creation {
  id: string;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  userId: string;
  iterationCount: number;
  variationCount: number;
  textPrompt: string | null;
  enhancedTextPrompt: string | null;
  startingImageUrl: string | null;
  resultImageUrl: string | null;
  completionStatus: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  parentCreationId: string | null;
  deletedAt: Date | null;
  negativePrompt: string | null;
}

export interface CreationStyle {
  id: string;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  creationId: string;
  styleId: string;
}

export interface Style {
  id: string;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  name: string;
  imageUrl: string;
  prompt: string;
  negativePrompt: string;
}

export interface SupportRequest {
  id: string;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  customerEmail: string;
  subject: string;
  details: string;
  resolutionStatus: Generated<'DECLINED' | 'IN_PROGRESS' | 'NEW' | 'RESOLVED'>;
}

export interface SurprisePrompt {
  id: string;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  prompt: string;
}

export interface TokenAcquisition {
  id: string;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  userId: string;
  tokenNumber: number;
  referralTokenBonus: number | null;
  donation: number;
  donationCurrency: string;
  paymentProviderTransactionId: string | null;
  donationCurrencyToTokenExchangeRate: Decimal;
  status: 'APPROVED' | 'DECLINED' | 'EXPIRED' | 'IN_PROGRESS' | 'INITIATED';
}

export interface Upscale {
  id: string;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  variationId: string;
  imageUrl: string | null;
  completionStatus: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  factor: number;
}

export interface User {
  id: string;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  email: string;
  authProviderToItsUserIdentifierMap: Json;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  role: Generated<'ADMIN' | 'CUSTOMER'>;
  isLaunchWaitlistMember: Generated<number>;
  tokenNumber: Generated<number>;
  referrerId: string | null;
  isActive: Generated<number>;
}

export interface UserTokenHistory {
  id: string;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  userId: string;
  userTokenNumberBefore: number;
  userTokenNumberAfter: number;
  referredUserId: string | null;
  tokenAcquisitionId: string | null;
  creationId: string | null;
}

export interface Variation {
  id: string;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  creationId: string;
  imageUrl: string | null;
  isSharedToCommunity: Generated<number>;
}

export interface DB {
  creation: Creation;
  creationStyle: CreationStyle;
  style: Style;
  supportRequest: SupportRequest;
  surprisePrompt: SurprisePrompt;
  tokenAcquisition: TokenAcquisition;
  upscale: Upscale;
  user: User;
  userTokenHistory: UserTokenHistory;
  variation: Variation;
}
