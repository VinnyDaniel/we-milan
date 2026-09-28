import type { Metadata, Viewport } from 'next';
import './globals.css';
import { MobileContainer } from '@/components/MobileContainer';
import { ThemeProvider } from '@/context/ThemeContext';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const viewport: Viewport = {
  themeColor: '#181A31',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "We Milan — The World's Your Runway",
  description: 'AI-powered smart wardrobe and personal styling assistant.',
  manifest: `${basePath}/manifest.json`,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'We Milan',
  },
  icons: {
    icon: [
      { url: `${basePath}/favicon.png?v=wemi-v5`, type: 'image/png' },
      { url: `${basePath}/favicon.ico?v=wemi-v5` },
      { url: `${basePath}/favicon-32.png?v=wemi-v5`, sizes: '32x32', type: 'image/png' },
      { url: `${basePath}/favicon-16.png?v=wemi-v5`, sizes: '16x16', type: 'image/png' },
      { url: `${basePath}/logo.png?v=wemi-v5`, type: 'image/png' },
    ],
    shortcut: `${basePath}/favicon.png?v=wemi-v5`,
    apple: `${basePath}/apple-touch-icon.png?v=wemi-v5`,
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
        <meta name="theme-color" content="#181A31" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="We Milan" />
        <meta name="application-name" content="We Milan" />
        <link rel="manifest" href={`${basePath}/manifest.json`} />
        <link rel="icon" type="image/png" sizes="32x32" href={`${basePath}/favicon-32.png?v=wemi-v5`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`${basePath}/favicon-16.png?v=wemi-v5`} />
        <link rel="icon" type="image/png" href={`${basePath}/favicon.png?v=wemi-v5`} />
        <link rel="icon" href={`${basePath}/favicon.ico?v=wemi-v5`} />
        <link rel="shortcut icon" href={`${basePath}/favicon.png?v=wemi-v5`} />
        <link rel="apple-touch-icon" sizes="180x180" href={`${basePath}/apple-touch-icon.png?v=wemi-v5`} />
      </head>
      <body>
        <ThemeProvider>
          <MobileContainer>
            <PWAInstallPrompt />
            {children}
          </MobileContainer>
        </ThemeProvider>
      </body>
    </html>
  );
}
