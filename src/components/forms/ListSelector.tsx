import React, {useState} from 'react';
import {CardContent} from '@/components/ui/card';
import {SeparatorWithLabel} from '@/components/ui/separator';
import {Button} from '@/components/ui/button';
import {CirclePlus, Trash} from 'lucide-react';
import Code from '@/components/ui/code';

type SnowbankListProps = {
  value?: string[];
  onChange?: (value: string[]) => void;
  renderItem: (index: number, onChange: (value: string | null) => void) => React.ReactNode;
  getItemTitle: (index: number) => string;
  itemType: string;
  maxItems?: number;
}

export default function ListSelector({ value = [], onChange, renderItem, getItemTitle, itemType, maxItems = 5 }: SnowbankListProps) {
  const [items, setItems] = useState<(string | null)[]>(
    value.length > 0 ? value : [null]
  );

  const updateSnowBank = (index: number, newValue: string | null) => {
    setItems(prev => {
      const copy = [...prev];
      copy[index] = newValue;

      if (onChange) {
        const filtered = copy.filter(s => s !== null && s !== "") as string[];
        onChange(filtered);
      }

      return copy;
    });
  };

  const addSnowBank = () => {
    if (items.length >= maxItems) return;
    setItems(prev => [...prev, null]);
  };

  const deleteLastSnowBank = () => {
    setItems(prev => {
      const newBanks = prev.slice(0, -1);

      if (onChange) {
        const filtered = newBanks.filter(s => s !== null) as string[];
        onChange(filtered);
      }

      return newBanks;
    });
  };

  return (
    <CardContent className="flex flex-col gap-2">
      {items.map((_, index) => (
        <div key={index}>
          <SeparatorWithLabel className="mt-0" title={getItemTitle(index)} />
          {renderItem(index, (value) => updateSnowBank(index, value))}
        </div>
      ))}
      {items.length > 1 && (
        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={deleteLastSnowBank}
        >
          <Trash />
          Delete current {itemType}
        </Button>
      )}
      <Button
        variant="outline"
        className="w-full flex items-center gap-2"
        onClick={addSnowBank}
        disabled={
        items.length >= maxItems ||
          items[items.length - 1] === null
      }
      >
        <CirclePlus />
        Add {itemType} ({items.length}/{maxItems})
      </Button>
      {items.length > 0 && items[0] !== null && (
        <Code
          text={items
            .map(s => (s != null ? s + "\n" : ""))
            .join("")}
        />
      )}
    </CardContent>
  );
}