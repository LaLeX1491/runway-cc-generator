"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

function SeparatorWithLabel({title, className = ""}: {title: string, className?: string}) {
  return (
    <div className={cn("relative flex items-center my-4", className)}>
      <Separator className="flex-1" />
      <span className="mx-3 text-xs text-muted-foreground whitespace-nowrap">
        {title}
      </span>
      <Separator className="flex-1" />
    </div>
  )
}

export { Separator, SeparatorWithLabel }
