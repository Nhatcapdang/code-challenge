'use client';

import React, { ElementType, memo } from 'react';
import { motion, MotionProps, useInView, Variants } from 'motion/react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export type RevealEffect =
  | 'fade'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'zoom'
  | 'zoomIn'
  | 'zoomOut'
  | 'blur'
  | 'blurUp'
  | 'blurDown';

// CVA variants for styling based on effect type
// This allows for future extension with effect-specific visual styles
const revealVariants = cva('will-change-transform', {
  variants: {
    effect: {
      fade: 'will-change-opacity',
      slideUp: 'will-change-transform,opacity',
      slideDown: 'will-change-transform,opacity',
      slideLeft: 'will-change-transform,opacity',
      slideRight: 'will-change-transform,opacity',
      zoom: 'will-change-transform,opacity',
      zoomIn: 'will-change-transform,opacity',
      zoomOut: 'will-change-transform,opacity',
      blur: 'will-change-filter,opacity',
      blurUp: 'will-change-transform,filter,opacity',
      blurDown: 'will-change-transform,filter,opacity',
    },
  },
  defaultVariants: {
    effect: 'fade',
  },
});

export interface RevealOnScrollProps
  extends Omit<MotionProps, 'initial' | 'animate'>,
    VariantProps<typeof revealVariants> {
  /**
   * The content to reveal
   */
  children: React.ReactNode;
  /**
   * The animation effect to use
   * @default 'fade'
   */
  effect?: RevealEffect;
  /**
   * The delay before animation starts (in seconds)
   * @default 0
   */
  delay?: number;
  /**
   * The duration of the animation (in seconds)
   * @default 0.5
   */
  duration?: number;
  /**
   * The distance to slide/zoom from (in pixels or percentage)
   * @default 30
   */
  distance?: number;
  /**
   * The blur amount (in pixels)
   * @default 10
   */
  blurAmount?: number;
  /**
   * The scale amount for zoom effects
   * @default 0.8
   */
  scale?: number;
  /**
   * The element type to render
   * @default 'div'
   */
  as?: ElementType;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Whether to animate only once
   * @default true
   */
  once?: boolean;
  /**
   * The amount of element that needs to be visible (0-1)
   * @default 0.2
   */
  amount?: number;
  /**
   * Margin around the viewport (in pixels or percentage)
   * @default '0px'
   */
  margin?: string | number;
  /**
   * Custom animation variants (overrides effect)
   */
  variants?: Variants;
  /**
   * Custom initial state
   */
  initial?: Variants['initial'];
  /**
   * Custom animate state
   */
  animate?: Variants['animate'];
  /**
   * Accessibility label
   */
  'aria-label'?: string;
}

// Base animation configuration
const ANIMATION_CONFIG = {
  baseTransition: {
    duration: 0.5,
    ease: [0.16, 1, 0.3, 1] as const, // easeOutExpo
  },
} as const;

// Animation variants generator
const createVariants = (
  effect: RevealEffect,
  distance: number,
  blurAmount: number,
  scale: number,
): Variants => {
  const baseVariants: Variants = {
    hidden: {},
    visible: {
      transition: ANIMATION_CONFIG.baseTransition,
    },
  };

  switch (effect) {
    case 'fade':
      return {
        ...baseVariants,
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };

    case 'slideUp':
      return {
        ...baseVariants,
        hidden: { opacity: 0, y: distance },
        visible: { opacity: 1, y: 0 },
      };

    case 'slideDown':
      return {
        ...baseVariants,
        hidden: { opacity: 0, y: -distance },
        visible: { opacity: 1, y: 0 },
      };

    case 'slideLeft':
      return {
        ...baseVariants,
        hidden: { opacity: 0, x: distance },
        visible: { opacity: 1, x: 0 },
      };

    case 'slideRight':
      return {
        ...baseVariants,
        hidden: { opacity: 0, x: -distance },
        visible: { opacity: 1, x: 0 },
      };

    case 'zoom':
    case 'zoomIn':
      return {
        ...baseVariants,
        hidden: { opacity: 0, scale },
        visible: { opacity: 1, scale: 1 },
      };

    case 'zoomOut':
      return {
        ...baseVariants,
        hidden: { opacity: 0, scale: 1 + (1 - scale) },
        visible: { opacity: 1, scale: 1 },
      };

    case 'blur':
      return {
        ...baseVariants,
        hidden: { opacity: 0, filter: `blur(${blurAmount}px)` },
        visible: { opacity: 1, filter: 'blur(0px)' },
      };

    case 'blurUp':
      return {
        ...baseVariants,
        hidden: {
          opacity: 0,
          y: distance,
          filter: `blur(${blurAmount}px)`,
        },
        visible: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
        },
      };

    case 'blurDown':
      return {
        ...baseVariants,
        hidden: {
          opacity: 0,
          y: -distance,
          filter: `blur(${blurAmount}px)`,
        },
        visible: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
        },
      };

    default:
      return {
        ...baseVariants,
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
  }
};

const RevealOnScrollBase = ({
  children,
  effect = 'fade',
  delay = 0,
  duration = 0.5,
  distance = 30,
  blurAmount = 10,
  scale = 0.8,
  as: Component = 'div',
  className,
  once = true,
  amount = 0.2,
  margin = '0px',
  variants: customVariants,
  initial: customInitial,
  animate: customAnimate,
  'aria-label': ariaLabel,
  ...props
}: RevealOnScrollProps) => {
  const ref = React.useRef<HTMLElement>(null);
  const isInView = useInView(
    ref,
    margin !== undefined && margin !== '0px'
      ? {
          once,
          amount,
          margin: margin as Parameters<typeof useInView>[1] extends {
            margin?: infer M;
          }
            ? M
            : never,
        }
      : {
          once,
          amount,
        },
  );

  const MotionComponent = motion.create(Component);

  // Generate animation variants
  const variants =
    customVariants || createVariants(effect, distance, blurAmount, scale);

  // Type-safe variant extraction helper
  const extractVariantObject = (
    variant: Variants[string],
  ): Record<string, unknown> => {
    if (typeof variant === 'object' && variant !== null) {
      return variant as Record<string, unknown>;
    }
    return {};
  };

  // Extract visible variant safely
  const visibleVariant = extractVariantObject(variants.visible);

  // Extract transition from visible variant
  const existingTransition =
    'transition' in visibleVariant &&
    typeof visibleVariant.transition === 'object' &&
    visibleVariant.transition !== null
      ? (visibleVariant.transition as Record<string, unknown>)
      : {};

  // Build final variants with merged transitions
  const finalVariants: Variants = {
    hidden: customInitial || variants.hidden || { opacity: 0 },
    visible: {
      ...visibleVariant,
      transition: {
        ...existingTransition,
        duration,
        delay,
      },
    },
  };

  // Apply custom animate override if provided
  if (customAnimate) {
    finalVariants.visible = {
      ...finalVariants.visible,
      ...(customAnimate as typeof finalVariants.visible),
    };
  }

  return (
    <MotionComponent
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={finalVariants}
      className={cn(revealVariants({ effect }), className)}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

// Memoized export for performance
export const RevealOnScroll = memo(RevealOnScrollBase);

RevealOnScroll.displayName = 'RevealOnScroll';

// Default export
export default RevealOnScroll;
