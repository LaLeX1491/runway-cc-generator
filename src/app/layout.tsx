import "./index.css";
import ClientThemeProvider from '@/providers/ClientThemeProvider';
import React from 'react';
import {ConditionCodeProvider} from '@/context/ConditionCodeProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-secondary w-screen overflow-x-hidden min-h-screen">
        <ClientThemeProvider>
          <header className="w-full text-center mb-3">
            <h1 className="text-5xl text-primary font-bold">FIR Bremen</h1>
            <span className="text-muted-foreground">runway condition code generator</span>
          </header>
          <ConditionCodeProvider>
            {children}
          </ConditionCodeProvider>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
