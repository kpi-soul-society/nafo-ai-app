import React from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

import { ConnectForm } from '../common/ConnectForm';

export const TextPromptSubmitter = ({ id = '', placeholder = '' }) => {
  return (
    <ConnectForm>
      {(formMethods: UseFormReturn<FieldValues>) => (
        <textarea
          id="basic-prompt"
          rows={3}
          className="mt-2 w-full rounded-lg border border-gray-300 p-4 shadow-sm focus:outline-indigo-500"
          placeholder={placeholder}
          {...formMethods.register(id)}
        />
      )}
    </ConnectForm>
  );
};
