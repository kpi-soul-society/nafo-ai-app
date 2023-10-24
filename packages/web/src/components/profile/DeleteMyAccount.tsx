'use client';
import React, { useState } from 'react';
import { signOut } from 'next-auth/react';

import { useTypedMutation } from '@/lib/client/graphqlClient';

import { ModalDialog } from '../common/ModalDialog';

export const DeleteMyAccount = () => {
  const [deleteMyUserResponse, deleteMyUser] = useTypedMutation(() => ({
    deleteMyUser: true,
  }));

  const [isDeleteMyUserDialogOpen, setDeleteMyUserDialogOpen] = useState(false);
  const [deleteInputValue, setDeleteInputValue] = useState('');

  function closeDeleteUser() {
    setDeleteMyUserDialogOpen(false);
    setDeleteInputValue('');
  }

  const isDeleteButtonEnabled = deleteInputValue === 'DELETE';

  return (
    <div id="danger-zone">
      <h1 className="mb-5 text-4xl font-bold">Delete my account</h1>
      <button onClick={() => setDeleteMyUserDialogOpen(true)} className="rounded-lg bg-red-600 p-4 text-lg text-white">
        Delete my account permanently
      </button>
      <ModalDialog isOpen={isDeleteMyUserDialogOpen} onClose={closeDeleteUser}>
        <div className="flex flex-col gap-y-5">
          <h1 className="text-4xl font-bold">Delete my account</h1>
          <span className="text-xl">Are you sure you want to delete your account? This action is irreversible.</span>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="delete-input" className="text-lg">
              Type &quot;DELETE&quot; below to confirm:
            </label>
            <input
              id="delete-input"
              type="text"
              value={deleteInputValue}
              placeholder="DELETE"
              onChange={(event) => setDeleteInputValue(event.target.value)}
              className="rounded-lg border border-gray-400 p-2 text-lg"
            />
          </div>
          <button
            onClick={async () => {
              await deleteMyUser({});
              await signOut({ redirect: true, callbackUrl: '/' });
            }}
            className={`rounded-lg p-4 text-lg text-white ${
              isDeleteButtonEnabled ? 'bg-red-600' : 'cursor-not-allowed bg-gray-400'
            }`}
            disabled={!isDeleteButtonEnabled}
          >
            Delete my account permanently
          </button>
        </div>
      </ModalDialog>
    </div>
  );
};
