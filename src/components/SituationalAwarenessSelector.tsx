import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Card, CardContent} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import InputHeadline from '@/components/InputHeadline';
import Code from '@/components/ui/code';
import {Switch} from '@/components/ui/switch';
import {useEffect, useState} from 'react';
import {Separator} from '@/components/ui/separator';
import {SnowBank, SnowbankAlongPosition, SnowbankCrossPosition} from '@/lib/types';

export default function SituationalAwarenessSelector({activeRunways}: {activeRunways: string[]}) {
  const [snowBankOnRunways, setSnowBankOnRunways] = useState<boolean>(false);

  return (
    <section className="w-full flex justify-center items-center flex-col">
      <h1>Here you can select multiple optional items like treatment of the runways, taxiway and apron closures & more.</h1>

      <Tabs defaultValue={activeRunways[0]} className="w-1/2 my-4 flex items-center justify-center">
        <div className="w-full justify-between border-b pb-2">
          <TabsList className="flex w-full items-center">
            {activeRunways.map((runway) => (
              <TabsTrigger className="cursor-pointer" key={runway} value={runway}>Runway {runway}</TabsTrigger>
            ))}
          </TabsList>
        </div>

        {activeRunways.map((runway) => (
          <TabsContent key={runway} value={runway} className="w-full flex flex-col gap-2">
            <Card>
              <CardContent>
                <InputHeadline title="Reduced runway length" tooltip="Item I: Used if the runway has to be reduced due to contamination." linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=left%20out%20completely.-,Item%20I,-.%20Reduced%20runway%20length" />
                <div className="flex items-center gap-2">
                  <Switch />
                  <span>Include information</span>
                </div>
                <Input placeholder="Remaining runway length" type="number" />
                <Code className="mt-2" text={"RWY " + runway + " REDUCED TO X METERS"} />
              </CardContent>

              <CardContent>
                <InputHeadline title="Drifiting snow on the runway" tooltip="Item J: Drifting snow on the runway" linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=REDUCED%20TO%202000%22-,Item%20J,-.%20Drifting%20snow%20on" />
                <div className="flex items-center gap-2">
                  <Switch />
                  <span>Include information</span>
                </div>
                <Code className="mt-2" text={"RWY " + runway + " DRIFTING SNOW "} />
              </CardContent>

              <CardContent>
                <InputHeadline title="Loose sand" tooltip="Item K: Loose sand on the runway" linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=example%3A%20%22DRIFTING%20SNOW%22.-,Item%20K,-.%20Loose%20sand%20on" />
                <div className="flex items-center gap-2">
                  <Switch />
                  <span>Include information</span>
                </div>
                <Code className="mt-2" text={"RWY " + runway + " LOOSE SAND"} />
              </CardContent>

              <CardContent>
                <InputHeadline title="Runway chemical treatment" tooltip="Item L: Chemical treatment on the runway" linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=09%20LOOSE%20SAND%22-,Item%20L,-.%20Chemical%20treatment%20on" />
                <div className="flex items-center gap-2">
                  <Switch />
                  <span>Include information</span>
                </div>
                <Code className="mt-2" text={"RWY " + runway + " CHEMICALLY TREATED"} />
              </CardContent>

              <CardContent>
                <InputHeadline title="Snow bank on runway" tooltip="Item M: Snow banks on the runway" linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=15L%20CHEMICALLY%20TREATED%22-,Item%20M,-.%20Snow%20banks%20on" />
                <div className="flex items-center gap-2">
                  <Switch onClick={() => setSnowBankOnRunways(!snowBankOnRunways)} />
                  <span>Include information</span>
                </div>
                {snowBankOnRunways && (
                  <SnowBankOnRunwaySelector />
                )}
                <Code className="mt-2" text={"RWY " + runway + " CHEMICALLY TREATED"} />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}

function SnowBankOnRunwaySelector() {
  return (
    <div>
      <SnowBankSelector />
    </div>
  )
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
    if(onChange) {
      if(crossPosition && marginFromCL) {
        if(alongPosition === "BTN TWY" && taxiways[0] && taxiways[1]) {
          onChange({
            crossPosition,
            margin: marginFromCL,
            alongPosition,
            btnTaxiways: taxiways
          })
        } else onChange({
          crossPosition,
          margin: marginFromCL,
          alongPosition,
        })
      }
    }
  });

  const toggleCrossPosition = (side: "L" | "R") => {
    setCrossPosition(prev => TRANSITIONS[side][prev]);
  };

  return (
    <Card className="flex w-full">
      <CardContent className="">
        <div className="flex flex-col items-center justify-between">
          <InputHeadline title="Margin from centerline*" tooltip="" linkToIcao="" />
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
          <InputHeadline title="Position along the runway" tooltip="" linkToIcao="" />
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
              value={taxiways[0]}
              onChange={(e) =>
                setTaxiways(prev => [e.target.value, prev[1]])
              }
            />
            <span>and</span>
            <Input
              className="max-w-[10%]"
              value={taxiways[1]}
              type="text"
              onChange={(e) =>
                setTaxiways(prev => [prev[0], e.target.value])
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}