import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import { GoogleAuthButton } from '../authenticator/GoogleAuthButton';

interface Props {
  open: boolean;
  text?: string;
  onClose: () => void;
}

export const SignInDialog = ({ open, onClose, text }: Props) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-xl font-medium leading-6 text-gray-900">
                  {text ? text : 'Sign in to continue'}
                </Dialog.Title>

                <div className="mt-4">
                  <GoogleAuthButton text={'Sign in with Google'} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
