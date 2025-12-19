"use client";
import { AdminProvider } from "./AdminContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminProvider>{children}</AdminProvider>;
}
