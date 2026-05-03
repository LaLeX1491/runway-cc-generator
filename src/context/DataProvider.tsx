"use client";

import { createContext, ReactNode, useContext, useState, useMemo, useCallback } from "react";
import {
  Airport, ConditionCode, ContaminationLevel, LooseContaminationDepth,
  RunwayZone, RunwayZoneCondition, SituationalAwarenessData, ParsedOutput,
  RunwayItemsFormState, TaxiwaySnowbank, TaxiwayCondition, ApronCondition
} from '@/lib/types';
import { AIRPORTS } from '@/lib/data';
import { parseSituationalAwareness } from '@/lib/parser';

export type ConditionCodeContextType = {
  activeAirport: Airport | undefined;
  activeRunways: string[];
  runwayZoneConditions: RunwayZoneCondition[];
  situationalAwarenessData: SituationalAwarenessData;
  parsedOutput: ParsedOutput;

  setAirport: (icao: string) => void;
  changeRunways: (forward?: boolean) => void;
  setRunwayCondition: (
    runway: string,
    runwayZone: RunwayZone,
    runwayCondition: ConditionCode,
    contaminationLevel: ContaminationLevel,
    frictionLevel?: LooseContaminationDepth,
    applyWidth?: number,
  ) => void;
  getZoneConditionsByRunway: (rwy: string) => RunwayZoneCondition[];
  getZoneConditionsByRunwayAndZone: (rwy: string, rwyZone: RunwayZone) => RunwayZoneCondition | undefined;

  updateRunwayItems: (runway: string, updates: Partial<RunwayItemsFormState>) => void;
  setIncludeItemJ: (value: boolean) => void;
  setIncludeItemN: (value: boolean) => void;
  setItemN: (value: TaxiwaySnowbank[]) => void;
  setIncludeItemO: (value: boolean) => void;
  toggleItemO: (runway: string) => void;
  setIncludeItemP: (value: boolean) => void;
  setItemP: (value: TaxiwayCondition[]) => void;
  setItemPAllTaxiways: (value: ConditionCode | undefined) => void;
  setIncludeItemR: (value: boolean) => void;
  setItemR: (value: ApronCondition[]) => void;
  setItemRAllAprons: (value: ConditionCode | undefined) => void;
  setItemT: (value: string) => void;
};

const DataContextProvider = createContext<ConditionCodeContextType | undefined>(undefined);

function makeRunwayItemsState(): RunwayItemsFormState {
  return {
    includeItemI: false,
    includeItemJ: false,
    includeItemK: false,
    includeItemL: false,
    includeItemM: false,
  };
}

const DEFAULT_SA_DATA: SituationalAwarenessData = {
  runwayItems: {},
  includeItemJ: false,
  includeItemN: false,
  itemN: [],
  includeItemO: false,
  itemO: [],
  includeItemP: false,
  itemP: [],
  includeItemR: false,
  itemR: [],
  itemT: ""
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [activeAirport, setActiveAirport] = useState<Airport | undefined>(undefined);
  const [activeRunways, setActiveRunways] = useState<string[]>([]);
  const [runwayZoneConditions, setRunwayZoneConditions] = useState<RunwayZoneCondition[]>([]);
  const [situationalAwarenessData, setSituationalAwarenessData] = useState<SituationalAwarenessData>(DEFAULT_SA_DATA);

  const setAirport = useCallback((icao: string) => {
    const airport = AIRPORTS.find((i) => i.icao === icao);
    if (!airport) throw new Error("Airport not found!");

    const firstConfig = airport.configs[0];
    const newRunwayItems: Record<string, RunwayItemsFormState> = {};
    firstConfig.forEach(runway => {
      newRunwayItems[runway] = makeRunwayItemsState();
    });

    setActiveAirport(airport);
    setActiveRunways(firstConfig);
    setRunwayZoneConditions([]);
    setSituationalAwarenessData({
      ...DEFAULT_SA_DATA,
      runwayItems: newRunwayItems,
    });
  }, []);

  const changeRunways = useCallback((forward: boolean = true) => {
    setActiveAirport(prev => {
      if (!prev) throw new Error("Airport not found.");
      return prev;
    });

    // use functional update to access current state
    setActiveRunways(currentRunways => {
      const airport = AIRPORTS.find(a => a.configs.some(
        cfg => cfg.length === currentRunways.length && cfg.every((r, i) => r === currentRunways[i])
      ));
      if (!airport) return currentRunways;

      const configs = airport.configs;
      const currentIndex = configs.findIndex(
        cfg => cfg.length === currentRunways.length && cfg.every((rwy, i) => rwy === currentRunways[i])
      );
      if (currentIndex === -1) return currentRunways;

      const nextIndex = forward
        ? (currentIndex + 1) % configs.length
        : (currentIndex - 1 + configs.length) % configs.length;

      const newRunways = configs[nextIndex];

      setSituationalAwarenessData(prev => {
        const newRunwayItems: Record<string, RunwayItemsFormState> = {};
        newRunways.forEach(runway => {
          newRunwayItems[runway] = prev.runwayItems[runway] ?? makeRunwayItemsState();
        });
        return {
          ...prev,
          runwayItems: newRunwayItems,
          itemO: prev.itemO.filter(rwy => newRunways.includes(rwy))
        };
      });

      setRunwayZoneConditions(prev => prev.filter(c => newRunways.includes(c.runway)));

      return newRunways;
    });
  }, []);

  const setRunwayCondition = useCallback((
    runway: string,
    runwayZone: RunwayZone,
    runwayCondition: ConditionCode,
    contaminationLevel: ContaminationLevel,
    frictionLevel?: LooseContaminationDepth,
    applyWidth?: number,
  ) => {
    setRunwayZoneConditions(prev => [
      ...prev.filter(c => !(c.runway === runway && c.runwayZone === runwayZone)),
      { runway, runwayZone, runwayCondition, contaminationLevel, looseContaminationDepth: frictionLevel, applyWidth },
    ]);
  }, []);

  const getZoneConditionsByRunway = useCallback((rwy: string): RunwayZoneCondition[] => {
    return runwayZoneConditions.filter(c => c.runway === rwy);
  }, [runwayZoneConditions]);

  const getZoneConditionsByRunwayAndZone = useCallback((rwy: string, rwyZone: RunwayZone): RunwayZoneCondition | undefined => {
    return runwayZoneConditions.find(c => c.runway === rwy && c.runwayZone === rwyZone);
  }, [runwayZoneConditions]);

  const updateRunwayItems = useCallback((runway: string, updates: Partial<RunwayItemsFormState>) => {
    setSituationalAwarenessData(prev => ({
      ...prev,
      runwayItems: {
        ...prev.runwayItems,
        [runway]: { ...prev.runwayItems[runway], ...updates }
      }
    }));
  }, []);

  const setIncludeItemJ = useCallback((value: boolean) =>
    setSituationalAwarenessData(prev => ({ ...prev, includeItemJ: value })), []);

  const setIncludeItemN = useCallback((value: boolean) =>
    setSituationalAwarenessData(prev => ({ ...prev, includeItemN: value })), []);

  const setItemN = useCallback((value: TaxiwaySnowbank[]) =>
    setSituationalAwarenessData(prev => ({ ...prev, itemN: value })), []);

  const setIncludeItemO = useCallback((value: boolean) =>
    setSituationalAwarenessData(prev => ({ ...prev, includeItemO: value })), []);

  const toggleItemO = useCallback((runway: string) =>
    setSituationalAwarenessData(prev => ({
      ...prev,
      itemO: prev.itemO.includes(runway)
        ? prev.itemO.filter(r => r !== runway)
        : [...prev.itemO, runway]
    })), []);

  const setIncludeItemP = useCallback((value: boolean) =>
    setSituationalAwarenessData(prev => ({ ...prev, includeItemP: value })), []);

  const setItemP = useCallback((value: TaxiwayCondition[]) =>
    setSituationalAwarenessData(prev => ({ ...prev, itemP: value })), []);

  const setItemPAllTaxiways = useCallback((value: ConditionCode | undefined) =>
    setSituationalAwarenessData(prev => ({ ...prev, itemPAllTaxiways: value })), []);

  const setIncludeItemR = useCallback((value: boolean) =>
    setSituationalAwarenessData(prev => ({ ...prev, includeItemR: value })), []);

  const setItemR = useCallback((value: ApronCondition[]) =>
    setSituationalAwarenessData(prev => ({ ...prev, itemR: value })), []);

  const setItemRAllAprons = useCallback((value: ConditionCode | undefined) =>
    setSituationalAwarenessData(prev => ({ ...prev, itemRAllAprons: value })), []);

  const setItemT = useCallback((value: string) =>
    setSituationalAwarenessData(prev => ({ ...prev, itemT: value })), []);

  const parsedOutput = useMemo<ParsedOutput>(() => ({
    snowtam: "XX", // TODO
    atis: "XX",    // TODO
    situationalAwareness: parseSituationalAwareness(situationalAwarenessData)
  }), [situationalAwarenessData]);

  return (
    <DataContextProvider.Provider value={{
      activeAirport, activeRunways, runwayZoneConditions, situationalAwarenessData, parsedOutput,
      setAirport, changeRunways, setRunwayCondition, getZoneConditionsByRunway, getZoneConditionsByRunwayAndZone,
      updateRunwayItems, setIncludeItemJ, setIncludeItemN, setItemN, setIncludeItemO, toggleItemO,
      setIncludeItemP, setItemP, setItemPAllTaxiways, setIncludeItemR, setItemR, setItemRAllAprons, setItemT,
    }}>
      {children}
    </DataContextProvider.Provider>
  );
}

export function useData(): ConditionCodeContextType {
  const context = useContext(DataContextProvider);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
}