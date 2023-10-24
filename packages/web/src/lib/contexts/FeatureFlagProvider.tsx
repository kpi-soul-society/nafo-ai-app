'use client';
import { createContext, useContext } from 'react';
import { type IToggle, TOGGLES_STATUS } from '@toggled.dev/toggled-client-js';

const intialValues = {
  featureFlags: [] as IToggle[],
  isFeatureEnabled: (_: string) => false,
};
export const FeatureFlagContext = createContext(intialValues);

export const FeatureFlagProvider = ({
  children,
  featureFlags,
}: React.PropsWithChildren<{ featureFlags: IToggle[] }>) => {
  const isFeatureEnabled = (featureFlag: string) => {
    const toggle = featureFlags.find((t) => t.toggleName === featureFlag);
    const enabled = toggle ? toggle.toggleStatus === TOGGLES_STATUS.ON : false;

    return enabled;
  };

  return (
    <FeatureFlagContext.Provider
      value={{
        featureFlags,
        isFeatureEnabled,
      }}
    >
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlagContext = () => {
  const context = useContext(FeatureFlagContext);
  return context;
};
