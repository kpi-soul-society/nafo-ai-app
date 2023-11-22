'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Style } from '@nafo-ai/graphql/genql';

import { useTypedQuery } from '../client/graphqlClient';
import { STAGE } from '../config/next';
import { useChipControls, WithId } from '../hooks/useChipControls';

export interface EditorForm {
  imageUrl: string | null;
  imageFile: File | null;
  setImageFile: (a: File | null) => void;
  setImageUrl: (a: string | null) => void;
  selectedStyles: Pick<Style, 'id'>[];
  selectStyle: (chip: WithId) => void;
  clearStyles: () => void;
  setStyleSelection: (_: Pick<Style, 'id'>[]) => void;
  setTextPrompt: (_: string) => void;
  setNegativePrompt: (_: string) => void;
  isPublic: boolean;
  setIsPublic: (_: boolean) => void;
  isNegativePropmptVisible: boolean;
  setIsNegativePropmptVisible: (_: boolean) => void;
  randomizePrompt: () => void;
  iterationCount: number;
  setIterationCount: (_: number) => void;
  variations: number;
  setVariations: (_: number) => void;
}

const intialValues: EditorForm = {
  imageUrl: null,
  imageFile: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  setImageFile: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  setImageUrl: () => {},
  selectedStyles: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  selectStyle: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  clearStyles: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setStyleSelection: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setTextPrompt: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setNegativePrompt: () => {},
  isPublic: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsPublic: () => {},
  isNegativePropmptVisible: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsNegativePropmptVisible: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  randomizePrompt: () => {},
  iterationCount: 20,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIterationCount: () => {},
  variations: STAGE === 'prod' ? 4 : 1,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setVariations: () => {},
};
export const EditorFormContext = createContext(intialValues);

export const EditorFormProvider = ({ children }: React.PropsWithChildren) => {
  const [imageUrl, setImageUrl] = useState<null | string>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [isNegativePropmptVisible, setIsNegativePropmptVisible] = useState(false);
  const [iterationCount, setIterationCount] = useState(STAGE === 'prod' ? 40 : 20);
  const [variations, setVariations] = useState(STAGE === 'prod' ? 4 : 1);
  const {
    selectedItems: selectedStyles,
    handleItemClick: selectStyle,
    handleClear: clearStyles,
    setSelection: setStyleSelection,
  } = useChipControls({
    chipsFieldName: 'selectedStyles',
  });
  const formMethods = useFormContext();
  const setTextPrompt = (text = '') => {
    formMethods.resetField('textPrompt');
    formMethods.setValue('textPrompt', text);
  };
  const setNegativePrompt = (text = '') => {
    formMethods.setValue('negativePrompt', text);
  };
  const [promptData] = useTypedQuery({
    query: {
      surprisePrompts: { prompt: true },
    },
    requestPolicy: 'cache-and-network',
  });

  const [surpriseIndex, setSurpriseIndex] = useState<null | number>(null);

  const getRandomInt = (max = 1) => {
    return Math.floor(Math.random() * max);
  };

  const randomizePrompt = () => {
    const prompts = promptData.data?.surprisePrompts ?? [];
    if (prompts.length > 1) {
      let randomIndex = getRandomInt(prompts.length);
      while (randomIndex === surpriseIndex) {
        randomIndex = getRandomInt(prompts.length);
      }
      setSurpriseIndex(randomIndex);
      formMethods.setFocus('textPrompt');
      if (document) {
        document.execCommand('selectAll', false);
        document.execCommand('insertText', false, prompts[randomIndex].prompt);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEvolveItem = sessionStorage.getItem('evolveItem') ?? '';
      const storedImageToImage = sessionStorage.getItem('imageToImage') ?? '';

      if (storedEvolveItem) {
        const evolveItem = JSON.parse(storedEvolveItem);
        const { id, textPrompt, startingImageUrl, negativePrompt, styles } = evolveItem;
        formMethods.setValue('parentId', id);
        textPrompt && setTextPrompt(textPrompt);
        negativePrompt && setNegativePrompt(negativePrompt);
        negativePrompt && setIsNegativePropmptVisible(true);
        styles && setStyleSelection(styles);
        startingImageUrl && setImageUrl(startingImageUrl);
        sessionStorage.removeItem('evolveItem');
      }

      if (storedImageToImage) {
        const imageToImage = JSON.parse(storedImageToImage);
        const { id, imageUrl } = imageToImage;
        formMethods.setValue('parentId', id);
        imageUrl && setImageUrl(imageUrl);
        sessionStorage.removeItem('imageToImage');
      }
    }
  }, []);

  return (
    <EditorFormContext.Provider
      value={{
        imageUrl,
        imageFile,
        setImageFile,
        setImageUrl,
        selectedStyles,
        selectStyle,
        clearStyles,
        setStyleSelection,
        setTextPrompt,
        setNegativePrompt,
        isPublic,
        setIsPublic,
        isNegativePropmptVisible,
        setIsNegativePropmptVisible,
        randomizePrompt,
        iterationCount,
        setIterationCount,
        variations,
        setVariations,
      }}
    >
      {children}
    </EditorFormContext.Provider>
  );
};

export const useEditorFormContext = () => {
  const context = useContext(EditorFormContext);
  return context;
};
