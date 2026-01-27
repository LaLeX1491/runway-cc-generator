import {useEffect, useMemo, useState} from 'react';
import {Separator, SeparatorWithLabel} from '@/components/ui/separator';
import {Card, CardContent} from '@/components/ui/card';
import { Button } from '../ui/button';
import {CirclePlus, Trash} from 'lucide-react';
import {SnowbankAlongPosition, SnowbankCrossPosition} from '@/lib/types';
import InputHeadline from '@/components/ui/InputHeadline';
import {Switch} from '@/components/ui/switch';
import {Input} from '@/components/ui/input';
import Code from '@/components/ui/code';
import {parseSnowBank} from '@/lib/parser';

const MAX_SNOWBANKS = 5;
export default function SnowBankOnRunwaySelector({runway}: {runway: string}) {
  const [snowBanks, setSnowBanks] = useState<(string | null)[]>([null]);

  const updateSnowBank = (index: number, value: string) => {
    setSnowBanks(prev => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const addSnowBank = () => {
    if (snowBanks.length >= MAX_SNOWBANKS) return;
    setSnowBanks(prev => [...prev, null]);
  };

  const deleteLastSnowBank = () => {
    setSnowBanks(prev => prev.slice(0, -1));
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        {snowBanks.map((_, index) => (
          <div>
            <SeparatorWithLabel className="mt-0" title={"Snowbank " + (index+1)} />
            <SnowBankSelector
              key={index}
              runway={runway}
              onChange={(value) => updateSnowBank(index, value)}
            />
          </div>
        ))}

        {snowBanks.length > 1 && (
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={deleteLastSnowBank}
          >
            <Trash />
            Delete current snowbank
          </Button>
        )}

        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={addSnowBank}
          disabled={
            snowBanks.length >= MAX_SNOWBANKS ||
            snowBanks[snowBanks.length - 1] === null
          }
        >
          <CirclePlus />
          Add snow bank ({snowBanks.length}/{MAX_SNOWBANKS})
        </Button>

        {snowBanks.length > 0 && (
          <Code
            text={snowBanks
              .map(s => (s != null ? s + ".\n" : ""))
              .join("")}
          />
        )}
      </CardContent>
    </Card>
  );
}

function SnowBankSelector({ runway, onChange }: { runway: string, onChange?: (value: string) => void }) {
  const TRANSITIONS: Record<"L" | "R", Record<SnowbankCrossPosition, SnowbankCrossPosition> >= {
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

  const [crossPosition, setCrossPosition] = useState<SnowbankCrossPosition>("NONE");
  const [alongPosition, setAlongPosition] = useState<SnowbankAlongPosition>(undefined);
  const [taxiways, setTaxiways] = useState<[string, string]>(["", ""]);
  const [leftMarginFromCL, setLeftMarginFromCL] = useState<number>(0);
  const [rightMarginFromCL, setRightMarginFromCL] = useState<number>(0);

  const snowBankText = useMemo(() => {
    try {
      return parseSnowBank(
        runway,
        crossPosition,
        crossPosition === "L" || crossPosition === "LR" ? leftMarginFromCL : undefined,
        crossPosition === "R" || crossPosition === "LR" ? rightMarginFromCL : undefined,
        alongPosition,
        alongPosition === "BTN TWY" ? taxiways : undefined
      );
    } catch {
      return undefined;
    }
  }, [runway, crossPosition, leftMarginFromCL, rightMarginFromCL, alongPosition, taxiways]);

  useEffect(() => {
    if (!onChange || !snowBankText) return;
    onChange(snowBankText);
  }, [crossPosition, leftMarginFromCL, rightMarginFromCL, alongPosition, taxiways]);


  const toggleCrossPosition = (side: "L" | "R") => {
    setCrossPosition(prev => TRANSITIONS[side][prev]);
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-between">
        <InputHeadline title="Margin from centerline*" tooltip="" linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=15L%20CHEMICALLY%20TREATED%22-,Item%20M,-.%20Snow%20banks%20on" />
        <div className="flex w-full flex-wrap">
          <div className="w-1/2 flex items-center gap-1">
            <Switch checked={(crossPosition === "L" || crossPosition === "LR")} onClick={() => toggleCrossPosition("L")} />
            <span>Left from centerline</span>
          </div>
          <div className="w-1/2 flex items-center gap-1">
            <Switch checked={(crossPosition === "R" || crossPosition === "LR")} onClick={() => toggleCrossPosition("R")} />
            <span>Right from centerline</span>
          </div>
          <div className="w-full mt-1 flex items-center gap-1">
            <div className="w-1/2">
              <InputHeadline title="Left margin from centerline in meters" tooltip="" linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=15L%20CHEMICALLY%20TREATED%22-,Item%20M,-.%20Snow%20banks%20on" />
              <Input
                placeholder="Margin in meters"
                type="number"
                value={leftMarginFromCL ?? ""}
                onChange={(e) => setLeftMarginFromCL(Number(e.currentTarget.value))}
              />
            </div>
            <div className="w-1/2">
              <InputHeadline title="Right margin from centerline in meters" tooltip="" linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=15L%20CHEMICALLY%20TREATED%22-,Item%20M,-.%20Snow%20banks%20on" />
              <Input
                placeholder="Margin in meters"
                type="number"
                value={rightMarginFromCL ?? ""}
                onChange={(e) => setRightMarginFromCL(Number(e.currentTarget.value))}
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
            <Switch checked={alongPosition === "THR"} onClick={() => {
              if(alongPosition === "THR") {
                setAlongPosition(undefined);
              } else setAlongPosition("THR");
            }} />
            <span>From THR</span>
          </div>
          <div className="w-1/2 flex items-center gap-1">
            <Switch checked={alongPosition === "MID"} onClick={() => {
              if(alongPosition === "MID") {
                setAlongPosition(undefined);
              } else setAlongPosition("MID");
            }} />
            <span>From MID</span>
          </div>
        </div>
        <div className="w-full flex items-center gap-1 mt-1">
          <Switch checked={alongPosition === "BTN TWY"} onClick={() => {
            if(alongPosition === "BTN TWY") {
              setAlongPosition(undefined);
            } else setAlongPosition("BTN TWY");
          }} />
          <span>Between taxiways</span>
          <Input
            className="max-w-[10%]"
            placeholder="A"
            value={taxiways[0]}
            onChange={(e) =>
              setTaxiways(prev => [e.target.value, prev[1]])
            }
          />
          <span>and</span>
          <Input
            className="max-w-[10%]"
            placeholder="B"
            value={taxiways[1]}
            type="text"
            onChange={(e) =>
              setTaxiways(prev => [prev[0], e.target.value])
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