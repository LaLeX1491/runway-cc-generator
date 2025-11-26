"use client";

import React, { useState } from "react";
import options from "./options.json";
import RunwayForm from "../components/runway-cc/RunwayForm";

export default function Page() {
  const data = options as any;

  const [airport, setAirport] = useState("");
  const [runwaysForAirport, setRunwaysForAirport] = useState<string[]>([]);
  const [forms, setForms] = useState([createEmptyRunwayForm()]);

  function createEmptyRunwayForm() {
    return {
      runway: "",
      equalContamination: true,
      runwayCondition: "",
      contaminant: "",
      equalCoverage: true,
      equalPercent: "",
      tdzCode: "", tdzContaminant: "", tdzPercent: "",
      midCode: "", midContaminant: "", midPercent: "",
      endCode: "", endContaminant: "", endPercent: ""
    };
  }

  const sortedCodes = Object.keys(data.contaminants).sort((a,b) => Number(b) - Number(a));

  const updateForm = (idx: number, update: any) => {
    setForms(prev => prev.map((f,i) => i===idx ? {...f, ...update} : f));
  };

  const handleSegmentCodeChange = (idx: number, seg: "tdz"|"mid"|"end", code: string) => {
    const keys = { tdz:"tdz", mid:"mid", end:"end"};
    const codeKey = keys[seg]+"Code";
    const contKey = keys[seg]+"Contaminant";
    const percKey = keys[seg]+"Percent";

    updateForm(idx, {[codeKey]: code, [contKey]: code==="6"?"Dry":"", [percKey]: ""});
  };

  const isFormComplete = (f: any) => {
    if (!f.runway) return false;
    if (f.equalContamination) {
      if (!f.runwayCondition) return false;
      if (f.runwayCondition!=="6" && !f.contaminant) return false;
      if (f.runwayCondition!=="6" && f.equalCoverage && !f.equalPercent) return false;
    } else {
      for (const seg of ["tdz","mid","end"]) {
        const code = f[seg+"Code"];
        const cont = f[seg+"Contaminant"];
        const perc = f[seg+"Percent"];
        if (!code) return false;
        if (code!=="6" && !cont) return false;
        if (code!=="6" && !perc) return false;
      }
    }
    return true;
  };

  const canAddAnother = forms.every(isFormComplete);

  const addAnother = () => setForms(prev => [...prev, createEmptyRunwayForm()]);

  const handleAirportChange = (icao: string) => {
    setAirport(icao);
    const ap = data.airports.find((a:any)=>a.icao===icao);
    setRunwaysForAirport(ap?.runways || []);
    setForms([createEmptyRunwayForm()]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center gap-6 p-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-center">VATSIM Runway Condition Generator</h1>

      <div className="w-full max-w-6xl flex flex-col gap-6">

        {/* Airport selection */}
        <div className="flex flex-col gap-2">
          <label className="font-medium">Airport</label>
          <select
            className="border rounded p-2"
            value={airport}
            onChange={e => handleAirportChange(e.target.value)}
          >
            <option value="" disabled>- Select Airport -</option>
            {data.airports.map((a:any)=>
              <option key={a.icao} value={a.icao}>{a.icao}</option>
            )}
          </select>
        </div>

        {/* Responsive Grid for Runway Forms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((f,idx)=>
            <RunwayForm
              key={idx} index={idx} form={f} runways={runwaysForAirport}
              contaminants={data.contaminants} sortedCodes={sortedCodes}
              updateForm={updateForm} handleSegmentCodeChange={handleSegmentCodeChange}
            />
          )}
        </div>

        {/* Add Another Runway Button */}
        {airport && runwaysForAirport.length>0 && canAddAnother && (
          <button
            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded self-start"
            onClick={addAnother}
          >
            Add Another Runway
          </button>
        )}

        {/* Final Create Button */}
        {forms.every(isFormComplete) && forms.length>0 && (
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded mt-4 self-start">
            Create Runway CC
          </button>
        )}

      </div>
    </div>
  );
}
