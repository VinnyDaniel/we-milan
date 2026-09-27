import type { Metadata } from 'next';
import './globals.css';
import { MobileContainer } from '@/components/MobileContainer';
import { ThemeProvider } from '@/context/ThemeContext';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  title: "We Milan — The World's Your Runway",
  description: 'AI-powered smart wardrobe and personal styling assistant.',
  icons: {
    icon: [
      { url: `${basePath}/favicon.ico` },
      { url: `${basePath}/favicon.png`, type: 'image/png' },
      { url: `${basePath}/logo.png`, type: 'image/png' },
    ],
    shortcut: `${basePath}/favicon.png`,
    apple: `${basePath}/logo.png`,
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
        <link rel="icon" type="image/png" href={`${basePath}/favicon.png`} />
        <link rel="shortcut icon" href={`${basePath}/favicon.png`} />
        <link rel="apple-touch-icon" href={`${basePath}/logo.png`} />
      </head>
      <body>
        <ThemeProvider>
          <MobileContainer>{children}</MobileContainer>
        </ThemeProvider>
      </body>
    </html>
  );
}
