import { cn } from '@/lib/utils';
import { ComponentPropsWithoutRef } from 'react';

interface MarqueeProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string;
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean;
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean;
  /**
   * Content to be displayed in the marquee
   */
  children: React.ReactNode;
  /**
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical?: boolean;
  /**
   * Number of times to repeat the content
   * @default 4
   */
  repeat?: number;
  /**
   * Animation duration in seconds (lower = faster, higher = slower)
   * @default 40
   */
  speed?: number;
  /**
   * Whether to apply fade mask on edges
   * @default true
   */
  applyMask?: boolean;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  speed = 40,
  applyMask = true,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        'group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)]',
        {
          'flex-row': !vertical,
          'flex-col': vertical,
        },
        className
      )}
      style={
        {
          '--duration': `${speed}s`,
        } as React.CSSProperties
      }
    >
      {applyMask && (
        <>
          {/* Horizontal fade masks */}
          <div
            className={cn(
              'pointer-events-none absolute z-10 bg-gradient-to-r from-background to-transparent',
              {
                'inset-y-0 left-0 w-[10%]': !vertical,
                hidden: vertical,
              }
            )}
          />
          <div
            className={cn(
              'pointer-events-none absolute z-10 bg-gradient-to-l from-background to-transparent',
              {
                'inset-y-0 right-0 w-[10%]': !vertical,
                hidden: vertical,
              }
            )}
          />

          {/* Vertical fade masks */}
          <div
            className={cn(
              'pointer-events-none absolute z-10 bg-gradient-to-b from-background to-transparent',
              {
                'inset-x-0 top-0 h-[20%]': vertical,
                hidden: !vertical,
              }
            )}
          />
          <div
            className={cn(
              'pointer-events-none absolute z-10 bg-gradient-to-t from-background to-transparent',
              {
                'inset-x-0 bottom-0 h-[20%]': vertical,
                hidden: !vertical,
              }
            )}
          />
        </>
      )}

      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn('flex shrink-0 justify-around [gap:var(--gap)]', {
              'animate-marquee flex-row': !vertical,
              'animate-marquee-vertical flex-col': vertical,
              'group-hover:[animation-play-state:paused]': pauseOnHover,
              '[animation-direction:reverse]': reverse,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  );
}
