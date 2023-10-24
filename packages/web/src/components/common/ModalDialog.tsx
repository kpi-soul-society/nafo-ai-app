import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalDialogProps {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
export const ModalDialog = ({ isOpen, onClose, children, title }: ModalDialogProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-[98%] transform overflow-hidden rounded-lg bg-white p-4 text-left  align-middle shadow-xl transition-all sm:max-w-fit">
                {title ? (
                  <Dialog.Title as="h3" className="flex justify-between text-2xl font-medium leading-6 text-gray-900">
                    {title}
                    <div className="relative">
                      <XMarkIcon onClick={onClose} className="absolute left-[-1.5rem] h-8" />
                    </div>
                  </Dialog.Title>
                ) : (
                  <div className="relative">
                    <XMarkIcon onClick={onClose} className="absolute right-0 top-[-0.1rem] h-8" />
                  </div>
                )}
                <div className="text-lg">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
