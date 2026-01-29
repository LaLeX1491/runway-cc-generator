import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import { useState} from 'react';
import RunwayItemsForm from '@/components/forms/SituationalAwarenessForms';
import {Card, CardContent} from '@/components/ui/card';
import { RunwayItemsFormState } from '@/lib/types';
import { SnowbankOnTaxiwaySelector } from './forms/SnowBankSelectors';
import SwitchField from '@/components/ui/SwitchField';
import InputHeadline from '@/components/ui/InputHeadline';
import FadeIn from '@/components/ui/FadeIn';

export default function SituationalAwarenessSection({activeRunways}: {activeRunways: string[]}) {
  const [selectedRunway, setSelectedRunway] = useState(activeRunways[0]);
  const [includeItemN, setIncludeItemN] = useState<boolean>(false);
  const [runwayItemsFormState, setRunwayItemsFormState] = useState<Record<string, RunwayItemsFormState>>(
    () => {
      const initialState: Record<string, RunwayItemsFormState> = {};
      activeRunways.forEach((runway) => {
        initialState[runway] = {
          includeItemI: false,
          includeItemJ: false,
          includeItemK: false,
          includeItemL: false,
          includeItemM: false,
        };
      });
      return initialState;
    }
  );
  const updateRunwayItemsFormState = (runway: string, updates: Partial<RunwayItemsFormState>) => {
    setRunwayItemsFormState(prev => ({
      ...prev,
      [runway]: {
        ...prev[runway],
        ...updates
      }
    }));
  };

  return (
    <section className="w-full flex justify-center items-center flex-col">
      <h1>Here you can select multiple optional items like treatment of the runways, taxiway and apron closures & more.</h1>

      <Tabs value={selectedRunway} onValueChange={setSelectedRunway} className="w-1/2 my-4 rounded-b-none flex items-center justify-center">
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
                {runwayItemsFormState[runway] && (
                  <RunwayItemsForm runway={runway} state={runwayItemsFormState[runway]} onUpdate={(updates) => updateRunwayItemsFormState(runway, updates)} />
                )}
              </TabsContent>
            ))}

            <div className="flex flex-col gap-2">
              <div>
                <InputHeadline title={"Snowbanks on taxiways"} tooltip={"Include item"} linkToIcao={"item N"} />
                <SwitchField checked={includeItemN} onClick={() => setIncludeItemN(!includeItemN)} label={"Include item"} />
                <FadeIn shown={includeItemN}>
                  <SnowbankOnTaxiwaySelector runways={activeRunways} />
                </FadeIn>
              </div>

              <div>
                <InputHeadline title={"Snowbanks adjacent to the runway"} tooltip={"Include item"} linkToIcao={"item N"} />
                <SwitchField checked={includeItemN} onClick={() => setIncludeItemN(!includeItemN)} label={"Include item"} />
                <FadeIn shown={includeItemN}>
                  <SnowbankOnTaxiwaySelector runways={activeRunways} />
                </FadeIn>
              </div>
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </section>
  )
}
