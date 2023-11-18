'use client';
import React from 'react';

import { ContactSupportButton } from '@/components/common/ContactSupportButton';
import { CreationMenu } from '@/components/editor/CreationMenu';
import { Gallery } from '@/components/editor/Gallery';

const Editor = () => {
  return (
    <>
      <CreationMenu />
      <Gallery />
      <ContactSupportButton />
    </>
  );
};
export default Editor;
