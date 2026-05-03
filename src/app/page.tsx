"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {useState} from "react";
import {CheckIcon, CopyIcon, RefreshCw} from "lucide-react";
import { AIRPORTS } from "@/lib/data";
import {clsx} from 'clsx';
import {useData} from '@/context/DataProvider';
import {AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogTrigger} from '@/components/ui/alert-dialog';
import RunwayForm from '@/components/forms/RunwayForm';
import {Badge} from '@/components/ui/badge';
import ccTableImage from "../../public/cc-table.png";
import Image from 'next/image';
import {Button} from '@/components/ui/button';
import {SeparatorWithLabel} from '@/components/ui/separator';
import SituationalAwarenessSection from '@/components/SituationalAwarenessSection';

export default function Page() {
  const [rotation] = useState(0);
  const [copied, setCopied] = useState<boolean>(false);

  const { setAirport, activeAirport, activeRunways, changeRunways, parsedOutput } = useData();

  const copyToClipboard = (text: string) => {
    setCopied(true);
    navigator.clipboard.writeText(text);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  const airportItems = AIRPORTS.map(a => ({ value: a.icao, label: a.icao }));

  return (
    <main className="pb-5">
      <section className="flex items-center flex-col mb-5">
        <h1 className="block">Output</h1>
        <div className="w-1/2">
          <span className="block mb-1 text-foreground font-bold">SNOWTAM</span>
          <div className="flex justify-between rounded-md bg-gray-200 w-full p-2">
            <code className="block">{parsedOutput.snowtam}</code>
            <div className="relative flex items-center gap-2">
              <CopyIcon
                onClick={() => copyToClipboard(parsedOutput.snowtam)}
                className={clsx(
                  "cursor-pointer transition-all duration-200",
                  copied
                    ? "opacity-0 scale-75 pointer-events-none"
                    : "opacity-100 scale-100"
                )}
              />

              <CheckIcon
                className={clsx(
                  "absolute transition-all duration-200 pointer-events-none",
                  copied
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-75"
                )}
              />
            </div>
          </div>
        </div>
        <div className="w-1/2">
          <span className="block mb-1 text-foreground font-bold">ATIS-REMARK</span>
          <div className="flex justify-between rounded-md bg-gray-200 w-full p-2">
            <code className="block">{parsedOutput.atis}</code>
            <div className="relative flex items-center gap-2">
              <CopyIcon
                onClick={() => copyToClipboard(parsedOutput.atis)}
                className={clsx(
                  "cursor-pointer transition-all duration-200",
                  copied
                    ? "opacity-0 scale-75 pointer-events-none"
                    : "opacity-100 scale-100"
                )}
              />

              <CheckIcon
                className={clsx(
                  "absolute transition-all duration-200 pointer-events-none",
                  copied
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-75"
                )}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="flex justify-center">
        <div className="w-1/2">
          <Combobox
            items={airportItems}
            value={activeAirport?.icao || ""}
            onValueChange={(value) => {
              if(!value) return;
              setAirport(value);
            }}
          >
            <ComboboxInput placeholder="Select airport here" />
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

      {activeAirport && activeRunways && activeRunways.length > 0 && (<>
        <section className="mt-5">
          <SeparatorWithLabel title="Airplane performance calculation section" />
          <div className="flex items-center justify-center gap-2">
            <h1>
              Selected runway direction:&nbsp;
              <Badge>{activeRunways.join(" / ")}</Badge>
            </h1>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => changeRunways()}
              className="cursor-pointer"
            >
              <RefreshCw
                className="transition-transform duration-500"
                style={{ transform: `rotate(${rotation}deg)` }}
              />
            </Button>
          </div>

          <div className="flex items-center my-3 justify-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Open decision-making helpsheet</Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="max-w-none! max-h-none! w-fit p-4">
                <div className="relative min-w-[40vw] h-[90vh]">
                  <Image
                    src={ccTableImage}
                    alt="Condition code decision making helpsheet"
                    className="object-contain"
                    fill
                    priority
                  />
                </div>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="flex justify-center">
            <div className="flex flex-wrap gap-4 w-full xl:w-1/2 max-xl:px-5">
              {activeRunways!.map((rwy: any) => (
                <RunwayForm key={rwy} rwy={rwy} />
              ))}
            </div>
          </div>
        </section>

        <section>
          <SeparatorWithLabel title="Situational awareness section" />
          <SituationalAwarenessSection />
        </section>
      </>)}
    </main>
  );
}