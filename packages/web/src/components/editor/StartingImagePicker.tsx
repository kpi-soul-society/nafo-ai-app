import React, { ChangeEvent, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { DocumentMinusIcon, DocumentPlusIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

import { useEditorFormContext } from '@/lib/contexts/EditorFormProvider';

import { Dropdown } from '../common/Dropdown';

export const ACCEPTED_STARTING_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const StartingImagePicker = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { imageUrl, setImageUrl, imageFile, setImageFile } = useEditorFormContext();

  const formMethods = useFormContext();

  const handleImageAdditionButtonClick = () => {
    // @ts-expect-error todo
    fileInputRef.current.click();
  };

  const handleImageRemovalButtonClick = () => {
    formMethods?.setValue('startingImage', null);
    formMethods?.setValue('parentCreationId', null);
    setImageUrl(null);
    setImageFile(null);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }
    setImageFile(fileObj);
    setImageUrl(URL.createObjectURL(fileObj));
  };
  const { ref: formFieldInputRef, ...formFieldProperties } = formMethods.register('startingImage', {
    onChange: handleFileChange,
  });

  return (
    <Dropdown
      label="Starting image"
      isOpen={true}
      customIcon={
        !imageUrl && !imageFile ? (
          <>
            <DocumentPlusIcon className="h-6 hover:cursor-pointer" onClick={handleImageAdditionButtonClick} />
            <input
              type="file"
              className="hidden"
              {...formFieldProperties}
              ref={(e) => {
                formFieldInputRef(e);
                fileInputRef.current = e;
              }}
              accept={ACCEPTED_STARTING_IMAGE_TYPES.join(', ')}
            />
          </>
        ) : (
          <DocumentMinusIcon className="h-6 hover:cursor-pointer" onClick={handleImageRemovalButtonClick} />
        )
      }
    >
      {imageUrl && (
        <div className="relative h-24 w-24 overflow-hidden rounded-md">
          <Image
            src={imageUrl}
            alt="selected image preview"
            fill
            placeholder="blur"
            blurDataURL="/assets/empty_dog.png"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      {formMethods.formState.errors?.startingImage && (
        <p role="alert">{formMethods.formState.errors.startingImage?.message?.toString()}</p>
      )}
    </Dropdown>
  );
};
