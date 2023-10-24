import { updateVariationPublicitySchema } from '@nafo-ai/core/common/validation';
import {
  CommunityVariationsPaginationSchema,
  communityVariationsPaginationSchema,
} from '@nafo-ai/core/common/validation/schemas/variation';
import { Creation } from '@nafo-ai/core/creation';
import { SQL } from '@nafo-ai/core/db/sql';
import { Variation } from '@nafo-ai/core/variation';

import { builder } from '../builder';

import { StyleType } from './style';

// FIXME: cannot import existing `CreationType` because it would cause circular dependency. Should create RawCreationType without the variation dependency
const VariationCreationType = builder.objectRef<SQL.Row['creation']>('VariationCreation').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    textPrompt: t.exposeString('textPrompt', { nullable: true }),
    resultImageUrl: t.exposeString('resultImageUrl', { nullable: true }),
    startingImageUrl: t.exposeString('startingImageUrl', { nullable: true }),
    negativePrompt: t.exposeString('negativePrompt', { nullable: true }),
    styles: t.field({
      type: [StyleType],
      resolve: (creation) => Creation.styles(creation.id),
    }),
    iterationCount: t.exposeInt('iterationCount'),
    variationCount: t.exposeInt('variationCount'),
  }),
});

export const VariationType = builder.objectRef<SQL.Row['variation']>('Variation').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    creationId: t.exposeID('creationId'),
    imageUrl: t.exposeString('imageUrl', { nullable: true }),
    isSharedToCommunity: t.exposeInt('isSharedToCommunity'),
    creation: t.field({
      type: VariationCreationType,
      resolve: (variation) => Creation.getById(variation.creationId),
    }),
    createdAt: t.field({
      type: 'String',
      resolve: (variation) => variation.createdAt.toISOString(),
    }),
    updatedAt: t.field({
      type: 'String',
      resolve: (variation) => variation.updatedAt.toISOString(),
    }),
  }),
});

const PaginatedVariationsType = builder
  .objectRef<{ variations: SQL.Row['variation'][]; page: number; limit: number; lastPage: number; total: number }>(
    'PaginatedVariations'
  )
  .implement({
    fields: (t) => ({
      variations: t.field({
        type: [VariationType],
        resolve: (paginatedVariations) => paginatedVariations.variations,
      }),
      page: t.exposeInt('page'),
      limit: t.exposeInt('limit'),
      lastPage: t.exposeInt('lastPage'),
      total: t.exposeInt('total'),
    }),
  });

builder.queryFields((t) => ({
  sharedVariations: t.field({
    type: PaginatedVariationsType,
    validate: {
      schema: communityVariationsPaginationSchema,
    },
    args: {
      page: t.arg.int({
        defaultValue: 1,
      }),
      limit: t.arg.int({
        defaultValue: 12,
      }),
    },
    resolve: (_, args) => {
      return Variation.getSharedWithCommunity(args as CommunityVariationsPaginationSchema);
    },
  }),
}));

builder.mutationFields((t) => ({
  setVariationPublicity: t.field({
    type: VariationType,
    validate: {
      schema: updateVariationPublicitySchema,
    },
    args: {
      variationId: t.arg.string({
        required: true,
      }),
      isSharedToCommunity: t.arg.int({
        required: true,
      }),
    },
    resolve: async (_, args, ctx) => {
      if (ctx.type !== 'user') {
        throw new Error('Not authenticated');
      }

      const updatedVariation = await Variation.updateById(args.variationId, {
        isSharedToCommunity: args.isSharedToCommunity,
      });
      if (!updatedVariation) {
        throw new Error('Creation not found');
      }

      return updatedVariation;
    },
  }),
}));
