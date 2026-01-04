import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const buttonGroupVariants = cva(
  [
    // Base layout styles
    "flex w-fit items-stretch",
    // Focus management
    "[&>*]:focus-visible:z-10 [&>*]:focus-visible:relative",
    // Select trigger sizing
    "[&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit",
    // Input flex behavior
    "[&>input]:flex-1",
    // Nested button group gap
    "has-[>[data-slot=button-group]]:gap-2",
    // Select trigger border radius adjustment
    "has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md border border-slate-200 rounded-md",
  ],
  {
    variants: {
      orientation: {
        horizontal: [
          // Horizontal orientation - remove left borders and radius
          "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0",
          // Remove right radius for non-last children
          "[&>*:not(:last-child)]:rounded-r-none",
        ],
        vertical: [
          // Vertical orientation
          "flex-col",
          // Remove top borders and radius
          "[&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0",
          // Remove bottom radius for non-last children
          "[&>*:not(:last-child)]:rounded-b-none",
        ],
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  );
}

function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      className={cn(
        // Base layout and spacing
        "flex items-center gap-2 rounded-md border px-4",
        // Typography
        "text-sm font-medium",
        // Background and shadow
        "bg-muted shadow-xs",
        // SVG styling
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        // Base positioning and sizing
        "relative !m-0 self-stretch",
        // Background
        "bg-input",
        // Orientation-specific height
        "data-[orientation=vertical]:h-auto",
        className
      )}
      {...props}
    />
  );
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
};
