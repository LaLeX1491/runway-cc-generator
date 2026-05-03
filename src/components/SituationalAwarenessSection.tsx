import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import { useState, useMemo } from 'react';
import RunwayItemsForm from '@/components/forms/RunwayItemsForm';
import {Card, CardContent} from '@/components/ui/card';
import { SnowbankOnTaxiwaySelector } from './forms/SnowBankSelectors';
import SwitchField from '@/components/ui/SwitchField';
import InputHeadline from '@/components/ui/InputHeadline';
import FadeIn from '@/components/ui/FadeIn';
import Code from '@/components/ui/code';
import {ApronConditionsSelector, TaxiwayConditionsSelector} from '@/components/forms/ApronConditions';
import {Input} from '@/components/ui/input';
import {Combobox, ComboboxInput} from '@/components/ui/combobox';
import {useData} from '@/context/DataProvider';

export default function SituationalAwarenessSection() {
  const {
    activeRunways,
    situationalAwarenessData,
    parsedOutput,
    updateRunwayItems,
    setIncludeItemJ,
    setIncludeItemN,
    setItemN,
    setIncludeItemO,
    toggleItemO,
    setIncludeItemP,
    setItemP,
    setItemPAllTaxiways,
    setIncludeItemR,
    setItemR,
    setItemRAllAprons,
    setItemT
  } = useData();

  const validSelectedRunway = useMemo(() => {
    const currentSelected = Object.keys(situationalAwarenessData.runwayItems)[0];
    return activeRunways.includes(currentSelected) ? currentSelected : activeRunways[0];
  }, [activeRunways, situationalAwarenessData.runwayItems]);

  const [selectedRunway, setSelectedRunway] = useState(validSelectedRunway);

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
                {situationalAwarenessData.runwayItems[runway] && (
                  <RunwayItemsForm
                    runway={runway}
                    state={situationalAwarenessData.runwayItems[runway]}
                    onUpdate={(updates) => updateRunwayItems(runway, updates)}
                    includeItemJ={situationalAwarenessData.includeItemJ}
                    onItemJChange={setIncludeItemJ}
                  />
                )}
              </TabsContent>
            ))}

            <div className="flex flex-col gap-2">
              <div>
                <InputHeadline title={"Snowbanks on taxiways"} tooltip={"Include item N"} linkToIcao={"item N"} />
                <SwitchField checked={situationalAwarenessData.includeItemN} onClick={() => setIncludeItemN(!situationalAwarenessData.includeItemN)} label={"Include item"} />
                <FadeIn shown={situationalAwarenessData.includeItemN}>
                  <SnowbankOnTaxiwaySelector runways={activeRunways} value={situationalAwarenessData.itemN || []} onChange={setItemN} />
                </FadeIn>
              </div>

              <div>
                <InputHeadline title={"Snowbanks adjacent to the runway"} tooltip={"Include item O"} linkToIcao={"item O"} />
                <SwitchField checked={situationalAwarenessData.includeItemO} onClick={() => setIncludeItemO(!situationalAwarenessData.includeItemO)} label={"Include item"} />
                <FadeIn shown={situationalAwarenessData.includeItemO}>
                  <Card>
                    <CardContent>
                      <div className="flex gap-2">
                        {activeRunways.map((activeRunway) => (
                          <SwitchField
                            key={activeRunway}
                            checked={situationalAwarenessData.itemO.includes(activeRunway)}
                            onClick={() => toggleItemO(activeRunway)}
                            label={"RWY " + activeRunway}
                          />
                        ))}
                      </div>
                      <FadeIn className="mt-2" shown={situationalAwarenessData.itemO.length > 0} >
                        <Code
                          text={situationalAwarenessData.itemO
                            .map((s: any) => "RWY " + s + " ADJ SNOW BANK.\n")
                            .join("")
                          } />
                      </FadeIn>
                    </CardContent>
                  </Card>
                </FadeIn>
              </div>
              <div>
                <InputHeadline title={"Taxiway conditions"} tooltip={"EDIT TWY COND"} linkToIcao={""} />
                <SwitchField checked={situationalAwarenessData.includeItemP} onClick={() => setIncludeItemP(!situationalAwarenessData.includeItemP)} label={"Include item"} />
                <FadeIn shown={situationalAwarenessData.includeItemP}>
                  <TaxiwayConditionsSelector
                    value={situationalAwarenessData.itemP || []}
                    onChange={setItemP}
                    allTaxiwaysValue={situationalAwarenessData.itemPAllTaxiways}
                    onAllTaxiwaysChange={setItemPAllTaxiways}
                  />
                </FadeIn>
              </div>
              <div>
                <InputHeadline title={"Apron conditions"} tooltip={"EDIT APN COND"} linkToIcao={""} />
                <SwitchField checked={situationalAwarenessData.includeItemR} onClick={() => setIncludeItemR(!situationalAwarenessData.includeItemR)} label={"Include item"} />
                <FadeIn shown={situationalAwarenessData.includeItemR}>
                  <ApronConditionsSelector
                    value={situationalAwarenessData.itemR || []}
                    onChange={setItemR}
                    allApronsValue={situationalAwarenessData.itemRAllAprons}
                    onAllApronsChange={setItemRAllAprons}
                  />
                </FadeIn>
              </div>
              <div>
                <InputHeadline title="Measured friction coefficient (not applicable in germany)" tooltip="ICAO Item S. NOT APPLICABLE IN GERMANY!" linkToIcao={"Items"} />
                <div className="flex gap-2">
                  <Input disabled placeholder="Coefficient" className="w-1/2" />
                  <Combobox>
                    <ComboboxInput disabled placeholder="Measurement device" className="w-1/2" />
                  </Combobox>
                </div>
              </div>
              <div>
                <InputHeadline title="Freetext" tooltip="ICAO item T - Freetext" linkToIcao="ITEM T" />
                <Input value={situationalAwarenessData.itemT} onInput={(e) => setItemT(e.currentTarget.value)} placeholder="Freetext" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Tabs>

      <div className="w-1/2 mt-4">
        <Card>
          <CardContent className="pt-6">
            <h2 className="font-bold mb-2">Generated Output:</h2>
            <Code text={parsedOutput.situationalAwareness || "No data selected"} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}