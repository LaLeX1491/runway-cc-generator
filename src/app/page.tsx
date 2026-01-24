"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import options from "@/lib/options.json";
import { Options } from "@/lib/types";
import { useMemo, useState } from "react";
import Runway from '@/components/Runway';
import { Button } from '@/components/ui/button';
import { getOppositeRunway } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';

type ComboboxItemType = {
  value: string;
  label: string;
};

export default function Page() {
  const [airport, setAirport] = useState<string>("");
  const [runways, setRunways] = useState<string[]>([]);
  const [rotation, setRotation] = useState(0);

  const airports = (options satisfies Options).airports;

  const swapRunways = () => {
    const newRunways = runways.map(r => getOppositeRunway(r));
    setRunways(newRunways);
    setRotation(prev => prev + 360);
  };

  const items: ComboboxItemType[] = useMemo(
    () =>
      Object.keys(airports).map((icao) => ({
        value: icao,
        label: icao,
      })),
    [airports]
  );

  return (
    <main>
      {/* Airport selection */}
      <section className="flex justify-center">
        <div className="w-1/2">
          <Combobox
            items={items}
            value={airport}
            onValueChange={(value) => {
              if (value) {
                setAirport(value);
                setRunways(airports[value as keyof typeof airports]?.runways ?? []);
              }
            }}
          >
            <ComboboxInput placeholder="Select an airport." />
            <ComboboxContent>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item.value} value={item.value}>
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </section>

      {/* Runway display */}
      {airport &&
        <section className="mt-5">
          <div className="flex items-center p-3 justify-center">
            <h1 className="text-center">Selected runway direction:&nbsp;
              <Badge>
                {runways.map((runway, i) => (
                  <span key={i} className="font-bold">
                    {runway}
                    {i !== runways.length - 1 && (" / ")}
                  </span>
                ))}
              </Badge>
            </h1>

            <Button variant="ghost" className="cursor-pointer" size="icon-sm" onClick={swapRunways}>
              <RefreshCw
                className="transition-transform duration-500 ease-in-out"
                style={{ transform: `rotate(${rotation}deg)` }}
              />
            </Button>
          </div>

          <div className="flex flex-row items-center justify-center">
            <div className="flex flex-wrap justify-center gap-4 w-full min-xl:w-1/2 max-xl:px-5">
              {runways.map((rwy, i) => {
                return (
                  <div className="w-full relative" key={i}>
                    <Runway identifier={rwy} />
                    <div className="flex">
                      <div className="w-1/3 border-r border-black">
                        <h1 className="text-center font-bold">TDZ</h1>
                      </div>
                      <div className="w-1/3 border-r border-black">
                        <h1 className="text-center font-bold">MID</h1>
                      </div>
                      <div className="w-1/3">
                        <h1 className="text-center font-bold">END</h1>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      }
    </main>
  );
}
