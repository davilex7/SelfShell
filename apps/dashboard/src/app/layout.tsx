// apps/dashboard/src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Importa tus estilos globales

// Configuración de la fuente Inter
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Opcional: para usar como variable CSS
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SelfShell', // Puedes cambiar esto si renombraste la app
  description: 'Un dashboard personal modular y bien diseñado.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.className}>
      <body>
        {children}
      </body>
    </html>
  );
}
