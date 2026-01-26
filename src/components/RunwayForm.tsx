import Runway from '@/components/Runway';
import {useState} from 'react';
import {Checkbox} from '@/components/ui/checkbox';
import ConditionSelector from '@/components/ConditionSelector';
import {RunwayZone} from '@/lib/types';
import {Separator} from '@/components/ui/separator';
import {Switch} from '@/components/ui/switch';

export default function RunwayForm({rwy}: { rwy: string }) {
  const [equalContamination, setEqualContamination] = useState(false);

  const handleEqualToggle = () => {
    setEqualContamination(prev => !prev);
  };

  return (
    <div className="w-full relative">
      <Runway identifier={rwy} />

      {!equalContamination && (
        <div className="flex pb-1">
          {(["TDZ", "MID", "END"] as RunwayZone[]).map(section => (
            <div key={section} className={`w-1/3 ${section !== "END" ? "border-r border-black" : ""}`}>
              <h1 className="text-center font-extrabold text-2xl">{section}</h1>
              <ConditionSelector />
            </div>
          ))}
        </div>
      )}

      {equalContamination && (
        <div className="flex flex-col w-full pb-1">
          <h1 className="text-center font-extrabold text-2xl">RWY {rwy}</h1>
          <ConditionSelector equalContamination={true} />
        </div>
      )}

      <div className="flex items-center justify-center gap-2 pt-1 border-t-black border-t" onClick={handleEqualToggle}>
        <Switch checked={equalContamination} />
        <label>Equal runway contamination</label>
      </div>
    </div>
  )
}