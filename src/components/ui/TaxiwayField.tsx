import {Input} from '@/components/ui/input';
import React from 'react';

export default function TaxiwayField({ disabled = false, value, onChange }: { disabled?: boolean, value: string, onChange: (value: string) => void }) {
  return (
    <Input
      className="w-13"
      placeholder="A"
      type="text"
      maxLength={3}
      pattern="^[A-Z](?:[A-Z0-9](?:[0-9])?)?$"
      value={value}
      disabled={disabled}
      onInput={(e) => {
        const el = e.currentTarget;
        let v = el.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
        v = v.slice(0, 3);

        if (v.length >= 1 && !/^[A-Z]/.test(v)) {
          v = "";
        }
        if (v.length === 3 && !/^[A-Z][A-Z0-9][0-9]$/.test(v)) {
          v = v.slice(0, 2);
        }

        el.value = v;
      }}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}