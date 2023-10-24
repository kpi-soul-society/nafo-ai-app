import { useCallback, useState } from 'react';
export interface MenuItem {
  id: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useMenuListControls = () => {
  const [items, setItems] = useState<Array<MenuItem>>([]);
  const [openItem, setOpenItem] = useState('');
  //register dropdown item to list
  const addItem = useCallback((item: MenuItem) => setItems((prevState) => [...prevState, item]), []);
  //open new dropdown and close old one
  const open = (id: string) => {
    items.forEach((item) => {
      if (item.id === id && openItem !== id) {
        item.setIsOpen(true);
        setOpenItem(item.id);
      } else {
        if (openItem === id) {
          setOpenItem('');
        }
        item.setIsOpen(false);
      }
    });
  };
  return { addItem, open };
};
