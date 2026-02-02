import SwitchField from '@/components/ui/SwitchField';
import {useEffect, useMemo, useRef, useState} from 'react';
import {ConditionCode} from '@/lib/types';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import ListSelector from '@/components/forms/ListSelector';
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import {CONDITION_CODES} from '@/lib/data';
import FadeIn from '@/components/ui/FadeIn';
import {clsx} from 'clsx';
import TaxiwayField from '@/components/ui/TaxiwayField';
import {Input} from '@/components/ui/input';
import Code from '@/components/ui/code';

export function TaxiwayConditionsSelector({value = [], onChange}: {value: string[], onChange?: (value: string[]) => void}) {
  const [allTaxiways, setAllTaxiways] = useState<boolean>(false);
  const [allTaxiwaysCondition, setAllTaxiwaysCondition] = useState<ConditionCode | null>(null);

  return (
    <Card className={clsx("mt-2", allTaxiways && "!pb-0")}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <SwitchField checked={allTaxiways} onClick={() => setAllTaxiways(!allTaxiways)} label="ALL TWYS" />
          <CCSelector
            value={allTaxiwaysCondition?.toString() ?? ""}
            disabled={!allTaxiways}
            onValueChange={(value) => setAllTaxiwaysCondition(value?.toString() as unknown as ConditionCode)}
          />
        </div>
        <FadeIn shown={allTaxiways && !!allTaxiwaysCondition}>
          <Code text={"ALL TWYS " + allTaxiwaysCondition + "."} />
        </FadeIn>
      </CardHeader>
      <FadeIn shown={!allTaxiways}>
        <ListSelector
          maxItems={10}
          value={value}
          onChange={onChange}
          itemType="Taxiway"
          getItemTitle={(index) => `Taxiway ${index + 1}`}
          renderItem={(_, onItemChange) => (
            <ConditionSelector item="TWY" onChange={onItemChange} />
          )}
        />
      </FadeIn>
    </Card>
  )
}

export function ApronConditionsSelector({value = [], onChange}: {value: string[], onChange?: (value: string[]) => void}) {
  const [allAprons, setAllAprons] = useState<boolean>(false)
  const [allApronsCondition, setAllApronsCondition] = useState<ConditionCode | null>(null)

  return (
    <Card className={clsx("mt-2", allAprons && "!pb-0")}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <SwitchField checked={allAprons} onClick={() => setAllAprons(!allAprons)} label="ALL APRONS" />

          <CCSelector
            value={allApronsCondition?.toString() ?? ""}
            disabled={!allAprons}
            onValueChange={(value) => setAllApronsCondition(value?.toString() as unknown as ConditionCode)}
          />
        </div>
        <FadeIn shown={allAprons && !!allApronsCondition}>
          <Code text={"ALL APRONS " + allApronsCondition + "."} />
        </FadeIn>
      </CardHeader>
      <CardContent>
        <FadeIn shown={!allAprons}>
          <ListSelector
            value={value}
            onChange={onChange}
            itemType="Apron"
            getItemTitle={(index) => `Apron ${index + 1}`}
            renderItem={(_, onItemChange) => (
              <ConditionSelector item="APRON" onChange={onItemChange} />
            )}
          />
        </FadeIn>
      </CardContent>
    </Card>
  )
}

type ConditionSelectorProps = {
  item: "TWY" | "APRON",
  onChange: (value: string | null) => void;
}

function ConditionSelector({item, onChange}: ConditionSelectorProps) {
  const [location, setLocation] = useState<string>("");
  const [condition, setCondition] = useState<ConditionCode | null>(null);

  const prevTextRef = useRef<string | undefined>(undefined);

  const text = useMemo(() => {
    if(!location || location.trim() === "" || !condition) return undefined;

    if(item === "TWY") return item + " " + location + " " + condition + ".";
    if(item === "APRON") return item + " " + location + " " + condition + ".";
    return undefined;
  }, [location, condition, item]);

  useEffect(() => {
    if(!onChange) return;
    if(prevTextRef.current === text) return;
    prevTextRef.current = text;
    onChange(text || null);
  }, [onChange, text]);

  return (
    <div className="flex items-center mb-2 gap-2">
      <span>{item}</span>
      {item === "TWY" ? (
        <TaxiwayField value={location} onChange={setLocation} />
      ) : (
        <Input className="max-w-1/4" value={location} onChange={(e) => setLocation(e.currentTarget.value)} />
      )}

      <CCSelector
        value={condition?.toString() ?? ""}
        onValueChange={(value) => setCondition(value?.toString() as unknown as ConditionCode)}
      />
    </div>
  )
}

function CCSelector({value, onValueChange, disabled = false}: {value: string, onValueChange?: (value: string | null) => void, disabled?: boolean}) {
  return (
    <Combobox value={value} onValueChange={onValueChange}>
      <ComboboxInput disabled={disabled} placeholder="CONDITION"></ComboboxInput>

      <ComboboxContent>
        <ComboboxList>
          {Object.entries(CONDITION_CODES).map(([key, label]) => (
            <ComboboxItem key={key} value={label}>
              {label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}