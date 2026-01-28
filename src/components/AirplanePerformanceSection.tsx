"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { clsx } from "clsx";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {CONDITION_CODES, getConditionCodeOptions} from "@/lib/data";
import {ConditionCode, ContaminationLevel, ContaminationType, LooseContaminationDepth} from '@/lib/types';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {Input} from '@/components/ui/input';
import InputHeadline from '@/components/ui/InputHeadline';

export default function AirplanePerformanceSection({equalContamination = false}: { equalContamination?: boolean }) {
  const [selectedCondition, setSelectedCondition] = useState<ConditionCode>("6");
  const [contaminationType, setContaminationType] = useState<ContaminationType | null>(
    selectedCondition === "6" ? getConditionCodeOptions("6")[0] ?? null : null
  );
  const [contaminationLevel, setContaminationLevel] = useState<ContaminationLevel | null>(null);
  const [looseContaminationDepth, setLooseContaminationDepth] = useState<LooseContaminationDepth | null>(null);

  const setCondition = (cc: ConditionCode) => {
    if (cc !== selectedCondition) {
      setContaminationType(cc === "6" ? getConditionCodeOptions("6")[0] ?? null : null);
      setContaminationLevel(null);
      setSelectedCondition(cc);
    }
  };

  const contaminants = getConditionCodeOptions(selectedCondition);

  return (
    <div className="flex flex-col gap-3 px-5">
      <h1 className="text-center">Condition Code</h1>
      <div className="flex w-full justify-center gap-2 flex-wrap">
        {Object.keys(CONDITION_CODES)
          .map(Number)
          .sort((a, b) => b - a)
          .map((numKey) => {
            const key = numKey.toString() as ConditionCode;
            return (
              <Tooltip key={key}>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={() => setCondition(key)}
                    className={clsx(
                      selectedCondition === key &&
                      "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    )}
                  >
                    {key}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{CONDITION_CODES[key]}</TooltipContent>
              </Tooltip>
            );
          })}
      </div>

      <div className="w-full justify-center flex flex-wrap">
        <div className="w-full max-w-[--radix-combobox-trigger-width]">
          <Combobox
            items={contaminants.map(c => c.desc)}
            value={contaminationType?.desc || ""}
            onValueChange={(value) => {
              const selected = contaminants.find(c => c.desc === value);
              if (!selected) return;
              setContaminationType(selected);
            }}
          >
            <InputHeadline title="Contamination type*" tooltip="Item G: Select the type of contamination" linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=dry%20snow-,Item%20G,-.%20Condition%20description%20for" />
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

      {selectedCondition !== "6" && contaminationType && (
        <div className="w-full justify-center flex flex-wrap">
          <div className="w-full max-w-xs">
            <Combobox
              items={["NR", "25%", "50%", "75%", "100%"]}
              value={
                contaminationLevel
                  ? ((contaminationLevel as string) !== "NR"
                  ? contaminationLevel + "%"
                  : contaminationLevel) || ""
                  : ""}
              onValueChange={(value) => {
                if(!value) return;
                setContaminationLevel(value.replaceAll("%", "") as ContaminationLevel);
              }}
            >
              <InputHeadline title="Contamination level*" tooltip="Item E: Percent coverage of contamination" linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=item%20is%20mandatory.-,Item%20E,-.%20Per%20cent%20coverage" />
              <ComboboxInput placeholder="Select contamination level"/>
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
      )}

      {contaminationType?.looseContaminant && contaminationLevel && (
        <div className="w-full justify-center flex flex-wrap">
          <div className="w-full max-w-xs">
            <Combobox
              items={[
                "NR",
                ...Array.from(
                  { length: (
                      contaminationType.maxLooseContaminant
                        ? contaminationType.maxLooseContaminant+1
                        : contaminationType.minLooseContaminant
                          ? 51-contaminationType.minLooseContaminant
                          : 50
                    )
                  },
                  (_, i) => (i + (contaminationType.minLooseContaminant ? contaminationType.minLooseContaminant : 1)).toString())
              ]}
              value={
                looseContaminationDepth
                  ? (looseContaminationDepth !== "NR"
                    ? String(looseContaminationDepth) + "mm"
                    : String(looseContaminationDepth))
                  : ""
              }
              onValueChange={(value) => {
                if(!value) return;
                setLooseContaminationDepth(value.replaceAll("mm", "") as LooseContaminationDepth);
              }}
            >
              <InputHeadline title="Loose contamination depth*" tooltip="Item F: Enter mm (depth) of loose contamination" linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=instead%20of%20numbers.-,Item%20F,-.%20Depth%20of%20loose" />
              <ComboboxInput placeholder="Select loose contamination depth"/>
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

      {((contaminationType?.looseContaminant && looseContaminationDepth) || (contaminationType?.looseContaminant === undefined && contaminationLevel)) && (
        <div className="w-full justify-center flex flex-wrap">
          <div className="w-full max-w-xs">
            <InputHeadline title="Apply width" tooltip="Item H: Width of runway to wich the condition codes apply (leave blank for full width)" linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=is%20no%20contaminant)-,Item%20H,-.%20Width%20of%20runway" />
            <Input type="number" placeholder="Apply width" />
          </div>
        </div>
      )}
    </div>
  );
}