import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

import { EmptyDogComponent, emptyDogPlaceholder } from '../images/EmptyDog';

const USER_ACTIONS = [
  { name: 'Profile', url: '/profile' },
  {
    name: 'Log Out',
    url: '/',
    action: () => {
      signOut();
    },
  },
];

export const UserMenu = () => {
  const { data: session } = useSession();
  return (
    <>
      <Menu as="div" className="relative inline-block text-left text-lg font-medium text-white 2xl:text-xl">
        <div className="flex items-center justify-center">
          <Menu.Button>
            <div className="border-lavander relative aspect-square w-14 overflow-hidden rounded-full border-4 sm:w-16">
              {session?.user.avatarUrl ? (
                <Image
                  src={session?.user.avatarUrl}
                  alt="avatar"
                  fill
                  placeholder="blur"
                  blurDataURL={emptyDogPlaceholder}
                />
              ) : (
                <EmptyDogComponent fill="#667dd1" />
              )}
            </div>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="border-lavander absolute right-0 top-[calc(100%+4px)] z-20 min-w-[8rem] origin-top-right rounded-md border-4 bg-white text-black shadow-lg">
            {USER_ACTIONS.map((item) => (
              <Menu.Item key={item.name}>
                <Link
                  href={item.url}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    }
                  }}
                  className="flex w-full flex-nowrap items-center gap-2 p-2 px-3 transition-colors first:rounded-t-md last:rounded-b-md hover:bg-indigo-500 hover:text-white"
                >
                  {item.name}
                </Link>
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};
