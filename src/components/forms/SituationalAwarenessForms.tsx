import {Card, CardContent} from '@/components/ui/card';
import InputHeadline from '@/components/ui/InputHeadline';
import {Switch} from '@/components/ui/switch';
import {Input} from '@/components/ui/input';
import Code from '@/components/ui/code';
import SnowBankOnRunwaySelector from '@/components/forms/SnowBankSelectors';
import { RunwayItemsFormState } from '@/lib/types';

export default function RunwayItemsForm({
  runway, 
  state, 
  onUpdate
}: {
  runway: string, 
  state: RunwayItemsFormState,
  onUpdate: (updates: Partial<RunwayItemsFormState>) => void
}) {
  
  return (
    <div className="flex-col flex gap-2">
      <CardContent>
        <InputHeadline title="Reduced runway length" tooltip="Item I: Used if the runway has to be reduced due to contamination." linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=left%20out%20completely.-,Item%20I,-.%20Reduced%20runway%20length" />
        <div className="flex items-center gap-2">
          <Switch 
            checked={state.includeItemI} 
            onClick={() => onUpdate({ includeItemI: !state.includeItemI })} 
          />
          <span>Include item</span>
        </div>
        {state.includeItemI && (
          <div className="mt-2">
            <Input
              placeholder="Remaining runway length"
              type="number"
              value={state.itemI ?? ""}
              onChange={(e) => {
                const v = e.currentTarget.value;
                onUpdate({ itemI: v === "" ? undefined : Number(v) });
              }}
            />

            <div
              className={`transition-opacity duration-300 ${state.itemI ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}
            >
              {state.itemI && (
                <Code className="mt-2" text={`RWY ${runway} REDUCED TO ${state.itemI} METERS.`} />
              )}
            </div>
          </div>
        )}
      </CardContent>

      <StaticItemSelector
        content={"RWY " + runway + " DRIFTING SNOW."}
        title="Drifiting snow on the runway"
        tooltip="Item J: Drifting snow on the runway"
        linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=REDUCED%20TO%202000%22-,Item%20J,-.%20Drifting%20snow%20on"
        value={state.includeItemJ}
        toggleContent={() => onUpdate({ includeItemJ: !state.includeItemJ })}
      />

      <StaticItemSelector
        content={"RWY " + runway + " LOOSE SAND."}
        title="Loose sand"
        tooltip="Item K: Loose sand on the runway"
        linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=example%3A%20%22DRIFTING%20SNOW%22.-,Item%20K,-.%20Loose%20sand%20on"
        value={state.includeItemK}
        toggleContent={() => onUpdate({ includeItemK: !state.includeItemK })}
      />

      <StaticItemSelector
        content={"RWY " + runway + " CHEMICALLY TREATED."}
        title="Runway chemical treatment"
        tooltip="Item L: Chemical treatment on the runway"
        linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=09%20LOOSE%20SAND%22-,Item%20L,-.%20Chemical%20treatment%20o"
        value={state.includeItemL}
        toggleContent={() => onUpdate({ includeItemL: !state.includeItemL })}
      />

      <CardContent>
        <InputHeadline title="Snow bank on runway" tooltip="Item M: Snow banks on the runway" linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=15L%20CHEMICALLY%20TREATED%22-,Item%20M,-.%20Snow%20banks%20on" />
        <div className="flex items-center gap-2">
          <Switch 
            checked={state.includeItemM}
            onClick={() => onUpdate({ includeItemM: !state.includeItemM })} 
          />
          <span>Include item</span>
        </div>
        {state.includeItemM && (
          <SnowBankOnRunwaySelector 
            runway={runway}
          />
        )}
      </CardContent>
    </div>
  );
}

function StaticItemSelector({
  content,
  title,
  tooltip, 
  linkToIcao,
  value,
  toggleContent
}: {
  content: string,
  title: string,
  tooltip: string,
  linkToIcao: string,
  value: boolean,
  toggleContent: () => void
}) {
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