'use client';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateSupportRequestSchema, createSupportRequestSchema } from '@nafo-ai/core/common/validation';
import { useSession } from 'next-auth/react';

import { useTypedMutation } from '@/lib/client/graphqlClient';

import { Cheebs } from '../images/Cheebs';

import { AsyncButton } from './AsyncButton';
import { ModalDialog } from './ModalDialog';

export const ContactSupportButton = ({ bg = 'bg-yield' }) => {
  const { data: session } = useSession();
  const [isSupportDialogOpen, setSupportDialogOpen] = useState(false);

  const [wasSupportRequestSubmitted, setSupportRequestSubmitted] = useState(false);

  const [_, createSupportRequest] = useTypedMutation((payload: CreateSupportRequestSchema) => ({
    createSupportRequest: [payload],
  }));

  const formMethods = useForm<CreateSupportRequestSchema>({
    defaultValues: {
      customerEmail: session?.user.email,
      subject: '',
      details: '',
    },
    resolver: async (data, context, options) => {
      return zodResolver(createSupportRequestSchema)(data, context, options);
    },
  });

  const closeSupport = () => {
    setSupportDialogOpen(false);
    formMethods.reset();
    setSupportRequestSubmitted(false);
  };

  const onSubmit = async (data: CreateSupportRequestSchema) => {
    await createSupportRequest(data);
    setSupportRequestSubmitted(true);
  };

  return (
    <>
      <div className="font-russo fixed bottom-16 right-4 z-50 sm:bottom-4">
        <button onClick={() => setSupportDialogOpen(true)} className={`${bg} rounded-full p-4 text-white shadow-lg`}>
          Support
        </button>
      </div>
      <ModalDialog isOpen={isSupportDialogOpen} onClose={closeSupport}>
        {wasSupportRequestSubmitted ? (
          <div className="flex h-fit flex-col items-center justify-center px-10 text-lg font-bold sm:text-3xl">
            <span>We received your message!</span>
            <div className="h-14 sm:h-20">
              <Cheebs text="Thank you!" withText />
            </div>
          </div>
        ) : (
          <div className="flex h-fit w-full flex-col">
            <div className="flex w-full flex-col gap-y-2">
              <h1 className="text-4xl font-bold">Contact Support</h1>
              <span>
                Hit us up at&nbsp;
                <a className="text-blue-600 underline hover:text-blue-800" href="mailto:contact@nafoai.com">
                  contact@nafoai.com
                </a>
                &nbsp;or use the form below.
              </span>
              <span>We will do our best to get back to you within 24 hours.</span>
            </div>
            <FormProvider {...formMethods}>
              <form onSubmit={formMethods.handleSubmit(onSubmit)} className="flex flex-col gap-8 pt-10">
                <div className="flex flex-col gap-y-2">
                  <input
                    type="text"
                    placeholder="Your Email"
                    className="font-russo w-full rounded-lg border border-gray-300 p-4 text-2xl shadow-sm focus:outline-indigo-500 2xl:p-5"
                    {...formMethods.register('customerEmail', { required: 'Please enter your email' })}
                  />
                  {formMethods.formState.errors.customerEmail && (
                    <span className="text-sm text-red-500">{formMethods.formState.errors.customerEmail.message}</span>
                  )}
                </div>
                <div className="flex flex-col gap-y-2">
                  <input
                    type="text"
                    placeholder="Subject"
                    className="font-russo w-full rounded-lg border border-gray-300 p-4 text-2xl shadow-sm focus:outline-indigo-500 2xl:p-5"
                    {...formMethods.register('subject', { required: 'Please enter the subject' })}
                  />
                  {formMethods.formState.errors.subject && (
                    <span className="text-sm text-red-500">{formMethods.formState.errors.subject.message}</span>
                  )}
                </div>
                <div className="flex flex-col gap-y-2">
                  <textarea
                    id="details"
                    placeholder="Details"
                    className="font-russo w-full rounded-lg border border-gray-300 p-4 text-2xl shadow-sm focus:outline-indigo-500 2xl:p-5"
                    {...formMethods.register('details', { required: 'Please add details' })}
                  />
                  {formMethods.formState.errors.details && (
                    <span className="text-sm text-red-500">{formMethods.formState.errors.details.message}</span>
                  )}
                </div>
                <AsyncButton
                  type="submit"
                  onClick={formMethods.handleSubmit(onSubmit)}
                  value="Submit"
                  className="bg-yield disabled:bg-lavander min-w-[15rem] rounded-md px-7 py-2 text-3xl font-semibold text-white shadow-sm transition-colors duration-700 hover:cursor-pointer hover:bg-indigo-500 md:text-2xl lg:text-4xl 2xl:py-3 2xl:text-5xl"
                >
                  Submit
                </AsyncButton>
              </form>
            </FormProvider>
          </div>
        )}
      </ModalDialog>
    </>
  );
};
