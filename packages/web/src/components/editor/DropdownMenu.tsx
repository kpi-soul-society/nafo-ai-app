import { useEffect, useState } from 'react';
import { Style } from '@nafo-ai/graphql/genql';
import Image from 'next/image';

import { WithId } from '@/lib/hooks/useChipControls';
import { MenuItem } from '@/lib/hooks/useMenuListControls';

import { Dropdown } from '../common/Dropdown';

interface DropdownMenuProps<T extends DropdownMenuItem> {
  id: string;
  label: string;
  open: (id: string) => void;
  addItem: (item: MenuItem) => void;
  presetList?: Array<T>;
  children?: React.ReactNode;
  selectedItems?: Pick<Style, 'id'>[];
  handleItemClick?: (_: T) => void;
  handleClear?: () => void;
}
interface DropdownMenuItem {
  id: string;
  name: string;
  imageUrl: string;
  prompt: string;
}

export const DropdownMenu = <T extends DropdownMenuItem>({
  id,
  label,
  presetList,
  open,
  addItem,
  children,
  selectedItems,
  handleItemClick,
  handleClear,
}: DropdownMenuProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (addItem) {
      addItem({ id: id, setIsOpen });
    }
  }, []);
  return (
    <Dropdown
      label={label}
      isOpen={isOpen}
      onClick={() => {
        open(id);
      }}
      onClear={handleClear}
      selectedItems={selectedItems?.length ?? 0}
    >
      <div className="grid grid-cols-3 justify-items-center gap-2">
        {presetList &&
          presetList.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                handleItemClick && handleItemClick(item);
              }}
              className="hover:text-secondary relative flex flex-col items-center rounded-lg hover:cursor-pointer"
            >
              <div
                className={`relative top-0 aspect-square w-full min-w-[5rem] overflow-hidden rounded-md ${
                  selectedItems && selectedItems.some((selectedItem: WithId) => selectedItem.id === item.id)
                    ? 'border-secondary border-4'
                    : 'hover:scale-110'
                }`}
                key={item.imageUrl}
              >
                <Image
                  src={item.imageUrl}
                  alt="NAFO dog"
                  priority
                  fill
                  placeholder="blur"
                  blurDataURL="/assets/empty_dog.png"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <span className="absolute bottom-0 text-white ">{item.name}</span>
            </div>
          ))}
      </div>
      {children}
    </Dropdown>
  );
};
