'use client';
import tailwindConfig from 'tailwindcss/defaultConfig';
import resolveConfig from 'tailwindcss/resolveConfig';

const fullConfig = resolveConfig(tailwindConfig) as any;

export const getBreakpointValue = (value: string): number =>
  +fullConfig.theme.screens[value].slice(0, fullConfig.theme.screens[value].indexOf('px'));

export const useBreakpoint = () => {
  let currentBreakpoint = 'xs';
  let biggestBreakpointValue = 0;
  for (const breakpoint of Object.keys(fullConfig?.theme?.screens)) {
    const breakpointValue = getBreakpointValue(breakpoint);
    if (typeof window !== 'undefined') {
      if (breakpointValue > biggestBreakpointValue && window.innerWidth >= breakpointValue) {
        biggestBreakpointValue = breakpointValue;
        currentBreakpoint = breakpoint;
      }
    }
  }
  return currentBreakpoint;
};
