"use client";
import { Contact_Message } from "@/types/ContactMessages";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import MessageCard from "@/components/ui/MessageCard";
import { useSession } from "@/lib/auth-client";
import Admin_Loading from "@/components/ui/Admin_Loading";
import { fadeLeft, fadeOnly } from "@/Animation";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Contact_Message[] | null>(null);
  const [error, setError] = useState();
  const { data: session, isPending } = useSession();

  async function FetchData() {
    setLoading(true);
    try {
      const result = await axios.post("/api/contact/admin");

      setData(result.data);
      setLoading(false);
    } catch (error: any) {
      setError(error.response.data.message);
    }
  }

  useEffect(() => {
    if (isPending || !session) return;
    FetchData();
  }, [session, isPending]);

  if (error)
    return (
      <main className="flex justify-center items-center text-4xl">{error}</main>
    );
  if (loading || !data || !session || isPending) return <Admin_Loading />;
  return (
    <main className="mt-20 p-6">
      <section className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-3 md:gap-10 mb-8">
        <motion.h2 {...fadeLeft} className="flex items-center gap-3">
          <MessageSquare
            size={50}
            strokeWidth={3}
            className="shrink-0 mt-1 text-primary dark:text-primary-foreground"
          />
          Contact Messages
        </motion.h2>
        <Button onClick={FetchData} className="w-2/3 md:w-fit">
          Refresh
        </Button>
      </section>
      <section>
        {data.length >= 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((item) => (
              <MessageCard
                key={item._id}
                _id={item._id}
                name={item.name}
                email={item.email}
                message={item.message}
                createdAt={item.createdAt}
              />
            ))}
          </div>
        ) : (
          <motion.div {...fadeOnly} className="text-center">
            <h3 className="text-primary dark:text-primary-foreground">
              There is no messages yet
            </h3>
            <p>Try again later</p>
          </motion.div>
        )}
      </section>
    </main>
  );
}
