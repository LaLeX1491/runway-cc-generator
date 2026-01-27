import {useEffect, useState} from 'react';
import {Separator, SeparatorWithLabel} from '@/components/ui/separator';
import {Card, CardContent} from '@/components/ui/card';
import { Button } from '../ui/button';
import {CirclePlus, Trash} from 'lucide-react';
import {SnowBank, SnowbankAlongPosition, SnowbankCrossPosition} from '@/lib/types';
import InputHeadline from '@/components/ui/InputHeadline';
import {Switch} from '@/components/ui/switch';
import {Input} from '@/components/ui/input';

const MAX_SNOWBANKS = 5;
export default function SnowBankOnRunwaySelector() {
  const [snowBanks, setSnowBanks] = useState<(SnowBank | null)[]>([null]);

  const updateSnowBank = (index: number, value: SnowBank) => {
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
        {snowBanks.map((_, index) => (<>
          <SeparatorWithLabel className="mt-0" title={"Snowbank " + (index+1)} />
          <SnowBankSelector
            key={index}
            onChange={(value) => updateSnowBank(index, value)}
          />
        </>))}

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
      </CardContent>
    </Card>
  );
}

function SnowBankSelector({ onChange }: { onChange?: (value: SnowBank) => void }) {
  const TRANSITIONS: Record<
    "L" | "R",
    Record<SnowbankCrossPosition, SnowbankCrossPosition>
  > = {
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
  const [marginFromCL, setMarginFromCL] = useState<number>(0);

  useEffect(() => {
    if (!onChange) return;

    if (!crossPosition || !marginFromCL) return;

    if (alongPosition === "BTN TWY") {
      if (!taxiways[0] || !taxiways[1]) return;

      onChange({
        crossPosition,
        margin: marginFromCL,
        alongPosition,
        btnTaxiways: taxiways,
      });
    } else {
      onChange({
        crossPosition,
        margin: marginFromCL,
        alongPosition,
      });
    }
  }, [crossPosition, marginFromCL, alongPosition, taxiways]);


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
          <div className="w-full mt-1 flex flex-col items-center gap-1">
            <InputHeadline title="Margin from centerline in meters" tooltip="" linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=15L%20CHEMICALLY%20TREATED%22-,Item%20M,-.%20Snow%20banks%20on" />
            <Input
              placeholder="Margin in meters"
              type="number"
              value={marginFromCL ?? ""}
              onChange={(e) => setMarginFromCL(Number(e.currentTarget.value))}
            />
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
      </div>
    </div>
  )
}