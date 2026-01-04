"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2 w-full", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        " text-slate-800 inline-flex h-10 w-fit items-center justify-center rounded-md",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Base styles
        "inline-flex flex-1 items-center justify-center gap-3 rounded-md border border-transparent px-3 py-2 text-base font-medium whitespace-nowrap transition-[color,box-shadow]  disabled:pointer-events-none disabled:opacity-50 h-full active:translate-y-0.5  duration-100 cursor-pointer",
        // Light mode styles
        "text-slate-800 data-[state=active]:bg-lime-200 data-[state=active]:outline-lime-50 data-[state=active]:outline-4",
        // Dark mode styles
        "dark:text-muted-foreground dark:data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30",
        // SVG styles
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-inherit",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
