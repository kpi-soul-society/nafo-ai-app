'use client';
import { createContext, useContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClientCreationGenerationSchema, clientSideCreationGenerationSchema } from '@nafo-ai/core/common/validation';
import { Creation, Style, Variation } from '@nafo-ai/graphql/genql';
import { UseQueryExecute } from '@urql/next';

import { useTypedQuery } from '../client/graphqlClient';
import { STAGE } from '../config/next';
import { useBreakpoint } from '../hooks/useBreakpoint';

import { EditorFormProvider } from './EditorFormProvider';
export type EditorVariation = Pick<Variation, 'imageUrl' | 'id' | 'isSharedToCommunity'>;
export interface Editor {
  isMenuOpen: boolean;
  onMenuClick: () => void;
  handleOpen: () => void;
  creations: (Pick<
    Creation,
    'id' | 'resultImageUrl' | 'completionStatus' | 'textPrompt' | 'startingImageUrl' | 'negativePrompt'
  > & {
    variations: EditorVariation[];
    styles: Pick<Style, 'id'>[];
  })[];
  tokenNumber: number | undefined;
  reloadCreations: UseQueryExecute;
  isLoading: boolean;
  page: number;
  lastPage: number;
  setPage: (_: number) => void;
  setLimit: (_: number) => void;
}

const intialValues: Editor = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onMenuClick: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  reloadCreations: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleOpen: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPage: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setLimit: () => {},
  page: 1,
  lastPage: 1,
  isMenuOpen: false,
  creations: [],
  isLoading: false,
  tokenNumber: undefined,
};
export const EditorContext = createContext(intialValues);

export const EditorProvider = ({ children }: React.PropsWithChildren) => {
  const formMethods = useForm<ClientCreationGenerationSchema>({
    defaultValues: {
      startingImage: undefined,
      iterationCount: STAGE === 'prod' ? 40 : 20,
      variationCount: 4,
      textPrompt: undefined,
      selectedStyles: undefined,
    },
    resolver: async (data, context, options) => {
      if ((data.startingImage as unknown as File[])?.length) {
        data.startingImage = (data.startingImage as unknown as File[])[0];
      } else {
        data.startingImage = undefined;
      }

      return zodResolver(clientSideCreationGenerationSchema)(data, context, options);
    },
  });
  const breakpoint = useBreakpoint();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(breakpoint === 'xs' ? 6 : 12);

  const [creationsData, refetch] = useTypedQuery({
    query: {
      myCreations: [
        { page, limit },
        {
          lastPage: true,
          creations: {
            id: true,
            resultImageUrl: true,
            completionStatus: true,
            styles: { id: true },
            textPrompt: true,
            variations: { id: true, imageUrl: true, isSharedToCommunity: true },
            startingImageUrl: true,
            negativePrompt: true,
          },
        },
      ],
    },
    requestPolicy: 'cache-and-network',
  });
  const [tokensData, refetchTokens] = useTypedQuery({
    query: {
      me: { tokenNumber: true },
    },
  });
  const lastPage = creationsData.data?.myCreations?.lastPage ?? 1;
  const creations = creationsData.data?.myCreations?.creations ?? [];
  const isLoading = creationsData.fetching;
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true);
  const onMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleOpen = () => {
    setIsMenuOpen(true);
  };

  return (
    <FormProvider {...formMethods}>
      <EditorContext.Provider
        value={{
          lastPage,
          page,
          setPage,
          setLimit,
          isMenuOpen,
          onMenuClick,
          creations,
          handleOpen,
          //requestPolicy is used for getting data only from network, not from cash
          reloadCreations: () => {
            refetch({ requestPolicy: 'network-only' });
            refetchTokens({ requestPolicy: 'network-only' });
          },
          isLoading,
          tokenNumber: tokensData?.data?.me.tokenNumber,
        }}
      >
        <EditorFormProvider>{children}</EditorFormProvider>
      </EditorContext.Provider>
    </FormProvider>
  );
};

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  return context;
};
