import React, {useEffect, useMemo, useState, useRef} from 'react';
import {Separator} from '@/components/ui/separator';
import {SnowbankCrossPosition, TaxiwaySnowbankPosition, RunwaySnowbank, TaxiwaySnowbank} from '@/lib/types';
import InputHeadline from '@/components/ui/InputHeadline';
import {Switch} from '@/components/ui/switch';
import {Input} from '@/components/ui/input';
import Code from '@/components/ui/code';
import {parseSnowBankOnRunway, parseSnowBankOnTaxiway} from '@/lib/parser';
import SwitchField from '../ui/SwitchField';
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from '../ui/combobox';
import ListSelector from '@/components/forms/ListSelector';
import TaxiwayField from '@/components/ui/TaxiwayField';
import {Card} from '@/components/ui/card';

export function SnowbankOnTaxiwaySelector({ runways, value = [], onChange }: { runways: string[], value?: TaxiwaySnowbank[], onChange?: (value: TaxiwaySnowbank[]) => void }) {
  return (
    <Card>
      <ListSelector
        value={value}
        onChange={onChange}
        maxItems={10}
        itemType="snowbank"
        getItemTitle={(index) => `Snowbank ${index + 1}`}
        renderItem={(index, onItemChange) => (
          <TaxiwaySnowBankSelector
            runways={runways}
            value={value[index]}
            onChange={onItemChange}
          />
        )}
      />
    </Card>
  );
}

export function SnowBankOnRunwaySelector({runway, value = [], onChange}: {runway: string, value?: RunwaySnowbank[], onChange?: (value: RunwaySnowbank[]) => void}) {
  return (
    <Card>
      <ListSelector
        value={value}
        maxItems={5}
        onChange={onChange}
        itemType="snowbank"
        getItemTitle={(index) => `Snowbank ${index + 1}`}
        renderItem={(index, onItemChange) => (
          <RunwaySnowBankSelector
            runway={runway}
            value={value[index]}
            onChange={onItemChange}
          />
        )}
      />
    </Card>
  );
}

function RunwaySnowBankSelector({ runway, value, onChange }: { runway: string, value?: RunwaySnowbank, onChange?: (value: RunwaySnowbank | null) => void }) {
  const TRANSITIONS: Record<"L" | "R", Record<SnowbankCrossPosition, SnowbankCrossPosition>> = {
    L: {
      NONE: "L",
      L: "NONE",
      R: "LR",
      LR: "R",
    },
    R: {
      NONE: "R",
      R: "NONE",
      L: "LR",
      LR: "L",
    },
  };

  const [snowbank, setSnowbank] = useState<RunwaySnowbank>(value || {
    crossPosition: "NONE",
    leftMarginFromCL: 0,
    rightMarginFromCL: 0,
    alongPosition: undefined,
    taxiways: ["", ""]
  });

  const prevTextRef = useRef<string | undefined>(undefined);

  const snowBankText = useMemo(() => {
    try {
      return parseSnowBankOnRunway(snowbank, runway);
    } catch {
      return undefined;
    }
  }, [snowbank, runway]);

  useEffect(() => {
    if (!onChange) return;
    if (prevTextRef.current === snowBankText) return;
    prevTextRef.current = snowBankText;
    onChange(snowBankText ? snowbank : null);
  }, [onChange, snowBankText, snowbank]);

  const toggleCrossPosition = (side: "L" | "R") => {
    setSnowbank(prev => ({
      ...prev,
      crossPosition: TRANSITIONS[side][prev.crossPosition]
    }));
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-between">
        <InputHeadline title="Margin from centerline*" tooltip="" linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=15L%20CHEMICALLY%20TREATED%22-,Item%20M,-.%20Snow%20banks%20on" />
        <div className="flex w-full flex-wrap">
          <div className="w-1/2 flex items-center gap-1">
            <Switch checked={(snowbank.crossPosition === "L" || snowbank.crossPosition === "LR")} onClick={() => toggleCrossPosition("L")} />
            <span>Left from centerline</span>
          </div>
          <div className="w-1/2 flex items-center gap-1">
            <Switch checked={(snowbank.crossPosition === "R" || snowbank.crossPosition === "LR")} onClick={() => toggleCrossPosition("R")} />
            <span>Right from centerline</span>
          </div>
          <div className="w-full mt-1 flex items-center gap-1">
            <div className="w-1/2">
              <InputHeadline title="Left margin from centerline in meters" tooltip="" linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=15L%20CHEMICALLY%20TREATED%22-,Item%20M,-.%20Snow%20banks%20on" />
              <Input
                placeholder="Margin in meters"
                type="number"
                value={snowbank.leftMarginFromCL ?? 0}
                onChange={(e) => setSnowbank(prev => ({
                  ...prev,
                  leftMarginFromCL: e.currentTarget.value === "" ? 0 : Number(e.currentTarget.value)
                }))}
              />
            </div>
            <div className="w-1/2">
              <InputHeadline title="Right margin from centerline in meters" tooltip="" linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=15L%20CHEMICALLY%20TREATED%22-,Item%20M,-.%20Snow%20banks%20on" />
              <Input
                placeholder="Margin in meters"
                type="number"
                value={snowbank.rightMarginFromCL ?? 0}
                onChange={(e) => setSnowbank(prev => ({
                  ...prev,
                  rightMarginFromCL: e.currentTarget.value === "" ? 0 : Number(e.currentTarget.value)
                }))}
              />
            </div>
          </div>
        </div>
      </div>
      <Separator className="my-2" />
      <div className="flex items-center justify-between flex-col">
        <InputHeadline title="Position along the runway" tooltip="" linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=15L%20CHEMICALLY%20TREATED%22-,Item%20M,-.%20Snow%20banks%20on" />
        <div className="w-full flex">
          <div className="w-1/2 flex items-center gap-1">
            <Switch checked={snowbank.alongPosition === "THR"} onClick={() => {
              setSnowbank(prev => ({
                ...prev,
                alongPosition: prev.alongPosition === "THR" ? undefined : "THR"
              }));
            }} />
            <span>From THR</span>
          </div>
          <div className="w-1/2 flex items-center gap-1">
            <Switch checked={snowbank.alongPosition === "MID"} onClick={() => {
              setSnowbank(prev => ({
                ...prev,
                alongPosition: prev.alongPosition === "MID" ? undefined : "MID"
              }));
            }} />
            <span>From MID</span>
          </div>
        </div>
        <div className="w-full flex items-center gap-1 mt-1">
          <Switch checked={snowbank.alongPosition === "BTN TWY"} onClick={() => {
            setSnowbank(prev => ({
              ...prev,
              alongPosition: prev.alongPosition === "BTN TWY" ? undefined : "BTN TWY"
            }));
          }} />
          <span>Between taxiways</span>
          <Input
            className="max-w-[10%]"
            placeholder="A"
            value={snowbank.taxiways?.[0] || ""}
            onChange={(e) =>
              setSnowbank(prev => ({
                ...prev,
                taxiways: [e.target.value, prev.taxiways?.[1] || ""]
              }))
            }
          />
          <span>and</span>
          <Input
            className="max-w-[10%]"
            placeholder="B"
            value={snowbank.taxiways?.[1] || ""}
            type="text"
            onChange={(e) =>
              setSnowbank(prev => ({
                ...prev,
                taxiways: [prev.taxiways?.[0] || "", e.target.value]
              }))
            }
          />
        </div>
        <div
          className={`w-full transition-opacity duration-300 ${snowBankText ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}
        >
          {snowBankText && (
            <Code className="mt-2" text={snowBankText} />
          )}
        </div>
      </div>
    </div>
  )
}

function TaxiwaySnowBankSelector({ runways, value, onChange }: { runways: string[], value?: TaxiwaySnowbank, onChange?: (value: TaxiwaySnowbank | null) => void }) {
  const [snowbank, setSnowbank] = useState<TaxiwaySnowbank>(value || {
    taxiway: "",
    position: undefined,
    taxiways: ["", undefined],
    runway: ""
  });

  const prevTextRef = useRef<string | undefined>(undefined);

  const setPosition = (newPosition: TaxiwaySnowbankPosition) => {
    setSnowbank(prev => ({
      ...prev,
      position: newPosition,
      taxiways: ["", undefined]
    }));
  }

  const snowBankText = useMemo(() => {
    if (!snowbank.taxiway || snowbank.taxiway.trim() === "") return undefined;
    try {
      return parseSnowBankOnTaxiway(snowbank);
    } catch {
      return undefined;
    }
  }, [snowbank]);

  useEffect(() => {
    if (!onChange) return;
    if (prevTextRef.current === snowBankText) return;
    prevTextRef.current = snowBankText;
    onChange(snowBankText ? snowbank : null);
  }, [onChange, snowBankText, snowbank]);

  return (
    <div>
      <div className="flex items-center gap-2">
        <span>Snowbank on TWY </span>
        <TaxiwayField value={snowbank.taxiway} onChange={(value) => setSnowbank(prev => ({ ...prev, taxiway: value }))} />
      </div>
      <div>
        <div className="flex items-center gap-2 mt-2">
          <SwitchField checked={snowbank.position === "BTN TWY"} onClick={() => {
            setPosition(snowbank.position === "BTN TWY" ? undefined : "BTN TWY");
          }} label="BTN TWY" />
          <TaxiwayField
            disabled={snowbank.position !== "BTN TWY"}
            value={snowbank.position === "BTN TWY" ? snowbank.taxiways?.[0] || "" : ""}
            onChange={(value) => {
              setSnowbank(prev => ({
                ...prev,
                taxiways: [value, prev.taxiways?.[1]]
              }));
            }}
          />
          <span>and</span>
          <TaxiwayField
            disabled={snowbank.position !== "BTN TWY"}
            value={snowbank.position === "BTN TWY" ? snowbank.taxiways?.[1] ?? "" : ""}
            onChange={(value) => {
              setSnowbank(prev => ({
                ...prev,
                taxiways: [prev.taxiways?.[0] || "", value]
              }));
            }}
          />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <SwitchField checked={snowbank.position === "FM TWY"} onClick={() => {
            setPosition(snowbank.position === "FM TWY" ? undefined : "FM TWY");
          }} label="FM TWY" />
          <TaxiwayField
            disabled={snowbank.position !== "FM TWY"}
            value={snowbank.position === "FM TWY" ? snowbank.taxiways?.[0] || "" : ""}
            onChange={(value) => {
              setSnowbank(prev => ({
                ...prev,
                taxiways: [value, undefined]
              }));
            }}
          />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <SwitchField checked={snowbank.position === "BTN TWY AND RWY"} onClick={() => {
            setPosition(snowbank.position === "BTN TWY AND RWY" ? undefined : "BTN TWY AND RWY");
          }} label="BTN TWY" />
          <TaxiwayField
            disabled={snowbank.position !== "BTN TWY AND RWY"}
            value={snowbank.position === "BTN TWY AND RWY" ? snowbank.taxiways?.[0] || "" : ""}
            onChange={(value) => {
              setSnowbank(prev => ({
                ...prev,
                taxiways: [value, undefined]
              }));
            }}
          />
          <span>AND RWY</span>
          <Combobox
            disabled={snowbank.position !== "BTN TWY AND RWY"}
            items={runways}
            value={snowbank.runway || ""}
            onValueChange={(value) => {
              if(!value) return;
              setSnowbank(prev => ({ ...prev, runway: value }));
            }}
          >
            <ComboboxInput disabled={snowbank.position !== "BTN TWY AND RWY"} className="w-17" placeholder={runways.length === 1 ? runways[0] : "Select runway"} />
            <ComboboxContent>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>
      {snowBankText && snowBankText.trim() !== "" && (
        <div className="w-full mt-2">
          <Code text={snowBankText} />
        </div>
      )}
    </div>
  )
}