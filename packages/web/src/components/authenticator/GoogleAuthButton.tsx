import { GoogleIcon } from '@/components/images/GoogleIcon';
import { REST_ENDPOINT } from '@/lib/config/next';

export interface Props {
  text?: 'Sign in with Google' | 'Sign up with Google';
}

export const GoogleAuthButton = ({ text = 'Sign in with Google' }: Props): JSX.Element => {
  return (
    <a href={`${REST_ENDPOINT}/auth/google/authorize`} rel="noreferrer" className="flex justify-center gap-1 border">
      <GoogleIcon />
      <span className="text-xl">{text}</span>
    </a>
  );
};
