import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { AdminProvider } from "../providers/AdminContext";
import { GTProvider, useLocale } from "gt-next";
import Welcome from "@/components/Welcome";
import NextTopLoader from "nextjs-toploader";

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
    url: "https://a7ki.vercel.app",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = useLocale();

  return (
    <html
      lang={locale === "ar-EG" ? "ar" : "en"}
      dir={locale === "ar-EG" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <NextTopLoader
            color="#b97375"
            height={3}
            showSpinner={false}
          />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <GTProvider>
            <AdminProvider>
              <Welcome />
              <Navbar />
              {children}
              <Footer />
              <Toaster richColors closeButton />
            </AdminProvider>
          </GTProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
