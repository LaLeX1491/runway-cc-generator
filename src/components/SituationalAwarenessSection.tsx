import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {useEffect, useState} from 'react';
import RunwayItemsForm from '@/components/forms/SituationalAwarenessForms';
import {Card} from '@/components/ui/card';

export default function SituationalAwarenessSection({activeRunways}: {activeRunways: string[]}) {
  const [selectedTab, setSelectedTab] = useState(activeRunways[0]);

  useEffect(() => {
    setSelectedTab(activeRunways[0]);
  }, [activeRunways]);

  return (
    <section className="w-full flex justify-center items-center flex-col">
      <h1>Here you can select multiple optional items like treatment of the runways, taxiway and apron closures & more.</h1>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-1/2 my-4 flex items-center justify-center">
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
              <RunwayItemsForm runway={runway} />
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
