import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PROphysics',
  description: 'Образовательная платформа по физике 7–9 классов'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
