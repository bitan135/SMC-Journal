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
  title: 'SMC Journal — The Free Smart Money Trading Journal',
  description: 'The #1 free institutional-grade trading journal for Smart Money Concept (SMC) traders. Log BOC, CHoCH, and FVG setups with deep analytics. Optimize your forex edge today.',
  keywords: 'trading journal, SMC journal, free forex journal, smart money concepts, trading analytics, forex trade log, BOC CHoCH FVG, institutional trading tool',
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
    title: 'SMC Journal — The #1 SMC Trading Journal',
    description: 'Log your SMC trades with precision. Free forever institutional-grade analytics for forex and crypto traders.',
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
    description: 'The free institutional-grade trading journal. Analytics for the serious SMC trader.',
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

                  const savedTheme = localStorage.getItem('theme') || 'light';
                  const root = document.documentElement;
                  
                  // Check if current path is a marketing path that should be forced light
                  const marketingPaths = ['/', '/terms', '/privacy', '/affiliate'];
                  const pathname = window.location.pathname;
                  const isMarketing = marketingPaths.some(p => p === '/' ? pathname === '/' : pathname.startsWith(p));

                  const activeTheme = isMarketing ? 'light' : savedTheme;

                  if (activeTheme === 'auto') {
                    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    root.setAttribute('data-theme', systemTheme);
                  } else {
                    root.setAttribute('data-theme', activeTheme);
                  }
                } catch (e) {}
              })();
            `,
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
