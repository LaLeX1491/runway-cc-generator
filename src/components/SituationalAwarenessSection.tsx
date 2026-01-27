import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Card, CardContent} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import InputHeadline from '@/components/ui/InputHeadline';
import Code from '@/components/ui/code';
import {Switch} from '@/components/ui/switch';
import {useState} from 'react';
import SnowBankOnRunwaySelector from '@/components/forms/SnowBankSelectors';

export default function SituationalAwarenessSection({activeRunways}: {activeRunways: string[]}) {
  const [includeItemI, setIncludeItemI] = useState<boolean>(false);
  const [itemI, setItemI] = useState<number | undefined>(undefined);
  const [includeItemJ, setIncludeItemJ] = useState<boolean>(false);
  const [includeItemK, setIncludeItemK] = useState<boolean>(false);
  const [includeItemL, setIncludeItemL] = useState<boolean>(false);
  const [includeItemM, setIncludeItemM] = useState<boolean>(false);

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
          <TabsContent key={runway} value={runway} className="w-full flex flex-col">
            <Card>
              <CardContent>
                <InputHeadline title="Reduced runway length" tooltip="Item I: Used if the runway has to be reduced due to contamination." linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=left%20out%20completely.-,Item%20I,-.%20Reduced%20runway%20length" />
                  <div className="flex items-center gap-2">
                    <Switch checked={includeItemI} onClick={() => setIncludeItemI(!includeItemI)} />
                    <span>Include item</span>
                  </div>
                  {includeItemI && (
                    <div className="mt-2">
                      <Input
                        placeholder="Remaining runway length"
                        type="number"
                        value={itemI ?? ""}
                        onChange={(e) => {
                          const v = e.currentTarget.value;

                          if (v === "") {
                            setItemI(undefined);
                          } else {
                            setItemI(Number(v));
                          }
                        }}
                      />

                      <div
                        className={`transition-opacity duration-300 ${itemI ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}
                      >
                        {itemI && (
                          <Code className="mt-2" text={`RWY ${runway} REDUCED TO ${itemI} METERS`} />
                        )}
                      </div>
                    </div>
                  )}
              </CardContent>

              <StaticItemSelector
                content={"RWY " + runway + " DRIFTING SNOW "}
                title="Drifiting snow on the runway"
                tooltip="Item J: Drifting snow on the runway"
                linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=REDUCED%20TO%202000%22-,Item%20J,-.%20Drifting%20snow%20on"
                value={includeItemJ}
                toggleContent={() => setIncludeItemJ(!includeItemJ)}
              />

              <StaticItemSelector
                content={"RWY " + runway + " LOOSE SAND"}
                title="Loose sand"
                tooltip="Item K: Loose sand on the runway"
                linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=example%3A%20%22DRIFTING%20SNOW%22.-,Item%20K,-.%20Loose%20sand%20on"
                value={includeItemK}
                toggleContent={() => setIncludeItemK(!includeItemK)}
              />

              <StaticItemSelector
                content={"RWY " + runway + " CHEMICALLY TREATED"}
                title="Runway chemical treatment"
                tooltip="Item L: Chemical treatment on the runway"
                linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=09%20LOOSE%20SAND%22-,Item%20L,-.%20Chemical%20treatment%20o"
                value={includeItemL}
                toggleContent={() => setIncludeItemL(!includeItemL)}
              />

              <CardContent>
                <InputHeadline title="Snow bank on runway" tooltip="Item M: Snow banks on the runway" linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=15L%20CHEMICALLY%20TREATED%22-,Item%20M,-.%20Snow%20banks%20on" />
                <div className="flex items-center gap-2">
                  <Switch onClick={() => {
                    setIncludeItemM(!includeItemM);
                    console.log("call")
                  }} />
                  <span>Include item</span>
                </div>
                {includeItemM && (
                  <SnowBankOnRunwaySelector runway={runway} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}

function StaticItemSelector({content, title, tooltip, linkToIcao, value, toggleContent}: {content: string, title: string, tooltip: string, linkToIcao: string, value: boolean, toggleContent: () => void}) {
  return (
    <CardContent>
      <InputHeadline title={title} tooltip={tooltip} linkToIcao={linkToIcao} />
      <div className="flex items-center gap-2">
        <Switch checked={value} className="cursor-pointer" onClick={toggleContent} />
        <span>Include item</span>
      </div>
      <div
        className={`transition-opacity duration-300 ${value ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}
      >
        {value && <Code className="mt-2" text={content} />}
      </div>
    </CardContent>
  )
}