import { useCallback, useEffect, useRef, useState } from 'react';
import {
  generateMutationOp,
  generateQueryOp,
  MutationRequest,
  MutationResult,
  QueryRequest,
  QueryResult,
} from '@nafo-ai/graphql/genql';
import {
  cacheExchange,
  fetchExchange,
  OperationContext,
  OperationResult,
  RequestPolicy,
  ssrExchange,
} from '@urql/core';
import { authExchange } from '@urql/exchange-auth';
import {
  createClient,
  createRequest,
  useClient,
  useMutation,
  UseMutationResponse,
  UseMutationState,
  useQuery,
} from '@urql/next';
import { getSession, signOut } from 'next-auth/react';
import { pipe, toPromise } from 'wonka';

import { REST_ENDPOINT } from '@/lib/config/next';

async function initializeAuthState() {
  const session = await getSession();
  return { token: session?.user.accessToken || null };
}

/**
 * Used for client-side rendering
 */
export function useTypedQuery<Query extends QueryRequest>(opts: {
  query: Query;
  pause?: boolean;
  requestPolicy?: RequestPolicy;
  context?: Partial<OperationContext>;
}) {
  const { query, variables } = generateQueryOp(opts.query);
  return useQuery<QueryResult<Query>>({
    ...opts,
    query,
    variables,
  });
}

const initialState = {
  stale: false,
  fetching: false,
  data: undefined,
  error: undefined,
  operation: undefined,
  extensions: undefined,
};
export function useTypedMutation<
  Variables extends Record<string, any>,
  Mutation extends MutationRequest,
  Data extends MutationResult<Mutation>
>(builder: (vars: Variables) => Mutation, opts?: Partial<OperationContext>): UseMutationResponse<Data, Variables> {
  const client = useClient();
  const isMounted = useRef(true);
  const [state, setState] = useState<UseMutationState<Data, Variables>>(initialState);
  const executeMutation = useCallback(
    (vars?: Variables, context?: Partial<OperationContext>): Promise<OperationResult<Data, Variables>> => {
      setState({ ...initialState, fetching: true });
      const buildArgs = vars || ({} as Variables);
      const built = builder(buildArgs);
      useMutation;
      const { query, variables } = generateMutationOp(built);
      return pipe<OperationResult<Data, Variables>, Promise<OperationResult<Data, Variables>>>(
        client.executeMutation<Data, Variables>(createRequest(query, variables as Variables), { ...opts, ...context }),
        toPromise
      ).then((result: OperationResult<Data, Variables>) => {
        if (isMounted.current) {
          setState({
            fetching: false,
            stale: !!result.stale,
            data: result.data,
            error: result.error,
            extensions: result.extensions,
            operation: result.operation,
          });
        }
        return result;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, setState]
  );

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return [state, executeMutation];
}

export const createClientSideUrqlClient = () => {
  const ssr = ssrExchange();
  const client = createClient({
    url: `${REST_ENDPOINT}/graphql`,
    exchanges: [
      cacheExchange,
      authExchange(async (utils) => {
        // eslint-disable-next-line prefer-const
        let { token } = await initializeAuthState();
        return {
          addAuthToOperation(operation) {
            if (!token) return operation;
            return utils.appendHeaders(operation, {
              Authorization: `Bearer ${token}`,
            });
          },
          didAuthError(error, _operation) {
            return error.response.status === 401;
          },
          async refreshAuth() {
            await signOut({ redirect: true, callbackUrl: '/' });
          },
        };
      }),
      ssr,
      fetchExchange,
    ],
  });

  return { client, ssr };
};
