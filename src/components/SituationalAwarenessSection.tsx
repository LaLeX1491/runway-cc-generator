import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import { useState, useMemo} from 'react';
import RunwayItemsForm from '@/components/forms/SituationalAwarenessForms';
import {Card, CardContent} from '@/components/ui/card';
import { RunwayItemsFormState } from '@/lib/types';
import { SnowbankOnTaxiwaySelector } from './forms/SnowBankSelectors';
import SwitchField from '@/components/ui/SwitchField';
import InputHeadline from '@/components/ui/InputHeadline';
import FadeIn from '@/components/ui/FadeIn';
import Code from '@/components/ui/code';

export default function SituationalAwarenessSection({activeRunways}: {activeRunways: string[]}) {
  const [includeItemN, setIncludeItemN] = useState<boolean>(false);
  const [includeItemO, setIncludeItemO] = useState<boolean>(false);
  const [itemO, setItemO] = useState<string[]>([]);

  const [runwayItemsFormState, setRunwayItemsFormState] = useState<Record<string, RunwayItemsFormState>>({});

  // Berechne gültigen selectedRunway
  const validSelectedRunway = useMemo(() => {
    const currentSelected = Object.keys(runwayItemsFormState)[0];
    return activeRunways.includes(currentSelected) ? currentSelected : activeRunways[0];
  }, [activeRunways, runwayItemsFormState]);

  const [selectedRunway, setSelectedRunway] = useState(validSelectedRunway);

  // Synchronisiere runwayItemsFormState mit activeRunways
  const syncedRunwayItemsFormState = useMemo(() => {
    const newState: Record<string, RunwayItemsFormState> = {};
    activeRunways.forEach((runway) => {
      newState[runway] = runwayItemsFormState[runway] || {
        includeItemI: false,
        includeItemJ: false,
        includeItemK: false,
        includeItemL: false,
        includeItemM: false,
      };
    });
    return newState;
  }, [activeRunways, runwayItemsFormState]);

  // Bereinige itemO
  const syncedItemO = useMemo(() => {
    return itemO.filter(runway => activeRunways.includes(runway));
  }, [itemO, activeRunways]);

  const updateRunwayItemsFormState = (runway: string, updates: Partial<RunwayItemsFormState>) => {
    setRunwayItemsFormState(prev => ({
      ...prev,
      [runway]: {
        ...prev[runway],
        ...updates
      }
    }));
  };

  // Aktualisiere selectedRunway wenn nicht mehr gültig
  const currentSelectedRunway = activeRunways.includes(selectedRunway) ? selectedRunway : activeRunways[0];

  return (
    <section className="w-full flex justify-center items-center flex-col">
      <h1>Here you can select multiple optional items like treatment of the runways, taxiway and apron closures & more.</h1>

      <Tabs value={currentSelectedRunway} onValueChange={setSelectedRunway} className="w-1/2 my-4 rounded-b-none flex items-center justify-center">
        <div className="w-full justify-between border-b pb-2">
          <TabsList className="flex w-full items-center">
            {activeRunways.map((runway) => (
              <TabsTrigger className="cursor-pointer" key={runway} value={runway}>
                Runway {runway}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <Card className="w-full">
          <CardContent>
            {activeRunways.map((runway) => (
              <TabsContent key={runway} value={runway} className="w-full flex flex-col">
                {syncedRunwayItemsFormState[runway] && (
                  <RunwayItemsForm runway={runway} state={syncedRunwayItemsFormState[runway]} onUpdate={(updates) => updateRunwayItemsFormState(runway, updates)} />
                )}
              </TabsContent>
            ))}

            <div className="flex flex-col gap-2">
              <div>
                <InputHeadline title={"Snowbanks on taxiways"} tooltip={"Include item N"} linkToIcao={"item N"} />
                <SwitchField checked={includeItemN} onClick={() => setIncludeItemN(!includeItemN)} label={"Include item"} />
                <FadeIn shown={includeItemN}>
                  <SnowbankOnTaxiwaySelector runways={activeRunways} />
                </FadeIn>
              </div>

              <div>
                <InputHeadline title={"Snowbanks adjacent to the runway"} tooltip={"Include item O"} linkToIcao={"item O"} />
                <SwitchField checked={includeItemO} onClick={() => setIncludeItemO(!includeItemO)} label={"Include item"} />
                <FadeIn shown={includeItemO}>
                  <>
                    <div className="ml-[10%] flex flex-col w-1/3 justify-between">
                      {activeRunways.map((activeRunway) => (
                        <SwitchField
                          key={activeRunway}
                          checked={syncedItemO.includes(activeRunway)}
                          onClick={() => {
                            setItemO(prev =>
                              prev.includes(activeRunway)
                                ? prev.filter(item => item !== activeRunway)
                                : [...prev, activeRunway]
                            );
                          }}
                          label={"RWY " + activeRunway}
                        />
                      ))}
                    </div>
                    <FadeIn className="mt-2" shown={itemO.length > 0} >
                      <Code
                        text={itemO
                          .map(s => (s != null ? "RWY " + s + " ADJ SNOW BANK." + "\n" : ""))
                          .join("")
                        } />
                    </FadeIn>
                  </>
                </FadeIn>
              </div>
              <div>

              </div>
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </section>
  )
}