import {
  generateMutationOp,
  generateQueryOp,
  MutationRequest,
  MutationResult,
  QueryRequest,
  QueryResult,
} from '@nafo-ai/graphql/genql';
import { cacheExchange, createClient, fetchExchange, OperationContext } from '@urql/core';
import { registerUrql } from '@urql/next/rsc';

import { REST_ENDPOINT } from '@/lib/config/next';

const makeClient = () => {
  return createClient({
    url: `${REST_ENDPOINT}/graphql`,
    exchanges: [cacheExchange, fetchExchange],
  });
};

export const registerServerSideUrqlClient = () => {
  const { getClient } = registerUrql(makeClient);

  const getTypedClient = () => {
    const res = getClient();

    const query = <Query extends QueryRequest>(opts: { query: Query; context?: Partial<OperationContext> }) => {
      const { query, variables } = generateQueryOp(opts.query);
      return res.query<QueryResult<Query>>(query, variables, opts.context);
    };

    const mutation = <Mutation extends MutationRequest>(opts: {
      mutation: Mutation;
      context?: Partial<OperationContext>;
    }) => {
      const { query, variables } = generateMutationOp(opts.mutation);

      return res.mutation<MutationResult<Mutation>>(query, variables, opts.context);
    };

    return {
      ...res,
      query,
      mutation,
    };
  };

  return { getTypedClient };
};
