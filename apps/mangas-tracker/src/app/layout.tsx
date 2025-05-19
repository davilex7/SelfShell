import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mangas Tracker App',
  description: 'Placeholder for Mangas Tracker',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
