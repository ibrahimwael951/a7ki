"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "@/lib/auth-client";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

interface AdminContextType {
  isAdmin: boolean;
  loadingAdmin: boolean;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  loadingAdmin: true,
});

interface AdminProviderProps {
  children: ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loadingAdmin, setLoadingAdmin] = useState<boolean>(true);

  const CheckAdmin = async () => {
    try {
      await axios.post("/api/Admin/", {
        userId: session!.user.id,
      });
      setIsAdmin(true);
    } catch {
      setIsAdmin(false);
    } finally {
      setLoadingAdmin(false);
    }
  };

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      setIsAdmin(false);
      setLoadingAdmin(false);
      return;
    }

    setLoadingAdmin(true);
    CheckAdmin();
  }, [session, isPending]);


  return (
    <AdminContext.Provider value={{ isAdmin, loadingAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
