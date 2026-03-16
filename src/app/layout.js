import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import LayoutWrapper from '@/components/LayoutWrapper';
import Onboarding from '@/components/ui/Onboarding';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ToastProvider } from '@/components/ui/Toast';
import { ConfirmProvider } from '@/components/ui/ConfirmModal';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'SMC Journal — Smart Money Trading Journal',
  description: 'The institutional-grade trading journal for Smart Money Concept traders. Track, analyze, and find your edge.',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon.png', sizes: '180x180', type: 'image/png' },
    ],
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
        <ThemeProvider>
          <ToastProvider>
            <ConfirmProvider>
              <Sidebar />
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
              <Onboarding />
            </ConfirmProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
