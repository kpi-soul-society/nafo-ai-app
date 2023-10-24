import { UpdateUser, User } from '@nafo-ai/core/user';
import { ApiHandler } from 'sst/node/api';
import { AuthHandler, GoogleAdapter, Session } from 'sst/node/auth';
import { Config } from 'sst/node/config';
import { NextjsSite } from 'sst/node/site';
import { ulid } from 'ulid';

import { logger } from './util/logger';

declare module 'sst/node/auth' {
  export interface SessionTypes {
    user: {
      userId: string;
    };
  }
}

const baseSiteUrl = ['prod', 'dev'].includes(Config.STAGE) ? NextjsSite.Web.url : 'http://localhost:3000';
const redirectUrl = `${baseSiteUrl}/auth/redirect`;

export const authHandler = AuthHandler({
  providers: {
    google: GoogleAdapter({
      mode: 'oidc',
      clientID: Config.GOOGLE_CLIENT_ID || '',
      onSuccess: async (tokenset) => {
        const claims = tokenset.claims();

        if (!claims.email) {
          throw new Error('No email in claims');
        }

        const existingUser = await User.getByEmail(claims.email);

        // save in DB
        if (existingUser) {
          // update if needed
          const updatePayload: UpdateUser = {};

          if (claims.picture && existingUser.avatarUrl != claims.picture) {
            updatePayload.avatarUrl = claims.picture;
          }

          if (Object.keys(updatePayload).length) {
            await User.updateById(existingUser.id, updatePayload);
          }

          return Session.parameter({
            redirect: redirectUrl,
            type: 'user',
            properties: {
              userId: existingUser.id,
            },
          });
        } else {
          // create
          const id = ulid().toLowerCase();
          await User.create({
            id,
            email: claims.email || '',
            authProviderToItsUserIdentifierMap: JSON.stringify({ google: claims.sub }),
            avatarUrl: claims.picture,
            firstName: claims.given_name,
            lastName: claims.family_name,
          });

          logger.info(`Created a user with email ${claims.email} who signed in with Google`);

          return Session.parameter({
            redirect: redirectUrl,
            type: 'user',
            properties: {
              userId: id,
            },
          });
        }
      },
    }),
  },
});

export const handler = ApiHandler(async (event, context) => {
  try {
    return await authHandler(event, context);
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof TypeError && error?.message === 'checks.state argument is missing') {
      return {
        statusCode: 302,
        headers: {
          location: `https://${event.requestContext.domainName}/auth/google/authorize`,
        },
      };
    }
  }
});
