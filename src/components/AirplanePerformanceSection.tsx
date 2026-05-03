"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { clsx } from "clsx";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { CONDITION_CODES, getConditionCodeOptions } from "@/lib/data";
import { ConditionCode, ContaminationLevel, ContaminationType, LooseContaminationDepth, RunwayZone } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import InputHeadline from '@/components/ui/InputHeadline';
import { useData } from '@/context/DataProvider';
import { useReducer } from 'react';

type State = {
  selectedCondition: ConditionCode;
  contaminationType: ContaminationType | null;
  contaminationLevel: ContaminationLevel | null;
  looseContaminationDepth: LooseContaminationDepth | null;
  applyWidth: number | null;
};

type Action =
  | { type: 'SET_CONDITION'; payload: ConditionCode }
  | { type: 'SET_CONTAMINATION_TYPE'; payload: ContaminationType | null }
  | { type: 'SET_CONTAMINATION_LEVEL'; payload: ContaminationLevel | null }
  | { type: 'SET_LOOSE_DEPTH'; payload: LooseContaminationDepth | null }
  | { type: 'SET_APPLY_WIDTH'; payload: number | null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_CONDITION': {
      const cc = action.payload;
      return {
        ...state,
        selectedCondition: cc,
        contaminationType: cc === 6 ? (getConditionCodeOptions(6)[0] ?? null) : null,
        contaminationLevel: null,
        looseContaminationDepth: null,
        applyWidth: null,
      };
    }
    case 'SET_CONTAMINATION_TYPE':
      return { ...state, contaminationType: action.payload, contaminationLevel: null, looseContaminationDepth: null };
    case 'SET_CONTAMINATION_LEVEL':
      return { ...state, contaminationLevel: action.payload, looseContaminationDepth: null };
    case 'SET_LOOSE_DEPTH':
      return { ...state, looseContaminationDepth: action.payload };
    case 'SET_APPLY_WIDTH':
      return { ...state, applyWidth: action.payload };
    default:
      return state;
  }
}

export default function AirplanePerformanceSection({ runway, runwayZone }: { runway: string; runwayZone: RunwayZone }) {
  const { setRunwayCondition } = useData();

  const [state, dispatch] = useReducer(reducer, {
    selectedCondition: 6,
    contaminationType: getConditionCodeOptions(6)[0] ?? null,
    contaminationLevel: null,
    looseContaminationDepth: null,
    applyWidth: null,
  });

  const { selectedCondition, contaminationType, contaminationLevel, looseContaminationDepth, applyWidth } = state;

  // Sync to context whenever a complete set of required fields is available
  useEffect(() => {
    if (!contaminationLevel && selectedCondition !== 6) return;
    if (contaminationType?.looseContaminant && !looseContaminationDepth) return;

    setRunwayCondition(
      runway,
      runwayZone,
      selectedCondition,
      contaminationLevel ?? "NR",
      looseContaminationDepth ?? undefined,
      applyWidth ?? undefined,
    );
  }, [runway, runwayZone, selectedCondition, contaminationType, contaminationLevel, looseContaminationDepth, applyWidth, setRunwayCondition]);

  const contaminants = getConditionCodeOptions(selectedCondition);

  const showLevelSelector = selectedCondition !== 6 && contaminationType !== null;
  const showLooseDepthSelector = !!contaminationType?.looseContaminant && !!contaminationLevel;
  const showApplyWidth =
    (contaminationType?.looseContaminant && !!looseContaminationDepth) ||
    (!contaminationType?.looseContaminant && !!contaminationLevel);

  return (
    <div className="flex flex-col gap-3 px-5">
      <h1 className="text-center">Condition Code</h1>
      <div className="flex w-full justify-center gap-2 flex-wrap">
        {(Object.keys(CONDITION_CODES).map(Number).sort((a, b) => b - a) as ConditionCode[]).map((key) => (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                onClick={() => dispatch({ type: 'SET_CONDITION', payload: key })}
                className={clsx(
                  selectedCondition === key && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                )}
              >
                {key}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{CONDITION_CODES[key]}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      <div className="w-full justify-center flex flex-wrap">
        <div className="w-full max-w-[--radix-combobox-trigger-width]">
          <Combobox
            items={contaminants.map(c => c.desc)}
            value={contaminationType?.desc || ""}
            onValueChange={(value) => {
              const selected = contaminants.find(c => c.desc === value) ?? null;
              dispatch({ type: 'SET_CONTAMINATION_TYPE', payload: selected });
            }}
          >
            <InputHeadline
              title="Contamination type*"
              tooltip="Item G: Select the type of contamination"
              linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=dry%20snow-,Item%20G,-.%20Condition%20description%20for"
            />
            <ComboboxInput placeholder="Select condition" />
            <ComboboxContent>
              <ComboboxList>
                {contaminants.map(c => (
                  <ComboboxItem key={c.desc} value={c.desc}>
                    {c.rcamRule ? (
                      <Tooltip>
                        <TooltipTrigger>{c.desc}*</TooltipTrigger>
                        <TooltipContent>{c.rcamRule}</TooltipContent>
                      </Tooltip>
                    ) : (
                      <span>{c.desc}</span>
                    )}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>

      {showLevelSelector && (
        <div className="w-full justify-center flex flex-wrap">
          <div className="w-full max-w-xs">
            <Combobox
              items={["NR", "25%", "50%", "75%", "100%"]}
              value={contaminationLevel
                ? (contaminationLevel !== "NR" ? contaminationLevel + "%" : contaminationLevel)
                : ""}
              onValueChange={(value) => {
                if (!value) return;
                dispatch({ type: 'SET_CONTAMINATION_LEVEL', payload: value.replace("%", "") as ContaminationLevel });
              }}
            >
              <InputHeadline
                title="Contamination level*"
                tooltip="Item E: Percent coverage of contamination"
                linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=item%20is%20mandatory.-,Item%20E,-.%20Per%20cent%20coverage"
              />
              <ComboboxInput placeholder="Select contamination level" />
              <ComboboxContent>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>{item}</ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
        </div>
      )}

      {showLooseDepthSelector && (
        <div className="w-full justify-center flex flex-wrap">
          <div className="w-full max-w-xs">
            <Combobox
              items={[
                "NR",
                ...Array.from(
                  {
                    length: contaminationType.maxLooseContaminant
                      ? contaminationType.maxLooseContaminant + 1
                      : contaminationType.minLooseContaminant
                        ? 51 - contaminationType.minLooseContaminant
                        : 50
                  },
                  (_, i) => (i + (contaminationType.minLooseContaminant ?? 1)).toString()
                )
              ]}
              value={looseContaminationDepth !== null
                ? (looseContaminationDepth !== "NR" ? String(looseContaminationDepth) + "mm" : "NR")
                : ""}
              onValueChange={(value) => {
                if (!value) return;
                dispatch({ type: 'SET_LOOSE_DEPTH', payload: value.replace("mm", "") as LooseContaminationDepth });
              }}
            >
              <InputHeadline
                title="Loose contamination depth*"
                tooltip="Item F: Enter mm (depth) of loose contamination"
                linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=instead%20of%20numbers.-,Item%20F,-.%20Depth%20of%20loose"
              />
              <ComboboxInput placeholder="Select loose contamination depth" />
              <ComboboxContent>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}{item !== "NR" && "mm"}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
        </div>
      )}

      {showApplyWidth && (
        <div className="w-full justify-center flex flex-wrap">
          <div className="w-full max-w-xs">
            <InputHeadline
              title="Apply width"
              tooltip="Item H: Width of runway to which the condition codes apply (leave blank for full width)"
              linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=is%20no%20contaminant)-,Item%20H,-.%20Width%20of%20runway"
            />
            <Input
              value={applyWidth ?? ""}
              onChange={(e) => dispatch({
                type: 'SET_APPLY_WIDTH',
                payload: e.currentTarget.value === "" ? null : Number(e.currentTarget.value)
              })}
              type="number"
              placeholder="Apply width (optional)"
            />
          </div>
        </div>
      )}
    </div>
  );
}