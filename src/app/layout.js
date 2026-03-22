import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import LayoutWrapper from '@/components/LayoutWrapper';
import Onboarding from '@/components/ui/Onboarding';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/components/AuthProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ToastProvider } from '@/components/ui/Toast';
import { ConfirmProvider } from '@/components/ui/ConfirmModal';
import PostHogProvider from '@/components/PostHogProvider';
import ReferralTracker from '@/components/ReferralTracker';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'SMC Journal – Free Trading Journal for SMC & Forex Traders',
  description: 'Track your trades, identify mistakes, and improve your execution with SMC Journal. A free trading journal built for serious traders.',
  keywords: 'trading journal, forex trading journal, smc trading journal, free trading journal, trading analytics tool, smart money concepts, trading log, trade tracker',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://smcjournal.com'),
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'SMC Journal – The Professional SMC Trading Journal',
    description: 'Track your trades, identify mistakes, and improve your execution. Built for serious traders.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://smcjournal.com',
    siteName: 'SMC Journal',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SMC Journal — Smart Money Trading Journal',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SMC Journal — Master your SMC Edge',
    description: 'The free institutional-grade trading journal for serious traders.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Suppress non-fatal Next.js 16 AbortError (Lock broken) noise
                  const originalError = console.error;
                  console.error = (...args) => {
                    if (args[0] && typeof args[0] === 'string' && args[0].includes("Lock broken by another request with the 'steal' option")) return;
                    if (args[0] instanceof Error && args[0].message.includes("Lock broken by another request")) return;
                    originalError(...args);
                  };

                  const theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "SMC Journal",
              "operatingSystem": "Web",
              "applicationCategory": "TradingApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Track your trades, identify mistakes, and improve your execution with SMC Journal. A free trading journal built for serious traders."
            })
          }}
        />
      </head>
      <body className="font-sans antialiased text-[var(--foreground)] bg-[var(--background)]">
        <PostHogProvider>
          <ThemeProvider>
            <AuthProvider>
              <ErrorBoundary>
                <ToastProvider>
                  <ConfirmProvider>
                    <ReferralTracker />
                    <Sidebar />
                    <LayoutWrapper>
                      {children}
                    </LayoutWrapper>
                    <Onboarding />
                  </ConfirmProvider>
                </ToastProvider>
              </ErrorBoundary>
            </AuthProvider>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
