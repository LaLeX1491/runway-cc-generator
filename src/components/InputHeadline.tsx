import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {InfoIcon} from 'lucide-react';

export default function InputHeadline({title, tooltip, linkToIcao}: {title: string; tooltip: string, linkToIcao: string}) {
  return (
    <label className="flex w-full justify-between italic">
      <span className="text-xs">{title}</span>
      <Tooltip>
        <TooltipTrigger>
          <InfoIcon className="p-0.5 text-blue-700" size={17}/>
        </TooltipTrigger>
        <TooltipContent className="pb-2">
          <p>{tooltip}</p>
          <a href={linkToIcao} className="hover:underline w-full" target="_blank">More information</a>
        </TooltipContent>
      </Tooltip>
    </label>
  )
}