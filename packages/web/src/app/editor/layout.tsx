import { Metadata } from 'next';

import UrqlContext from '@/components/common/UrqlContext';
import { Header } from '@/components/editor/Header';
import { EditorProvider } from '@/lib/contexts/EditorProvider';

export const metadata: Metadata = {
  title: 'Editor',
  description: 'Creation of your NAFO images happens here',
  twitter: {
    title: 'Editor',
  },
  openGraph: {
    title: 'Editor',
  },
};

export default async function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <UrqlContext>
      <EditorProvider>
        <main className="flex h-screen min-h-screen flex-col justify-between gap-x-10 font-sans">
          <Header />
          <div id="side-gallery" className={`flex w-full flex-grow flex-col gap-y-10 sm:flex-row`}>
            {children}
          </div>
        </main>
      </EditorProvider>
    </UrqlContext>
  );
}
