"use client";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.push("/");
    }
  }, [session, isPending]);
  return children;
}
