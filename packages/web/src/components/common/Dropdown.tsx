import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface DropdownProps {
  label: string;
  isOpen: boolean;
  children?: React.ReactNode;
  customIcon?: React.ReactNode;
  selectedItems?: number;
  onClick?: () => void;
  onClear?: () => void;
}

export const Dropdown = ({
  label,
  isOpen = false,
  children,
  selectedItems = 0,
  customIcon,
  onClick,
  onClear,
}: DropdownProps) => {
  return (
    <div className="flex w-full flex-col gap-y-3 border-b-2 py-3">
      <div
        className="flex w-full items-center justify-between"
        onClick={() => {
          onClick && onClick();
        }}
      >
        <span className="text-xl font-bold">{label}</span>
        <div className="flex items-center gap-3">
          {selectedItems > 0 && (
            <div className="bg-secondary parent-onhover flex h-6 w-10 items-center justify-center rounded-full px-2 text-white">
              <span className="child-hide-onhover text-md">+{selectedItems}</span>
              <XMarkIcon
                className="child-show-onhover w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onClear) {
                    onClear();
                  }
                }}
              />
            </div>
          )}
          {customIcon ? customIcon : <ChevronDownIcon className={`h-5 transition-all ${isOpen && 'rotate-180'}`} />}
        </div>
      </div>
      {isOpen && children}
    </div>
  );
};
