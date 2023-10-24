import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/solid';
import Link from 'next/link';

interface Route {
  name: string;
  route: string;
}

interface RoutesMenuProps {
  routes: Route[];
}
export const RoutesMenu = ({ routes }: RoutesMenuProps) => {
  return (
    <>
      <Menu as="div" className="relative inline-block text-left text-lg font-medium text-white 2xl:text-xl">
        <div className="flex items-center justify-center">
          <Menu.Button>
            <Bars3Icon className="h-12 text-black" />
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
            {routes.map((item) => (
              <Menu.Item key={item.name}>
                <Link
                  href={item.route}
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
