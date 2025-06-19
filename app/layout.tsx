import '@mantine/core/styles.css';
import '@mantine/code-highlight/styles.css';
import './globals.css';

import React from 'react';
import { Asap } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from '@mantine/core';
import { NhatCapDang } from '@/src/Layouts';
import TanstackProviders from '@/src/providers/tanstack-providers';
import { theme } from '../theme';

const asap = Asap({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-asap',
});

export const metadata = {
  title: 'Mantine Next.js template',
  description: 'I am using Mantine with Next.js!',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body className={` ${asap.className}`}>
        <TanstackProviders>
          <ThemeProvider
            // attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <MantineProvider theme={theme}>
              <NhatCapDang>{children}</NhatCapDang>
            </MantineProvider>
          </ThemeProvider>
        </TanstackProviders>
      </body>
    </html>
  );
}
