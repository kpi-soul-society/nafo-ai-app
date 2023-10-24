'use client';

import { useState } from 'react';

import { Loader } from '../images/Loader';

interface AsyncButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className: string;
  disabledClassName?: string;
  onClick: () => Promise<any> | void;
  withLoader?: boolean;
}

export const AsyncButton = ({
  children,
  type = 'button',
  className = '',
  disabledClassName = '',
  onClick,
  withLoader = true,
  disabled,
  ...props
}: AsyncButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = async () => {
    setIsLoading(true);
    await onClick();
    setIsLoading(false);
  };

  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      className={`${className} ${(isLoading || disabled) && disabledClassName} flex justify-center`}
      onClick={handleClick}
      {...props}
    >
      {withLoader && isLoading ? <Loader className="fill-secondary h-8 w-8 animate-spin text-gray-200" /> : children}
    </button>
  );
};
