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

type ComboboxItemType = {
  value: string;
  label: string;
};

export default function Page() {
  const [airport, setAirport] = useState<string>("");

  const data = (options satisfies Options).airports;

  const items: ComboboxItemType[] = useMemo(
    () =>
      Object.keys(data).map((icao) => ({
        value: icao,
        label: icao,
      })),
    [data]
  );

  return (
    <main>
      <section className="flex justify-center">
        <div className="w-1/2">
          <Combobox
            items={items}
            value={airport}
            onValueChange={(value) => {
              if (value) {
                setAirport(value);
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
    </main>
  );
}