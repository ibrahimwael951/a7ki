import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A7KI — Anonymous Stories",
  description:
    "A7KI is an anonymous platform to share personal stories, bad moments, and heavy emotions safely. Read real confessions, express your feelings freely, and connect with others without revealing your identity. A private, judgment-free place to vent and feel understood.",
  keywords: [
    "anonymous stories",
    "confession app",
    "venting platform",
    "share feelings",
    "anonymous sharing",
    "emotional support",
    "real stories",
    "safe space to vent",
    "online confessions",
    "A7KI",
    "احكي",
    "ahki",
    "A6ki",
  ],
  openGraph: {
    title: "A7KI — Anonymous Stories & Emotional Sharing Platform",
    description:
      "Share your thoughts anonymously, read real confessions, and release emotional weight in a safe and private space.",
    // url: "https://your-domain.com",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SmoothScroll />
          <Navbar />
          {children}
          <Footer />
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
