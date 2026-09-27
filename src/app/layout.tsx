import type { Metadata } from 'next';
import './globals.css';
import { MobileContainer } from '@/components/MobileContainer';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  title: 'We Milan — Your Wardrobe. Reimagined.',
  description: 'AI-powered smart wardrobe and personal styling assistant.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body>
        <ThemeProvider>
          <MobileContainer>{children}</MobileContainer>
        </ThemeProvider>
      </body>
    </html>
  );
}
