'use client';

import { useTheme } from 'next-themes';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { CopyButton } from '../copy-button';
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
  useTabs,
  type TabsProps,
} from '../tabs';

type CodeTabsProps = {
  codes: Record<string, string>;
  lang?: string;
  themes?: {
    light: string;
    dark: string;
  };
  copyButton?: boolean;
  /** Called when copy is attempted. Return false to prevent copy action. */
  onCopy?: (content: string) => void | boolean;
} & Omit<TabsProps, 'children'>;

/**
 * Memoized CodeTabsContent component
 * @performance Prevents re-renders when parent state changes
 */
const CodeTabsContent = React.memo(function CodeTabsContent({
  codes,
  lang = 'bash',
  themes = {
    light: 'github-light',
    dark: 'github-dark',
  },
  copyButton = true,
  onCopy,
}: {
  codes: Record<string, string>;
  lang?: string;
  themes?: { light: string; dark: string };
  copyButton?: boolean;
  onCopy?: (content: string) => void | boolean;
}) {
  const { resolvedTheme } = useTheme();
  const { activeValue } = useTabs();

  // Use ref to track theme without causing re-renders
  const themeRef = React.useRef(resolvedTheme);

  const [highlightedCodes, setHighlightedCodes] =
    React.useState<Record<string, string>>(codes); // Start with raw codes for instant rendering

  // Memoize code keys to prevent re-renders when iterating
  const codeKeys = React.useMemo(() => Object.keys(codes), [codes]);
  const codeEntries = React.useMemo(() => Object.entries(codes), [codes]);

  // Update ref when theme changes
  React.useEffect(() => {
    themeRef.current = resolvedTheme;
  }, [resolvedTheme]);

  React.useEffect(() => {
    let cancelled = false;

    async function loadHighlightedCode() {
      try {
        const { codeToHtml } = await import('shiki');
        const newHighlightedCodes: Record<string, string> = {};
        const currentTheme = themeRef.current;

        // Process all codes in parallel instead of sequentially
        const entries = Object.entries(codes);
        const results = await Promise.all(
          entries.map(async ([command, val]) => {
            const highlighted = await codeToHtml(val, {
              lang,
              themes: {
                light: themes.light,
                dark: themes.dark,
              },
              defaultColor: currentTheme === 'dark' ? 'dark' : 'light',
            });
            return [command, highlighted] as const;
          })
        );

        if (cancelled) return;

        for (const [command, highlighted] of results) {
          newHighlightedCodes[command] = highlighted;
        }

        // Batch DOM update using requestAnimationFrame to avoid forced reflow
        requestAnimationFrame(() => {
          if (!cancelled) {
            setHighlightedCodes(newHighlightedCodes);
          }
        });
      } catch (error) {
        console.error('Error highlighting codes', error);
      }
    }

    // Defer highlighting to next frame to avoid blocking initial render
    const rafId = requestAnimationFrame(() => {
      loadHighlightedCode();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [resolvedTheme, lang, themes.light, themes.dark, codes]);

  return (
    <>
      <TabsList
        data-slot="install-tabs-list"
        className="w-full relative justify-between rounded-none h-10 bg-muted border-b border-border/75 dark:border-border/50 text-current py-0 px-4"
        activeClassName="rounded-none shadow-none bg-transparent after:content-[''] after:absolute after:inset-x-0 after:h-0.5 after:bottom-0 dark:after:bg-white after:bg-black after:rounded-t-full"
      >
        <div className="flex gap-x-3 h-full">
          {codeKeys.map(code => (
            <TabsTrigger
              key={code}
              value={code}
              className="text-foreground/60 data-[state=active]:text-foreground px-0"
            >
              {code}
            </TabsTrigger>
          ))}
        </div>

        {copyButton && (
          <CopyButton
            content={codes[activeValue]}
            size="sm"
            variant="ghost"
            className="-me-2 bg-transparent hover:bg-black/5 dark:hover:bg-white/10"
            onCopy={onCopy}
          />
        )}
      </TabsList>
      <TabsContents data-slot="install-tabs-contents">
        {codeEntries.map(([code, rawCode]) => (
          <TabsContent
            data-slot="install-tabs-content"
            key={code}
            className="w-full text-sm flex items-center p-4 overflow-auto"
            value={code}
          >
            <div className="w-full [&>pre]:m-0 [&>pre]:p-0 [&>pre]:bg-transparent! [&>pre]:border-none [&>pre]:text-[13px] [&>pre]:leading-relaxed [&_code]:text-[13px] [&_code]:leading-relaxed [&_code]:bg-transparent! [&_.shiki]:bg-transparent!">
              {highlightedCodes[code] !== rawCode ? (
                <div
                  dangerouslySetInnerHTML={{ __html: highlightedCodes[code] }}
                />
              ) : (
                <pre>
                  <code>{rawCode}</code>
                </pre>
              )}
            </div>
          </TabsContent>
        ))}
      </TabsContents>
    </>
  );
});

/**
 * CodeTabs component for displaying installation commands
 * @performance
 * - Memoized with React.memo to prevent re-renders from parent
 * - Memoizes firstKey and tabsProps to prevent recalculation
 */
const CodeTabs = React.memo(function CodeTabs({
  codes,
  lang = 'bash',
  themes = {
    light: 'github-light',
    dark: 'github-dark',
  },
  className,
  defaultValue,
  value,
  onValueChange,
  copyButton = true,
  onCopy,
}: CodeTabsProps) {
  const firstKey = React.useMemo(() => Object.keys(codes)[0] ?? '', [codes]);

  // Memoize tabsProps to prevent object recreation
  const tabsProps = React.useMemo(
    () =>
      value !== undefined
        ? { value, onValueChange }
        : { defaultValue: defaultValue ?? firstKey },
    [value, onValueChange, defaultValue, firstKey]
  );

  // Memoize themes object to prevent CodeTabsContent re-renders
  const memoizedThemes = React.useMemo(() => themes, [themes]);

  return (
    <Tabs
      data-slot="install-tabs"
      className={cn(
        'w-full gap-0 bg-background rounded-xl border overflow-hidden',
        className
      )}
      {...tabsProps}
    >
      <CodeTabsContent
        codes={codes}
        lang={lang}
        themes={memoizedThemes}
        copyButton={copyButton}
        onCopy={onCopy}
      />
    </Tabs>
  );
});

export { CodeTabs, type CodeTabsProps };
