'use client';
import React from 'react';

import { ContactSupportButton } from '@/components/common/ContactSupportButton';
import { CreationMenu } from '@/components/editor/CreationMenu';
import { Gallery } from '@/components/editor/Gallery';
import useSocketConnection from '@/lib/hooks/useSocketConnection';

const Editor = () => {
  useSocketConnection();
  return (
    <>
      <CreationMenu />
      <Gallery />
      <ContactSupportButton />
    </>
  );
};
export default Editor;
