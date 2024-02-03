import { profanity } from '@2toad/profanity';
import { z } from 'zod';

import { paginationSchema } from './common';

const style = z.object({
  id: z.string(),
  name: z.string(),
  prompt: z.string(),
  negativePrompt: z.string(),
});

const baseCreationGenerationSchema = z.object({
  iterationCount: z.coerce
    .number()
    .gte(20, 'Number of iterations should be at least 20')
    .lte(40, 'Number of iterations should be at most 40')
    .default(40),
  variationCount: z.coerce
    .number()
    .gte(1, 'Number of variations should be at least 1')
    .lte(4, 'Number of variations should be at most 4')
    .default(4),
  textPrompt: z
    .string()
    .nullish()
    .refine((t) => {
      if (t) {
        // eslint-disable-next-line no-useless-escape
        const regex = /^[\s\n~`!@#$%^&*()_+=[\]\{}|;':",.\/<>?a-zA-Z0-9-]+$/;
        return regex.test(t);
      }
      return true;
    }, 'The prompt allows only English, numbers and special characters')
    .refine((t) => {
      if (t) {
        return !profanity.exists(t);
      }
      return true;
    }, 'No NSFW prompts allowed'),
  selectedStyles: z.array(style).nullish(),
  startingImageUrl: z.string().nullish(),
  parentCreationId: z.string().nullish(),
  negativePrompt: z.string().nullish(),
  modeId: z.string(),
});

export const clientSideCreationGenerationSchema = baseCreationGenerationSchema
  .extend({
    startingImage: z
      .any()
      .refine(
        (startingImage) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(startingImage.type),
        'only .jpg, .jpeg, .png and .webp images are accepted.'
      )
      .refine((startingImage) => startingImage.size <= 10000000, `Max file size is 10MB.`)
      .nullish(),
  })
  .refine(
    ({ startingImage, selectedStyles, textPrompt, startingImageUrl }) =>
      startingImage || selectedStyles || (textPrompt && textPrompt.length) || startingImageUrl,
    {
      message: 'Please specify at least 1 of the generation options',
    }
  );

export const serverSideCreationGenerationSchema = baseCreationGenerationSchema
  .extend({
    userId: z.string(),
    startingImage: z
      .any()
      .refine(
        (startingImage) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(startingImage.mimetype),
        'only .jpg, .jpeg, .png and .webp images are accepted.'
      )
      .nullish(),
  })
  .refine(
    ({ startingImage, selectedStyles, textPrompt, startingImageUrl }) =>
      startingImage || selectedStyles || textPrompt || startingImageUrl,
    {
      message: 'Please specify at least 1 of the generation options',
    }
  );

export const creationCompletionStatusUpdatedEvent = {
  creationId: z.string(),
  actionType: z.literal('GENERATION_COMPLETE'),
};
const creationCompletionStatusUpdatedEventObjectSchema = z.object(creationCompletionStatusUpdatedEvent);

export const updateCreationThumbnailSchema = z.object({
  creationId: z.string(),
  thumbnailUrl: z.string(),
});

export const deleteCreationSchema = z.object({
  creationId: z.string(),
});

export const userCreationsPaginationSchema = paginationSchema.extend({
  page: z.number().gte(1).default(1),
  limit: z.number().gte(6).default(6),
});

export type UserCreationsPaginationSchema = z.infer<typeof userCreationsPaginationSchema>;

export type UpdateCreationThumbnailSchema = z.infer<typeof updateCreationThumbnailSchema>;

export type DeleteCreationSchema = z.infer<typeof deleteCreationSchema>;

export type CreationCompletionStatusUpdatedEventSchema = z.infer<
  typeof creationCompletionStatusUpdatedEventObjectSchema
>;

export type ClientCreationGenerationSchema = z.infer<typeof clientSideCreationGenerationSchema>;
export type ServerCreationGenerationSchema = z.infer<typeof serverSideCreationGenerationSchema>;
export type CreationGenerationStyleSchema = z.infer<typeof style>;
