'use client';
import React, { useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { Logo } from '@/components/images/Logo';
import { UAFlag } from '@/components/images/UAFlag';
import { UKFlag } from '@/components/images/UKFlag';

import TermsOfServiceEN from './terms-en.mdx';
import TermsOfServiceUK from './terms-uk.mdx';

function ClientTerms() {
  const [lang, setLang] = useState('en');
  const TermsOfService = useMemo(() => (lang === 'uk' ? TermsOfServiceUK : TermsOfServiceEN), [lang]);
  return (
    <>
      <Head>
        <title>Terms of Service</title>
        <meta property="og:title" content="Terms of Service" key="title" />
      </Head>

      <div>
        <header className="flex h-16 items-start px-10 py-10 sm:h-24 lg:px-20 xl:px-28">
          <Link href="/">
            <Logo className="h-8 md:h-12" />
          </Link>
        </header>
        <button className="fixed right-0 top-0 p-4" onClick={() => (lang === 'uk' ? setLang('en') : setLang('uk'))}>
          {lang === 'uk' ? <UKFlag /> : <UAFlag />}
        </button>
        <div className="flex flex-col gap-y-5 overflow-hidden px-10 py-10 lg:px-20 xl:px-28">
          <TermsOfService />
        </div>
      </div>
    </>
  );
}

export default ClientTerms;
