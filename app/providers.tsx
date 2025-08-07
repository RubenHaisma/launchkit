'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            className: 'glassmorphism-dark border border-white/20',
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              backdropFilter: 'blur(12px)',
            },
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
}