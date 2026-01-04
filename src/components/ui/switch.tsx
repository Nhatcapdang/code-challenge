import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Label } from '@radix-ui/react-label';

const switchVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-4 w-7',
        md: 'h-5 w-9',
        lg: 'h-6 w-11',
      },
      color: {
        primary:
          'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
        success:
          'data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-input',
        warning:
          'data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-input',
        danger:
          'data-[state=checked]:bg-red-500 data-[state=unchecked]:bg-input',
      },
    },
    defaultVariants: {
      size: 'md',
      color: 'primary',
    },
  },
);

const thumbVariants = cva(
  'pointer-events-none flex h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 items-center justify-center',
  {
    variants: {
      size: {
        sm: 'h-3 w-3 data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0',
        md: 'h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
        lg: 'h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const labelVariants = cva('text-sm font-medium', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
    disabled: {
      true: 'text-muted-foreground',
      false: 'text-foreground',
    },
  },
  defaultVariants: {
    size: 'md',
    disabled: false,
  },
});

export interface SwitchProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
      'color'
    >,
    VariantProps<typeof switchVariants> {
  /**
   * Label text or React node to display next to the switch
   */
  label?: string | React.ReactNode;
  /**
   * Position of the label relative to the switch
   */
  labelPosition?: 'left' | 'right';
  /**
   * Custom className for the thumb element
   */
  thumbClassName?: string;
  /**
   * Custom className for the label element
   */
  labelClassName?: string;
  /**
   * Whether the switch is disabled
   */
  disabled?: boolean;
  /**
   * Custom ID for the switch (auto-generated if not provided)
   */
  id?: string;
  /**
   * Icon to display inside the switch
   */
  icon?: React.ReactNode;
  /**
   * Description to display below the switch
   */
  description?: string;
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(
  (
    {
      className,
      thumbClassName,
      labelClassName,
      label,
      labelPosition = 'right',
      size,
      color,
      disabled,
      id,
      icon,
      description,
      ...props
    },
    ref,
  ) => {
    const switchId = React.useId();
    const finalId = id || switchId;

    const switchElement = (
      <SwitchPrimitive.Root
        className={cn(switchVariants({ size, color }), className)}
        {...props}
        ref={ref}
        id={finalId}
        disabled={disabled}
      >
        <SwitchPrimitive.Thumb
          className={cn(thumbVariants({ size }), thumbClassName)}
        >
          {icon ? icon : null}
        </SwitchPrimitive.Thumb>
      </SwitchPrimitive.Root>
    );

    const labelElement = label && (
      <Label
        htmlFor={finalId}
        className={cn(labelVariants({ size, disabled }), labelClassName)}
      >
        {label}
      </Label>
    );

    const descriptionElement = description && (
      <p
        className={cn(
          'text-xs text-muted-foreground ',
          disabled && 'opacity-50',
        )}
      >
        {description}
      </p>
    );

    return (
      <div className="flex flex-col gap-1">
        <div className={cn('flex items-center gap-2')}>
          {labelPosition === 'left' && labelElement}
          {switchElement}
          {labelPosition === 'right' && labelElement}
        </div>
        {descriptionElement}
      </div>
    );
  },
);

Switch.displayName = 'Switch';

export { Switch, switchVariants, thumbVariants, labelVariants };
export default Switch;
