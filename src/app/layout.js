import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Onboarding from '@/components/ui/Onboarding';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'EdgeLedger — Smart Trading Journal',
  description: 'The modern trading journal designed for Smart Money traders to find their edge.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
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
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 w-full pb-24 lg:pb-0 min-h-screen">
              {children}
            </main>
          </div>
          <Onboarding />
        </ThemeProvider>
      </body>
    </html>
  );
}
