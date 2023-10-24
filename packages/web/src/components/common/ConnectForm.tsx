import { useFormContext } from 'react-hook-form';

export const ConnectForm = ({ children }: { children: any }) => {
  const methods = useFormContext();

  return children({ ...methods });
};
