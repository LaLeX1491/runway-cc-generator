"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import {Airport, ConditionCode, ContaminationLevel, LooseContaminationDepth, RunwayZone, RunwayZoneCondition} from '@/lib/types';
import {AIRPORTS} from '@/lib/data';

export type ConditionCodeContextType = {
  activeAirport: Airport | undefined;
  activeRunways: string[] | undefined;

  getZoneConditionsByRunway: (rwy: string) => RunwayZoneCondition[];
  getZoneConditionsByRunwayAndZone: (rwy: string, rwyZone: RunwayZone) => RunwayZoneCondition | undefined;
  setAirport: (icao: string) => void;
  setRunwayCondition: (
    runway: string,
    runwayZone: RunwayZone,
    runwayCondition: ConditionCode,
    contaminationLevel: ContaminationLevel,
    contaminationDescription: string,
    frictionLevel?: LooseContaminationDepth,
    applyWidth?: number,
  ) => void;
  changeRunways: (forward?: boolean) => void;
};

const ConditionCodeContext =
  createContext<ConditionCodeContextType | undefined>(undefined);

export function ConditionCodeProvider({ children }: { children: ReactNode }) {
  const [activeAirport, setActiveAirport] = useState<Airport | undefined>(undefined);
  const [activeRunways, setActiveRunways] = useState<string[]>([]);
  const [runwayZoneConditions, setRunwayZoneConditions] = useState<RunwayZoneCondition[]>([])

  /**
   * Set airport
   * @param icao Airport ICAO
   */
  const setAirport = (icao: string) => {
    const airport = AIRPORTS.find((i) => i.icao === icao);
    if(airport) {
      setActiveAirport(airport);
      setActiveRunways(airport.configs[0]);
    } else throw new Error("Airport not found!");
  }

  /**
   * Changes the runway config
   * @param forward forward = next config / !forward = previous config
   */
  const changeRunways = (forward?: boolean) => {
    if (!activeAirport || !activeRunways) throw new Error("Airport not found.");

    const configs = activeAirport.configs;
    const currentIndex = configs.findIndex(
      cfg =>
        cfg.length === activeRunways.length &&
        cfg.every((rwy, i) => rwy === activeRunways[i])
    );
    if (currentIndex === -1) return;

    if(!forward) forward = true;
    const nextIndex = forward
      ? (currentIndex + 1) % configs.length
      : (currentIndex - 1 + configs.length) % configs.length;
    setActiveRunways(configs[nextIndex]);
  };

  /**
   * Sets the runway condition for a certain runway & part of the runway
   * @param runway runway
   * @param runwayZone zone (TDZ / MID / END)
   * @param runwayCondition conditionCode 0-6
   * @param contaminationLevel level
   * @param frictionLevel
   * @param contaminationDescription
   * @param applyWidth
   */
  const setRunwayCondition = (
    runway: string,
    runwayZone: RunwayZone,
    runwayCondition: ConditionCode,
    contaminationLevel: ContaminationLevel,
    contaminationDescription: string,
    frictionLevel?: LooseContaminationDepth,
    applyWidth?: number,
  ) => {
    setRunwayZoneConditions(prev => [
      ...prev.filter(
        c => !(c.runway === runway && c.runwayZone === runwayZone)
      ),
      {
        runway,
        runwayZone,
        runwayCondition,
        contaminationLevel,
        contaminationType: contaminationDescription,
        looseContaminationDepth: frictionLevel,
        applyWidth,
      },
    ]);
  }

  const getZoneConditionsByRunway = (rwy: string): RunwayZoneCondition[] => {
    return runwayZoneConditions.filter(c => c.runway === rwy);
  };

  const getZoneConditionsByRunwayAndZone = (rwy: string, rwyZone: RunwayZone): RunwayZoneCondition | undefined => {
    return runwayZoneConditions.find(c => c.runway === rwy && c.runwayZone === rwyZone);
  }

  return (
    <ConditionCodeContext.Provider
      value={{
        activeAirport,
        activeRunways,
        getZoneConditionsByRunway,
        getZoneConditionsByRunwayAndZone,
        setAirport,
        setRunwayCondition,
        changeRunways
      }}
    >
      {children}
    </ConditionCodeContext.Provider>
  );
}

export function useConditionCode(): ConditionCodeContextType {
  const context = useContext(ConditionCodeContext);

  if (!context) {
    throw new Error(
      "useConditionCode must be used within a ConditionCodeProvider"
    );
  }

  return context;
}
