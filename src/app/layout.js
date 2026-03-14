import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EdgeLedger — Smart Money Trading Journal",
  description: "The modern trading journal designed specifically for Smart Money traders. Log trades fast, discover your edge, master your strategy.",
  keywords: "trading journal, SMC, ICT, smart money, forex, trading analytics",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Sidebar />
        <main className="lg:ml-[240px] min-h-screen pb-20 lg:pb-0">
          {children}
        </main>
      </body>
    </html>
  );
}
