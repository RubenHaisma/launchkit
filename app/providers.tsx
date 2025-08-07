'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
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
    </SessionProvider>
  );
}