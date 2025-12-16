"use client";
import Admin_Loading from "@/components/ui/Admin_Loading";
import { useSession } from "@/lib/auth-client";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const pathname = usePathname();
  const [error, SetError] = useState("");
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const CheckAdmin = async () => {
    if (!session) return;
    try {
      await axios.post<{ data: boolean }>("/api/Admin/", {
        userId: session.user.id,
      });
      setIsAdmin(true);
    } catch (error: any) {
      setIsAdmin(false);
      SetError(error.response.data || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPending || !session) return;
    CheckAdmin();
  }, [session, isPending]);

  useEffect(() => {
    if (isPending || loading) return;
    if (pathname !== "/Admin") {
      if (!session) {
        router.push("/Admin");
      } else if (!isAdmin) {
        toast.error(error, {
          position: "bottom-right",
        });
        router.push("/dashboard");
      }
    }
    if (pathname == "/Admin" && session) {
      if (isAdmin) {
        router.push("/Admin/dashboard");
      }
    }
  }, [pathname, session, isPending, router, loading, isAdmin]);

  if (pathname !== "/Admin" && !isAdmin && loading)
    return <Admin_Loading CheckAdmin />;
  return children;
}
