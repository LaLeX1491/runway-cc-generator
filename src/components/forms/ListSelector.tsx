import React, { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { SeparatorWithLabel } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CirclePlus, Trash } from 'lucide-react';

type ListSelectorProps<T> = {
  value: T[];
  onChange?: (value: T[]) => void;
  renderItem: (index: number, onChange: (value: T | null) => void) => React.ReactNode;
  getItemTitle: (index: number) => string;
  itemType: string;
  maxItems?: number;
}

export default function ListSelector<T>({value, onChange, renderItem, getItemTitle, itemType, maxItems = 5}: ListSelectorProps<T>) {
  const [slotCount, setSlotCount] = useState(Math.max(1, value.length));

  const updateItem = (index: number, newValue: T | null) => {
    if (!onChange) return;
    const merged = Array.from({ length: slotCount }, (_, i) =>
      i === index ? newValue : (value[i] ?? null)
    );
    onChange(merged.filter((s): s is T => s !== null));
  };

  const addItem = () => {
    if (slotCount >= maxItems) return;
    setSlotCount(prev => prev + 1);
  };

  const deleteLastItem = () => {
    if (slotCount <= 1) return;
    setSlotCount(prev => {
      const next = prev - 1;
      if (onChange) {
        onChange(value.slice(0, next));
      }
      return next;
    });
  };

  const lastSlotEmpty = value.length < slotCount;

  return (
    <CardContent className="flex flex-col gap-2">
      {Array.from({ length: slotCount }, (_, index) => (
        <div key={index}>
          <SeparatorWithLabel className="mt-0" title={getItemTitle(index)} />
          {renderItem(index, (val) => updateItem(index, val))}
        </div>
      ))}
      {slotCount > 1 && (
        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={deleteLastItem}
        >
          <Trash />
          Delete last {itemType}
        </Button>
      )}
      <Button
        variant="outline"
        className="w-full flex items-center gap-2"
        onClick={addItem}
        disabled={slotCount >= maxItems || lastSlotEmpty}
      >
        <CirclePlus />
        Add {itemType} ({slotCount}/{maxItems})
      </Button>
    </CardContent>
  );
}