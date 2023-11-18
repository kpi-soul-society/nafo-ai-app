import { FieldValues, SubmitHandler, useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ArrowDownCircleIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { ClientCreationGenerationSchema } from '@nafo-ai/core/common/validation';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

import { StartingImagePicker } from '@/components/editor/StartingImagePicker';
import { TextPromptSubmitter } from '@/components/editor/TextPromptSubmitter';
import { useTypedQuery } from '@/lib/client/graphqlClient';
import { REST_ENDPOINT } from '@/lib/config/next';
import { useEditorFormContext } from '@/lib/contexts/EditorFormProvider';
import { useEditorContext } from '@/lib/contexts/EditorProvider';
import { useWebSocketContext } from '@/lib/contexts/WebSocketProvider';
import { useMenuListControls } from '@/lib/hooks/useMenuListControls';
import { useScrollTooltip } from '@/lib/hooks/useScrollTooltip';

import { AsyncButton } from '../common/AsyncButton';
import { CommonSwitch } from '../common/CommonSwitch';
import { RangeSlider } from '../common/RangeSlider';
import { Cheebs } from '../images/Cheebs';

import { DropdownMenu } from './DropdownMenu';

export const CreationMenu = () => {
  const { data: session } = useSession();
  const { reconnectWebSocket } = useWebSocketContext();
  const [styles] = useTypedQuery({
    query: {
      styles: { id: true, name: true, imageUrl: true, prompt: true, negativePrompt: true },
    },
  });
  const { isLoading, isMenuOpen, creations, tokenNumber = 0, setPage, reloadCreations, page } = useEditorContext();
  const {
    clearStyles,
    selectStyle,
    selectedStyles,
    imageUrl,
    imageFile,
    isNegativePropmptVisible,
    setIsNegativePropmptVisible,
    randomizePrompt,
    iterationCount,
    setIterationCount,
    variations,
    setVariations,
  } = useEditorFormContext();
  const formMethods = useFormContext();
  const { errors } = formMethods.formState;
  const error = Object.values(errors)[0]?.message;

  const onSubmit = async (data: ClientCreationGenerationSchema) => {
    reconnectWebSocket && reconnectWebSocket();
    const formData = new FormData();
    formData.append('payload', JSON.stringify(data));
    if (imageFile) {
      formData.append('startingImage', imageFile);
    } else if (imageUrl) {
      formData.append('startingImageUrl', imageUrl);
    }
    const response = await fetch(`${REST_ENDPOINT}/creations/generations/dispatch`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
      body: formData,
    });
    if (response.status === 401) {
      toast.error('Re-login required.', {
        duration: 5000,
        position: 'top-center',
      });
      await signOut({
        redirect: true,
        callbackUrl: '/',
      });
      return;
    }
    if (!response.ok) {
      return toast.error('Failed to start generation. Try again.', {
        duration: 5000,
        position: 'top-center',
      });
    }

    // refetch with new creation displayed as first
    if (page !== 1) {
      setPage(1);
    } else {
      reloadCreations();
    }
    toast.success('Successfully started generation', {
      duration: 5000,
      position: 'top-center',
    });
  };

  const { open, addItem } = useMenuListControls();
  const { refElement, isTooltipVisible } = useScrollTooltip(open);
  return (
    <div
      className={`flex w-full flex-col border-gray-300 px-6 transition-all sm:w-1/4 sm:min-w-[18rem] sm:border-r md:min-w-[23rem] 2xl:min-w-[28rem] ${
        isMenuOpen ? 'opacity-1 visible' : 'invisible hidden opacity-0'
      }`}
    >
      <form onSubmit={formMethods.handleSubmit(onSubmit as SubmitHandler<FieldValues>)}>
        <div id="main-editor" className={`flex h-full w-full flex-col gap-y-2`}>
          <TextPromptSubmitter id="textPrompt" placeholder="Describe how your fella looks" />
          <button
            onClick={randomizePrompt}
            type="button"
            className="bg-secondary text-md flex items-center justify-center gap-2 rounded-lg p-1 font-semibold text-white"
          >
            SURPRISE ME
            <SparklesIcon className="h-5" />
          </button>
          <CommonSwitch
            checked={isNegativePropmptVisible}
            onChange={() => {
              setIsNegativePropmptVisible(!isNegativePropmptVisible);
            }}
            label="Remove from Image"
            className={`flex flex-row-reverse justify-between gap-2 pt-3 font-semibold ${
              isNegativePropmptVisible ? 'text-black' : 'text-gray-500'
            }`}
          />
          <div className={`${isNegativePropmptVisible ? 'flex' : 'hidden'}`}>
            <TextPromptSubmitter id="negativePrompt" placeholder="Describe what to remove from the image" />
          </div>
          <DropdownMenu
            id="selectedStyles"
            label="Styles"
            presetList={styles.data?.styles && styles.data?.styles}
            open={open}
            addItem={addItem}
            selectedItems={selectedStyles}
            handleItemClick={selectStyle}
            handleClear={clearStyles}
          />
          <StartingImagePicker />
          <DropdownMenu id="advancedSettings" label="Advanced Settings" open={open} addItem={addItem}>
            <div id="iterations-quantity-selector" className="flex flex-col">
              <span>Image quality preference</span>
              <div className="flex gap-x-2">
                <button
                  type="button"
                  className={`${
                    iterationCount === 20 ? 'bg-secondary' : 'bg-gray-400'
                  } my-2 w-full rounded-md px-3 py-2 text-lg font-semibold text-white shadow-sm hover:cursor-pointer hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                  onClick={() => {
                    setIterationCount(20);
                    formMethods.setValue('iterationCount', 20);
                  }}
                >
                  Speed
                </button>
                <button
                  type="button"
                  className={`${
                    iterationCount === 40 ? 'bg-secondary' : 'bg-gray-400'
                  } my-2 w-full rounded-md px-3 py-2 text-lg font-semibold text-white shadow-sm hover:cursor-pointer hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                  onClick={() => {
                    setIterationCount(40);
                    formMethods.setValue('iterationCount', 40);
                  }}
                >
                  Quality
                </button>
              </div>
            </div>
            <div id="variations-quantity-selector">
              <span>Number of variations</span>
              <RangeSlider
                name="variationCount"
                min={1}
                max={4}
                rangeValue={variations}
                setRangeValue={setVariations}
              />
            </div>
          </DropdownMenu>
          <div
            className={`bg-secondary fixed left-[24rem] z-20 flex h-12 w-12 items-center justify-center rounded-full text-white transition-all duration-500 2xl:left-[30rem] ${
              isTooltipVisible ? 'opacity-100' : 'hidden sm:opacity-0'
            } `}
            onClick={() => {
              refElement.current?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <ArrowDownCircleIcon className="h-12 w-12" />
          </div>
          <div className="text-md text-red-400">{error && (error as string)}</div>
          {tokenNumber === 0 && !isLoading ? (
            <Link href="/tokens" className="relative -left-1 top-4 z-20 h-12">
              <Cheebs
                withText
                dogSizes="w-28"
                bubbleSizes="w-36 sm:w-32 md:w-36"
                textSizes="text-[0.85rem] sm:text-[0.70rem] md:text-[0.85rem]"
                text={'Get more tokens!'}
              />
            </Link>
          ) : (
            creations.length === 0 &&
            !isLoading && (
              <div className="relative -left-1 top-4 h-12">
                <Cheebs
                  withText
                  dogSizes="w-28"
                  bubbleSizes="w-40 sm:w-28 md:w-40"
                  textSizes="text-[0.85rem] whitespace-nowrap"
                  text={'Just do it'}
                />
              </div>
            )
          )}
          <div ref={refElement}>
            <AsyncButton
              onClick={formMethods.handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
              type="submit"
              disabledClassName="!bg-lavander hover:bg-lavander"
              disabled={tokenNumber === 0}
              className="bg-secondary my-2 w-full rounded-md px-3 py-2 text-lg font-semibold text-white shadow-sm hover:cursor-pointer hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 md:text-2xl lg:text-3xl 2xl:py-3 2xl:text-5xl"
            >
              Generate
            </AsyncButton>
          </div>
        </div>
      </form>
    </div>
  );
};
