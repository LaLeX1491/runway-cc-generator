import InputHeadline from '@/components/ui/InputHeadline';
import { Input } from '@/components/ui/input';
import Code from '@/components/ui/code';
import SnowBankOnRunwaySelector from '@/components/forms/SnowBankSelectors';
import { RunwayItemsFormState } from '@/lib/types';
import SwitchField from '@/components/ui/SwitchField';
import FadeIn from '@/components/ui/FadeIn';
import StaticItemSelector from '@/components/ui/StaticItemSelector';

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
    <div className="flex-col flex gap-2 mb-2">
      <div>
        <InputHeadline
          title="Reduced runway length"
          tooltip="Item I: Used if the runway has to be reduced due to contamination."
          linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=left%20out%20completely.-,Item%20I,-.%20Reduced%20runway%20length"
        />
        <SwitchField
          checked={state.includeItemI}
          onClick={() => onUpdate({ includeItemI: !state.includeItemI })}
          label="Include item"
        />
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
            <FadeIn shown={!!state.itemI}>
              <Code className="mt-2" text={`RWY ${runway} REDUCED TO ${state.itemI} METERS.`} />
            </FadeIn>
          </div>
        )}
      </div>

      <StaticItemSelector
        content={"RWY " + runway + " DRIFTING SNOW."}
        title="Drifting snow on the runway"
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

      <div>
        <InputHeadline
          title="Snow bank on runway"
          tooltip="Item M: Snow banks on the runway"
          linkToIcao="https://skybrary.aero/articles/snowtam#:~:text=15L%20CHEMICALLY%20TREATED%22-,Item%20M,-.%20Snow%20banks%20on"
        />
        <SwitchField
          checked={state.includeItemM}
          onClick={() => onUpdate({ includeItemM: !state.includeItemM })}
          label="Include item"
        />
        {state.includeItemM && (
          <SnowBankOnRunwaySelector
            runway={runway}
          />
        )}
      </div>
    </div>
  );
}