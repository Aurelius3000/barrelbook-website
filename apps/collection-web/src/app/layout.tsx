import type { Metadata } from 'next';
import './globals.css';
import './owner.css';

export const metadata: Metadata = {
  title: 'Your collection · BarrelBook',
  description: 'Your private BarrelBook collection.',
  robots: { index: false, follow: false, nocache: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
