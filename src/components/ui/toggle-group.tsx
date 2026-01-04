'use client';

import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { toggleVariants } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: 'default',
  variant: 'default',
});

function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn(
        // Base layout
        'group/toggle-group flex w-fit items-center rounded-md',
        // Outline variant shadow
        'data-[variant=outline]:shadow-xs',

        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      className={cn(
        // Base toggle variants
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        // Group item specific layout
        'min-w-0 flex-1 shrink-0 rounded-none shadow-none active:scale-95 duration-100 cursor-pointer',
        // Border radius for first and last items
        'first:rounded-l-md last:rounded-r-md',
        // Focus z-index management
        'focus:z-10 focus-visible:z-10',
        // Outline variant border handling
        'data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l',
        // Custom padding for group items
        'py-2.5 px-4',

        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

type SortDirection = 'asc' | 'desc' | undefined;

interface CyclingSortContextValue {
  activeSort: string | null;
  setActiveSort: (key: string | null) => void;
  variant?: VariantProps<typeof toggleVariants>['variant'];
  size?: VariantProps<typeof toggleVariants>['size'];
}

const CyclingSortContext = React.createContext<CyclingSortContextValue>({
  activeSort: null,
  setActiveSort: () => {},
});

interface CyclingSortGroupProps {
  className?: string;
  variant?: VariantProps<typeof toggleVariants>['variant'];
  size?: VariantProps<typeof toggleVariants>['size'];
  children: React.ReactNode;
}

function CyclingSortGroup({
  className,
  variant = 'outline',
  size = 'lg',
  children,
}: CyclingSortGroupProps) {
  const [activeSort, setActiveSort] = React.useState<string | null>(null);

  return (
    <CyclingSortContext.Provider
      value={{ activeSort, setActiveSort, variant, size }}
    >
      <div className={cn('flex w-fit rounded-md', className)}>{children}</div>
    </CyclingSortContext.Provider>
  );
}

interface CyclingSortButtonProps {
  label: string;
  sortKey: string; // Unique identifier for this sort (e.g., "priceSort", "dateSort")
  value: SortDirection;
  onChange: (value: SortDirection) => void;
  className?: string;
}

function CyclingSortButton({
  label,
  sortKey,
  value,
  onChange,
  className,
}: CyclingSortButtonProps) {
  const context = React.useContext(CyclingSortContext);

  const cycleSortDirection = (current: SortDirection): SortDirection => {
    if (current === undefined) return 'asc';
    if (current === 'asc') return 'desc';
    return undefined;
  };

  const handleClick = () => {
    const nextValue = cycleSortDirection(value);

    // Update which sort is active
    if (nextValue === undefined) {
      context.setActiveSort(null);
    } else {
      context.setActiveSort(sortKey);
    }

    onChange(nextValue);
  };

  const isActive = value !== undefined;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        // Base toggle variants
        toggleVariants({
          variant: context.variant,
          size: context.size,
        }),
        // Group item specific layout
        'min-w-0 flex-1 shrink-0 rounded-none shadow-none active:scale-95 duration-100 cursor-pointer',
        // Border radius for first and last items
        'first:rounded-l-md last:rounded-r-md',
        // Focus z-index management
        'focus:z-10 focus-visible:z-10',
        // Outline variant border handling
        context.variant === 'outline' && 'border-l-0 first:border-l',
        // Custom padding
        'py-2.5 px-4',
        className
      )}
      data-state={isActive ? 'on' : 'off'}
      aria-pressed={isActive}
    >
      {value === 'desc' ? (
        <ArrowDown size={20} strokeWidth={2} />
      ) : (
        <ArrowUp
          size={20}
          strokeWidth={2}
          className={!isActive ? 'opacity-40' : ''}
        />
      )}
      {label}
    </button>
  );
}

export { ToggleGroup, ToggleGroupItem, CyclingSortGroup, CyclingSortButton };
