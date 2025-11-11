import './globals.css';

import { Metadata } from 'next';
import { ReactNode } from 'react';
import { Providers } from '../components/providers';

export const metadata: Metadata = {
  title: 'BarberFlow',
  description: 'Multi-tenant barbershop management platform',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
