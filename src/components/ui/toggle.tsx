"use client";

import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  [
    // Base layout and typography
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap",
    // Default states
    "hover:bg-muted hover:text-muted-foreground",
    // Disabled state
    "disabled:pointer-events-none disabled:opacity-50",
    // Active/on state
    "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=off]:bg-slate-100 data-[state=off]:text-slate-500",
    // Focus and accessibility
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none",
    // Invalid state - light mode
    "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
    // Invalid state - dark mode
    "dark:aria-invalid:ring-destructive/40",
    // Transitions
    "transition-[color,box-shadow]",
    // SVG styling
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: [
          // Default variant - transparent background
          "bg-transparent",
        ],
        outline: [
          // Outline variant - base styles
          "border border-input bg-transparent shadow-xs",
          // Outline variant - hover states
          "hover:bg-accent hover:text-accent-foreground",
        ],
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
