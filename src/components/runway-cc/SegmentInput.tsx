"use client";

import React from "react";
import Select from "./Select";

interface SegmentProps {
  label: string;
  code: string;
  contaminant: string;
  percent: string;
  onCodeChange: (v: string) => void;
  onContChange: (v: string) => void;
  onPercChange: (v: string) => void;
  contaminants: { [key: string]: string[] };
  sortedCodes: string[];
}

export default function SegmentInput({
  label, code, contaminant, percent,
  onCodeChange, onContChange, onPercChange,
  contaminants, sortedCodes
}: SegmentProps) {

  const showContaminant = code && code !== "6";
  const showPercent = showContaminant && contaminant;

  const percentages = ["25%", "50%", "75%", "100%"];

  return (
    <div className="border rounded p-3 bg-gray-50 flex flex-col gap-2">
      <h3 className="font-semibold">{label}</h3>

      <Select
        label="Condition Code"
        value={code}
        onChange={onCodeChange}
        options={sortedCodes}
        placeholder="- Select Condition Code -"
      />

      {showContaminant && (
        <Select
          label="Contaminant"
          value={contaminant}
          onChange={onContChange}
          options={contaminants[code] || []}
          placeholder="- Select Contaminant -"
        />
      )}

      {showPercent && (
        <Select
          label="Coverage Percentage"
          value={percent}
          onChange={onPercChange}
          options={percentages}
          placeholder="- Select Coverage -"
        />
      )}

      {code === "6" && (
        <input type="text" disabled value="Dry" className="border rounded p-2 bg-gray-200 mt-1" />
      )}
    </div>
  );
}
