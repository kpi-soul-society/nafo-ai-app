import React from 'react';

import { ContactSupportButton } from '@/components/common/ContactSupportButton';
import { Profile } from '@/components/profile/Profile';

const UserProfile = () => {
  return (
    <>
      <Profile />
      <ContactSupportButton />
    </>
  );
};
export default UserProfile;
