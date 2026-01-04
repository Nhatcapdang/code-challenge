import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';

import { cn } from '@/lib/utils';

/**
 * Label component props extending Radix UI Label
 */
export interface LabelProps
  extends React.ComponentProps<typeof LabelPrimitive.Root> {
  /** Whether to display a required indicator (asterisk) */
  required?: boolean;
}

/**
 * Label component with optional required indicator
 *
 * @example
 * ```tsx
 * <Label htmlFor="email">Email</Label>
 * ```
 *
 * @example
 * With required indicator:
 * ```tsx
 * <Label htmlFor="email" required>Email</Label>
 * ```
 */
function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="text-destructive" aria-label="required">
          *
        </span>
      )}
    </LabelPrimitive.Root>
  );
}

export { Label };
