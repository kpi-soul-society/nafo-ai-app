import { Switch } from '@headlessui/react';

interface CommonSwitchProps {
  checked: boolean;
  onChange: () => void;
  checkedBGColor?: string;
  uncheckedBGColor?: string;
  thumbColor?: string;
  label?: string;
  labelStyle?: string;
  leftLabel?: boolean;
  className?: string;
}
export const CommonSwitch = ({
  checked = false,
  onChange,
  label = '',
  checkedBGColor = 'bg-secondary',
  uncheckedBGColor = 'bg-lavander',
  thumbColor = 'bg-white',
  labelStyle = '',
  className = 'flex gap-2',
}: CommonSwitchProps) => {
  return (
    <div className={className}>
      <Switch
        checked={checked}
        onChange={onChange}
        className={`${
          checked ? checkedBGColor : uncheckedBGColor
        } relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <span
          className={`${
            checked ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full ${thumbColor} transition`}
        />
      </Switch>
      <span className={labelStyle}>{label}</span>
    </div>
  );
};
