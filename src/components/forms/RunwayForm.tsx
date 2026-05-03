import Runway from '@/components/ui/Runway';
import {useState} from 'react';
import AirplanePerformanceSection from '@/components/AirplanePerformanceSection';
import {RunwayZone} from '@/lib/types';
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
              <AirplanePerformanceSection runwayZone={section} runway={rwy} />
            </div>
          ))}
        </div>
      )}

      {equalContamination && (
        <div className="flex justify-center pb-1">
          <div>
            <h1 className="text-center font-extrabold text-2xl">RWY {rwy}</h1>
            <AirplanePerformanceSection runway={rwy} runwayZone="ALL" />
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 pt-1 border-t-black border-t" onClick={handleEqualToggle}>
        <Switch checked={equalContamination} />
        <label>Equal runway contamination</label>
      </div>
    </div>
  )
}