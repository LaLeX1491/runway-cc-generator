'use client';

import theme from '../theme';
import React from 'react';
import {ThemeUIProvider} from 'theme-ui';
import {useEffect, useState} from 'react';

export default function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <ThemeUIProvider theme={theme}>{children}</ThemeUIProvider>;
}