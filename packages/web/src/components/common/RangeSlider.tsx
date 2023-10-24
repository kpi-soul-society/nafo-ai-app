import React, { useState } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

import { ConnectForm } from './ConnectForm';

type Props = {
  /**
   * name of the field the slider is for
   */
  name: string;
  min?: number;
  max?: number;
  rangeValue: number;
  setRangeValue: (_: number) => void;
};

export const RangeSlider = ({ min = 0, max, name, rangeValue, setRangeValue }: Props) => {
  const handleChange = (event: any) => {
    setRangeValue(event.target.value);
  };

  return (
    <ConnectForm>
      {(formMethods: UseFormReturn<FieldValues>) => (
        <div>
          {rangeValue}
          <input
            id={name}
            type="range"
            className="transparent h-1.5 w-full cursor-pointer appearance-none rounded-lg border-transparent bg-neutral-200"
            {...formMethods.register(name, {
              onChange: handleChange,
              valueAsNumber: true,
            })}
            defaultValue={min || 0}
            min={min || 0}
            max={max || undefined}
          />
        </div>
      )}
    </ConnectForm>
  );
};
