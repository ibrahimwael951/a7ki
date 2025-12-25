"use client";
import { AdminProvider } from "../../../providers/AdminContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminProvider>{children}</AdminProvider>;
}
