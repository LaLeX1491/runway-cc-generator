import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {useEffect, useState} from 'react';
import RunwayItemsForm from '@/components/forms/SituationalAwarenessForms';
import {Card} from '@/components/ui/card';
import { RunwayItemsFormState } from '@/lib/types';
import { SnowbankOnTawxiwaySelector } from './forms/SnowBankSelectors';

export default function SituationalAwarenessSection({activeRunways}: {activeRunways: string[]}) {
  const [selectedRunway, setSelectedRunway] = useState(activeRunways[0]);
  const [runwayItemsFormState, setRunwayItemsFormState] = useState<Record<string, RunwayItemsFormState>>({});

  useEffect(() => {
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
    setRunwayItemsFormState(initialState);
    setSelectedRunway(activeRunways[0]);
  }, [activeRunways]);

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

      <Tabs value={selectedRunway} onValueChange={setSelectedRunway} className="w-1/2 my-4 flex items-center justify-center">
        <div className="w-full justify-between border-b pb-2">
          <TabsList className="flex w-full items-center">
            {activeRunways.map((runway) => (
              <TabsTrigger className="cursor-pointer" key={runway} value={runway}>
                Runway {runway}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {activeRunways.map((runway) => (
          <TabsContent key={runway} value={runway} className="w-full flex flex-col">
            <Card>
              {runwayItemsFormState[runway] && (
                <div>
                  <RunwayItemsForm runway={runway} state={runwayItemsFormState[runway]} onUpdate={(updates) => updateRunwayItemsFormState(runway, updates)} />
                  <SnowbankOnTawxiwaySelector runways={activeRunways} /> 
                </div>
              )}
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
