"use client";

import React from "react";

interface SelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  disabled?: boolean;
  placeholder?: string;
}

export default function Select({ label, value, onChange, options, disabled, placeholder }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-medium">{label}</label>
      <select
        className="border rounded p-2 disabled:bg-gray-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="" disabled>{placeholder || "- Select -"}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}
