'use client';
import React, { useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { Logo } from '@/components/images/Logo';
import { UAFlag } from '@/components/images/UAFlag';
import { UKFlag } from '@/components/images/UKFlag';

import PrivacyPolicyEN from './privacy-en.mdx';
import PrivacyPolicyUK from './privacy-uk.mdx';

function ClientPrivacy() {
  const [lang, setLang] = useState('en');
  const PrivacyPolicy = useMemo(() => (lang === 'uk' ? PrivacyPolicyUK : PrivacyPolicyEN), [lang]);
  return (
    <>
      <Head>
        <title>Privacy policy</title>
        <meta property="og:title" content="Pivacy policy" key="title" />
      </Head>
      <div>
        <header className="flex h-16 items-start px-10 py-10 sm:h-24 lg:px-20 xl:px-28">
          <Link href="/">
            <Logo className="h-8 sm:block md:h-12" />
          </Link>
        </header>
        <button onClick={() => (lang === 'uk' ? setLang('en') : setLang('uk'))} className="fixed right-0 top-0 p-4">
          {lang === 'uk' ? <UKFlag /> : <UAFlag />}
        </button>
        <div className="flex flex-col gap-y-5 overflow-hidden px-10 py-10 lg:px-20 xl:px-28">
          <PrivacyPolicy />
        </div>
      </div>
    </>
  );
}

export default ClientPrivacy;
