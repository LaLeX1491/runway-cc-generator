"use client";

import React from "react";

interface RunwayFormProps {
  index: number;
  form: any;
  runways: string[];
  contaminants: any;
  sortedCodes: string[];
  updateForm: (idx: number, update: any) => void;
  handleSegmentCodeChange: (idx: number, segment: "tdz"|"mid"|"end", code: string) => void;
}

const contaminationPerc = ["25%", "50%", "75%", "100%"];

export default function RunwayForm({
  index, form, runways, contaminants, sortedCodes, updateForm, handleSegmentCodeChange
}: RunwayFormProps) {

  const showCreateButton = form.runway && (
    (form.equalContamination && form.runwayCondition && (form.runwayCondition==="6" || form.contaminant) &&
     (form.equalCoverage ? form.equalPercent : true))
    ||
    (!form.equalContamination &&
     form.tdzCode && form.midCode && form.endCode &&
     (form.tdzCode==="6" || form.tdzContaminant) &&
     (form.midCode==="6" || form.midContaminant) &&
     (form.endCode==="6" || form.endContaminant) &&
     form.tdzPercent && form.midPercent && form.endPercent
    )
  );

  return (
    <div className={`border p-4 rounded-lg ${form.equalContamination ? "bg-blue-50" : "bg-yellow-50"} shadow-sm`}>
      
      {/* Runway */}
      {runways.length>0 && (
        <div className="flex flex-col gap-1">
          <label className="font-medium">Runway</label>
          <select
            className="border rounded p-2"
            value={form.runway}
            onChange={(e) => updateForm(index, { runway: e.target.value })}
          >
            <option value="" disabled>- Select Runway -</option>
            {runways.map(rw => <option key={rw} value={rw}>{rw}</option>)}
          </select>
        </div>
      )}

      {/* Equal contamination toggle */}
      {form.runway && (
        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={form.equalContamination}
            onChange={() => updateForm(index, { equalContamination: !form.equalContamination })}
          />
          Equal Contamination for Entire Runway
        </label>
      )}

      {/* Equal contamination block */}
      {form.runway && form.equalContamination && (
        <div className="flex flex-col gap-2 mt-2 p-2 border rounded bg-white">
          {/* Runway Condition */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">Runway Condition</label>
            <select
              className="border rounded p-2"
              value={form.runwayCondition}
              onChange={(e) => {
                const val = e.target.value;
                updateForm(index, { runwayCondition: val, contaminant: val==="6"?"Dry":"", equalPercent: "" });
              }}
            >
              <option value="" disabled>- Select Condition Code -</option>
              {sortedCodes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Contaminant */}
          {form.runwayCondition && (
            <div className="flex flex-col gap-1">
              <label className="font-medium">Contaminant</label>
              <select
                className="border rounded p-2"
                value={form.contaminant}
                onChange={e => updateForm(index, { contaminant: e.target.value, equalPercent: "" })}
              >
                <option value="" disabled>- Select Contaminant -</option>
                {form.runwayCondition==="6" ? ["Dry"].map(d=> <option key={d} value={d}>{d}</option>) :
                  contaminants[form.runwayCondition]?.map((c:any)=> <option key={c} value={c}>{c}</option>)
                }
              </select>
            </div>
          )}

          {/* Equal coverage */}
          {form.runwayCondition && form.contaminant && form.runwayCondition!=="6" && (
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={form.equalCoverage}
                onChange={() => updateForm(index, { equalCoverage: !form.equalCoverage })}
              />
              Equal Coverage
            </label>
          )}

          {/* Percentage if equalCoverage */}
          {form.equalCoverage && form.contaminant && form.runwayCondition!=="6" && (
            <div className="flex flex-col gap-1 mt-1">
              <label className="font-medium">Coverage Percentage</label>
              <select
                className="border rounded p-2"
                value={form.equalPercent}
                onChange={e => updateForm(index, { equalPercent: e.target.value })}
              >
                <option value="" disabled>- Select Percentage -</option>
                {contaminationPerc.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Non-equal contamination */}
      {form.runway && !form.equalContamination && (
        <div className="flex flex-col gap-3 mt-2 p-2 border rounded bg-white">
          {["tdz","mid","end"].map(seg => (
            <Segment
              key={seg} label={seg.toUpperCase()} form={form} idx={index} segment={seg as "tdz"|"mid"|"end"}
              contaminants={contaminants} sortedCodes={sortedCodes} handleSegmentCodeChange={handleSegmentCodeChange} updateForm={updateForm}
            />
          ))}
        </div>
      )}

      {/* Conditional Create Button */}
      {showCreateButton && (
        <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded mt-2 w-full">
          Create Runway CC
        </button>
      )}
    </div>
  );
}

/* Segment Component */
interface SegmentProps {
  label: string;
  form: any;
  idx: number;
  segment: "tdz"|"mid"|"end";
  contaminants: any;
  sortedCodes: string[];
  handleSegmentCodeChange: any;
  updateForm: any;
}

function Segment({label, form, idx, segment, contaminants, sortedCodes, handleSegmentCodeChange, updateForm}: SegmentProps) {
  const code = form[segment+"Code"];
  const cont = form[segment+"Contaminant"];
  const perc = form[segment+"Percent"];

  const showCont = code && code!=="6";
  const showPerc = showCont && cont;

  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium">{label}</label>
      <select className="border rounded p-2" value={code} onChange={e=>handleSegmentCodeChange(idx, segment, e.target.value)}>
        <option value="" disabled>- Select Condition Code -</option>
        {sortedCodes.map(c=> <option key={c} value={c}>{c}</option>)}
      </select>

      {showCont && (
        <select className="border rounded p-2" value={cont} onChange={e=>updateForm(idx, {[segment+"Contaminant"]: e.target.value})}>
          <option value="" disabled>- Select Contaminant -</option>
          {contaminants[code]?.map((c:any)=> <option key={c} value={c}>{c}</option>)}
        </select>
      )}

      {showPerc && (
        <select className="border rounded p-2" value={perc} onChange={e=>updateForm(idx, {[segment+"Percent"]: e.target.value})}>
          <option value="" disabled>- Select Coverage -</option>
          {contaminationPerc.map(p=> <option key={p} value={p}>{p}</option>)}
        </select>
      )}
    </div>
  );
}
