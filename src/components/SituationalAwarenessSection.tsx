import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Card, CardContent} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import InputHeadline from '@/components/ui/InputHeadline';
import Code from '@/components/ui/code';
import {Switch} from '@/components/ui/switch';
import {useState} from 'react';
import SnowBankOnRunwaySelector from '@/components/forms/SnowBankSelectors';

export default function SituationalAwarenessSection({activeRunways}: {activeRunways: string[]}) {
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