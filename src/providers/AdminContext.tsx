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
import { DailyMessages } from "@/types/DailyMessages";

interface AdminContextType {
  isAdmin: boolean;
  loadingAdmin: boolean;

  contactMessages: DailyMessages[];
  thoughts: DailyMessages[];
  users: DailyMessages[];
  loadingData: boolean;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  loadingAdmin: true,
  contactMessages: [],
  thoughts: [],
  users: [],

  loadingData: true,
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(true);

  const [contactMessages, setContactMessages] = useState<DailyMessages[]>([]);
  const [thoughts, setThoughts] = useState<DailyMessages[]>([]);
  const [users, setUsers] = useState<DailyMessages[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const checkAdmin = () => {
    if (session?.user.role === "admin") {
      setIsAdmin(true);
      setLoadingAdmin(false);
      return true;
    } else {
      setLoadingAdmin(false);
      setIsAdmin(false);
      return false;
    }
  };
  const fetchAdminData = async () => {
    try {
      setLoadingData(true);

      const [contactsRes, thoughtsRes, usersRes] = await Promise.all([
        axios.post("/api/Admin/contact/analyze"),
        axios.get("/api/Admin/people_thoughts/analyze"),
        axios.get("/api/Admin/users/analyze"),
      ]);

      setContactMessages(contactsRes.data);
      setThoughts(thoughtsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Admin data fetch failed", error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      setIsAdmin(false);
      setLoadingAdmin(false);
      setLoadingData(false);
      return;
    }

    (async () => {
      setLoadingAdmin(true);
      const admin = await checkAdmin();

      if (admin) {
        await fetchAdminData();
      } else {
        setLoadingData(false);
      }
    })();
  }, [session, isPending]);

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        loadingAdmin,

        contactMessages,
        thoughts,
        users,

        loadingData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
