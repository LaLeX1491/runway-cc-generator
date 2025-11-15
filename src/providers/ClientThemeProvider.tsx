'use client';

import theme from '../theme';
import React from 'react';
import {ThemeUIProvider} from 'theme-ui';

export default function ClientThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeUIProvider theme={theme}>{children}</ThemeUIProvider>;
}
