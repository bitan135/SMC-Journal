import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import LayoutWrapper from '@/components/LayoutWrapper';
import Onboarding from '@/components/ui/Onboarding';
import { ThemeProvider } from '@/components/ThemeProvider';
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
  title: 'SMC Journal — Smart Money Trading Journal',
  description: 'The free institutional-grade trading journal for Smart Money Concept traders. Track BOS, CHoCH, FVG setups. Analyse your edge. Completely free forever.',
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
    title: 'SMC Journal — Smart Money Trading Journal',
    description: 'The free SMC trading journal. Log trades, tag confluences, analyse your edge. Free forever.',
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
    title: 'SMC Journal — Smart Money Trading Journal',
    description: 'The free SMC trading journal. Log trades, tag confluences, analyse your edge.',
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

                  const savedTheme = localStorage.getItem('theme') || 'auto';
                  const root = document.documentElement;
                  if (savedTheme === 'auto') {
                    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    root.setAttribute('data-theme', systemTheme);
                  } else {
                    root.setAttribute('data-theme', savedTheme);
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
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
