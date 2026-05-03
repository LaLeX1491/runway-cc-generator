import SwitchField from '@/components/ui/SwitchField';
import { useMemo, useState } from 'react';
import { ConditionCode, TaxiwayCondition, ApronCondition } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ListSelector from '@/components/forms/ListSelector';
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { CONDITION_CODES } from '@/lib/data';
import FadeIn from '@/components/ui/FadeIn';
import { clsx } from 'clsx';
import TaxiwayField from '@/components/ui/TaxiwayField';
import { Input } from '@/components/ui/input';
import Code from '@/components/ui/code';

// ---------------------------------------------------------------------------
// Taxiway Conditions
// ---------------------------------------------------------------------------

type TaxiwayConditionsSelectorProps = {
  value: TaxiwayCondition[];
  onChange?: (value: TaxiwayCondition[]) => void;
  allTaxiwaysValue?: ConditionCode;
  onAllTaxiwaysChange?: (value: ConditionCode | undefined) => void;
}

export function TaxiwayConditionsSelector({
                                            value = [],
                                            onChange,
                                            allTaxiwaysValue,
                                            onAllTaxiwaysChange,
                                          }: TaxiwayConditionsSelectorProps) {
  const [allTaxiways, setAllTaxiways] = useState<boolean>(!!allTaxiwaysValue);

  const handleAllTaxiwaysToggle = () => {
    const next = !allTaxiways;
    setAllTaxiways(next);
    if (!next) onAllTaxiwaysChange?.(undefined);
  };

  return (
    <Card className={clsx("mt-2", allTaxiways && "!pb-0")}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <SwitchField checked={allTaxiways} onClick={handleAllTaxiwaysToggle} label="ALL TWYS" />
          <CCSelector
            value={allTaxiwaysValue?.toString() ?? ""}
            disabled={!allTaxiways}
            onValueChange={(v) => onAllTaxiwaysChange?.(v ? (Number(v) as ConditionCode) : undefined)}
          />
        </div>
        <FadeIn shown={allTaxiways && allTaxiwaysValue !== undefined}>
          <Code text={"ALL TWYS " + allTaxiwaysValue + "."} />
        </FadeIn>
      </CardHeader>
      <FadeIn shown={!allTaxiways}>
        <ListSelector<TaxiwayCondition | null>
          maxItems={10}
          value={value as (TaxiwayCondition | null)[]}
          onChange={(items) => onChange?.(items.filter((i): i is TaxiwayCondition => i !== null))}
          itemType="Taxiway"
          getItemTitle={(index) => `Taxiway ${index + 1}`}
          renderItem={(index, onItemChange) => (
            <TaxiwayConditionSelector
              value={value[index] ?? undefined}
              onChange={onItemChange}
            />
          )}
        />
      </FadeIn>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Apron Conditions
// ---------------------------------------------------------------------------

type ApronConditionsSelectorProps = {
  value: ApronCondition[];
  onChange?: (value: ApronCondition[]) => void;
  allApronsValue?: ConditionCode;
  onAllApronsChange?: (value: ConditionCode | undefined) => void;
}

export function ApronConditionsSelector({
                                          value = [],
                                          onChange,
                                          allApronsValue,
                                          onAllApronsChange,
                                        }: ApronConditionsSelectorProps) {
  const [allAprons, setAllAprons] = useState<boolean>(!!allApronsValue);

  const handleAllApronsToggle = () => {
    const next = !allAprons;
    setAllAprons(next);
    if (!next) onAllApronsChange?.(undefined);
  };

  return (
    <Card className={clsx("mt-2", allAprons && "!pb-0")}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <SwitchField checked={allAprons} onClick={handleAllApronsToggle} label="ALL APRONS" />
          <CCSelector
            value={allApronsValue?.toString() ?? ""}
            disabled={!allAprons}
            onValueChange={(v) => onAllApronsChange?.(v ? (Number(v) as ConditionCode) : undefined)}
          />
        </div>
        <FadeIn shown={allAprons && allApronsValue !== undefined}>
          <Code text={"ALL APRONS " + allApronsValue + "."} />
        </FadeIn>
      </CardHeader>
      <CardContent>
        <FadeIn shown={!allAprons}>
          <ListSelector<ApronCondition | null>
            value={value as (ApronCondition | null)[]}
            onChange={(items) => onChange?.(items.filter((i): i is ApronCondition => i !== null))}
            itemType="Apron"
            getItemTitle={(index) => `Apron ${index + 1}`}
            renderItem={(index, onItemChange) => (
              <ApronConditionSelector
                value={value[index] ?? undefined}
                onChange={onItemChange}
              />
            )}
          />
        </FadeIn>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Single TaxiwayCondition – fully controlled
// ---------------------------------------------------------------------------

type TaxiwayConditionSelectorProps = {
  value?: TaxiwayCondition;
  onChange: (value: TaxiwayCondition | null) => void;
}

function TaxiwayConditionSelector({ value, onChange }: TaxiwayConditionSelectorProps) {
  const taxiway = value?.taxiway ?? "";
  const condition = value?.condition;

  const text = useMemo(() => {
    if (!taxiway.trim() || condition === undefined) return undefined;
    return `TWY ${taxiway} ${condition}.`;
  }, [taxiway, condition]);

  const handleChange = (patch: Partial<TaxiwayCondition>) => {
    const next = { taxiway, condition: condition ?? 6, ...patch };
    const valid = next.taxiway.trim() !== "" && next.condition !== undefined;
    onChange(valid ? next as TaxiwayCondition : null);
  };

  return (
    <div className="flex flex-col gap-1 mb-2">
      <div className="flex items-center gap-2">
        <span>TWY</span>
        <TaxiwayField
          value={taxiway}
          onChange={(v) => handleChange({ taxiway: v })}
        />
        <CCSelector
          value={condition?.toString() ?? ""}
          onValueChange={(v) => v && handleChange({ condition: Number(v) as ConditionCode })}
        />
      </div>
      {text && <Code text={text} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single ApronCondition – fully controlled
// ---------------------------------------------------------------------------

type ApronConditionSelectorProps = {
  value?: ApronCondition;
  onChange: (value: ApronCondition | null) => void;
}

function ApronConditionSelector({ value, onChange }: ApronConditionSelectorProps) {
  const apron = value?.apron ?? "";
  const condition = value?.condition;

  const text = useMemo(() => {
    if (!apron.trim() || condition === undefined) return undefined;
    return `APRON ${apron} ${condition}.`;
  }, [apron, condition]);

  const handleChange = (patch: Partial<ApronCondition>) => {
    const next = { apron, condition: condition ?? 6, ...patch };
    const valid = next.apron.trim() !== "" && next.condition !== undefined;
    onChange(valid ? next as ApronCondition : null);
  };

  return (
    <div className="flex flex-col gap-1 mb-2">
      <div className="flex items-center gap-2">
        <span>APRON</span>
        <Input
          className="max-w-1/4"
          value={apron}
          onChange={(e) => handleChange({ apron: e.currentTarget.value })}
        />
        <CCSelector
          value={condition?.toString() ?? ""}
          onValueChange={(v) => v && handleChange({ condition: Number(v) as ConditionCode })}
        />
      </div>
      {text && <Code text={text} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared CCSelector
// ---------------------------------------------------------------------------

function CCSelector({
                      value,
                      onValueChange,
                      disabled = false,
                    }: {
  value: string;
  onValueChange?: (value: string | null) => void;
  disabled?: boolean;
}) {
  return (
    <Combobox value={value} onValueChange={onValueChange}>
      <ComboboxInput disabled={disabled} placeholder="CONDITION" />
      <ComboboxContent>
        <ComboboxList>
          {Object.entries(CONDITION_CODES).map(([key, label]) => (
            <ComboboxItem key={key} value={key}>
              {key} – {label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}