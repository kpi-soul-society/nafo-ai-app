import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export type WithId = {
  id: string;
  [key: string]: any;
};
type ChipControlsInput = {
  chipsFieldName: 'iterationCount' | 'variationCount' | 'selectedStyles';
};

export const useChipControls = <T extends WithId>({ chipsFieldName }: ChipControlsInput) => {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const formMethods = useFormContext();

  useEffect(() => {
    formMethods?.register(chipsFieldName);
  }, [formMethods?.register]);

  const handleItemClick = (chip: T) => {
    if (selectedItems.some((selectedItem: T) => selectedItem.id === chip.id)) {
      setSelectedItems((prevSelectedItems: any) => {
        // if chip is already selected, remove it from the selection
        const selectedItems = prevSelectedItems.filter((selectedItem: any) => selectedItem.id !== chip.id);
        if (chipsFieldName) {
          formMethods?.setValue(chipsFieldName, selectedItems);
        }
        return selectedItems;
      });
    } else {
      // Chip is not selected, add it to the selection
      setSelectedItems((prevSelectedItems) => {
        const selectedItems = chipsFieldName === 'selectedStyles' ? [chip] : [...prevSelectedItems, chip];
        if (chipsFieldName) {
          formMethods?.setValue(chipsFieldName, selectedItems);
        }
        return selectedItems;
      });
    }
  };

  const setSelection = (styles: T[]) => {
    setSelectedItems(styles);
    formMethods?.setValue(chipsFieldName!, styles);
  };

  const handleClear = () => {
    setSelectedItems(() => {
      formMethods?.setValue(chipsFieldName!, []);
      return [];
    });
  };

  return { handleItemClick, selectedItems, handleClear, setSelection };
};
