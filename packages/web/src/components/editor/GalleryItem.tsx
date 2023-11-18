import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  CreationCompletionStatusUpdatedEventSchema,
  DeleteCreationSchema,
  UpdateCreationThumbnailSchema,
  UpdateVariationPublicitySchema,
} from '@nafo-ai/core/common/validation';
import { Style } from '@nafo-ai/graphql/genql';
import Image from 'next/image';

import { useTypedMutation } from '@/lib/client/graphqlClient';
import { CarouselProvider } from '@/lib/contexts/CarouselProvider';
import { useEditorFormContext } from '@/lib/contexts/EditorFormProvider';
import { EditorVariation, useEditorContext } from '@/lib/contexts/EditorProvider';
import { useWebSocketContext } from '@/lib/contexts/WebSocketProvider';

import { ModalDialog } from '../common/ModalDialog';
import { emptyDogPlaceholder } from '../images/EmptyDog';

import { CheebsSettings } from './CheebsSettings';

interface GalleryItemProps {
  id: string;
  imageUrl: string;
  isImageReady: boolean;
  variations: EditorVariation[];
  styles: Pick<Style, 'id'>[];
  textPrompt: string;
  startingImageUrl: string;
  negativePrompt: string;
}

export const GalleryItem = ({
  id,
  imageUrl,
  isImageReady,
  variations,
  styles,
  textPrompt,
  startingImageUrl,
  negativePrompt,
}: GalleryItemProps) => {
  const [image, setImage] = useState(isImageReady ? imageUrl : null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { socketData } = useWebSocketContext() as { socketData: CreationCompletionStatusUpdatedEventSchema };

  const handleCreationStatusUpdate = useCallback(() => {
    if (socketData && socketData.actionType === 'GENERATION_COMPLETE') {
      if (socketData.creationId === id) {
        setImage(imageUrl);
      }
    }
  }, [socketData, imageUrl, id]);

  useEffect(() => {
    handleCreationStatusUpdate();
  }, [handleCreationStatusUpdate]);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const closeModal = () => {
    setIsOpen(false);
  };
  const openModal = useCallback(() => {
    image && setIsOpen(true);
  }, [image]);

  const {
    setImageUrl,
    setStyleSelection,
    setTextPrompt,
    setIsNegativePropmptVisible,
    isNegativePropmptVisible,
    setNegativePrompt,
  } = useEditorFormContext();
  const { handleOpen, reloadCreations } = useEditorContext();
  const formMethods = useFormContext();

  const handleEvolve = () => {
    setTextPrompt(textPrompt);
    if (negativePrompt) {
      if (!isNegativePropmptVisible) {
        setIsNegativePropmptVisible(true);
      }
      setNegativePrompt(negativePrompt);
    }
    setStyleSelection(styles);
    setImageUrl(startingImageUrl);
    closeModal();
    handleOpen();
    formMethods.setValue('parentCreationId', id);
  };

  const handleSetRef = (imageUrl = '') => {
    setImageUrl(imageUrl);
    closeModal();
    handleOpen();
    formMethods.setValue('parentCreationId', id);
  };

  const [_, deleteCreation] = useTypedMutation(({ creationId }: DeleteCreationSchema) => ({
    deleteCreation: [
      {
        creationId,
      },
    ],
  }));
  const handleDelete = async () => {
    await deleteCreation({ creationId: id });
    await reloadCreations();
    closeModal();
  };

  const [__, setMainVariation] = useTypedMutation(({ creationId, thumbnailUrl }: UpdateCreationThumbnailSchema) => ({
    setCreationThumbnail: [
      {
        creationId,
        thumbnailUrl,
      },
      { variations: { id: true, imageUrl: true }, resultImageUrl: true },
    ],
  }));
  const [___, setVariationPublicity] = useTypedMutation(
    ({ variationId, isSharedToCommunity }: UpdateVariationPublicitySchema) => ({
      setVariationPublicity: [
        {
          variationId,
          isSharedToCommunity,
        },
        { id: true },
      ],
    })
  );
  const handlePublish = ({ id = '' }) => {
    setVariationPublicity({ variationId: id, isSharedToCommunity: 1 });
  };
  const handleUnpublish = ({ id = '' }) => {
    setVariationPublicity({ variationId: id, isSharedToCommunity: 0 });
  };
  const handleSetMain = async (imageUrl = '') => {
    const { data } = await setMainVariation({ creationId: id, thumbnailUrl: imageUrl });
    setImage(data?.setCreationThumbnail?.resultImageUrl ?? image);
  };

  return (
    <div
      key={id}
      className={`text-secondary relative aspect-[15/20] w-full shrink-0 grow-0 overflow-hidden rounded-2xl`}
    >
      {!image && (
        <div className="absolute left-[50%] top-[50%] z-10 aspect-square w-[95%] translate-x-[-50%] translate-y-[-50%] transform">
          <Image src="/assets/hammer_loader.gif" alt="loader" fill />
        </div>
      )}
      <Image
        src={image ?? '/assets/empty_dog.png'}
        alt="NAFO dog"
        priority
        fill
        onLoad={() => {
          setIsImageLoading(false);
        }}
        style={{ objectFit: 'cover' }}
        className={`${(!image || isImageLoading) && 'animate-pulse'}`}
        onClick={openModal}
        placeholder={emptyDogPlaceholder}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <ModalDialog isOpen={isOpen} onClose={closeModal}>
        <CarouselProvider<EditorVariation> items={variations}>
          <CheebsSettings
            textPrompt={textPrompt}
            mainUrl={imageUrl}
            handleEvolve={handleEvolve}
            handleDelete={handleDelete}
            handleSetMain={handleSetMain}
            handleSetRef={handleSetRef}
            handlePublish={handlePublish}
            handleUnpublish={handleUnpublish}
          />
        </CarouselProvider>
      </ModalDialog>
    </div>
  );
};
