"use client";
import { fadeOnly, fadeUp } from "@/Animation";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";
import { Bug, PencilOff } from "lucide-react";
import Admin_Loading from "@/components/ui/Admin_Loading";
import { useRouter } from "next/navigation";

type Thought = {
  id?: string;
  title?: string;
  thought: string;
  createdAt?: string;
};

export default function Page() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Thought[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    const userId = session.user.id;
    try {
      const res = await axios.get("/api/thoughts", { params: { userId } });
      setData(res.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPending) return;
    if (session) {
      load();
    } else {
      router.push("/dashboard");
    }
  }, [session, isPending]);

  if (!session || isPending) return <Admin_Loading />;
  return (
    <main className="pt-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          my <span className="mark">Thought</span>
        </h2>
        <Button
          link={"/dashboard"}
          className="px-3 py-1 rounded-md border text-sm"
        >
          Close
        </Button>
      </div>

      <motion.div
        {...fadeUp}
        className="mt-8 p-6 rounded-2xl hover:shadow-lg border border-primary/30 dark:border-primary duration-300"
      >
        {loading && (
          <motion.div
            {...fadeOnly}
            className="flex flex-col justify-center items-center gap-4 text-xl my-10"
          >
            <div className="w-60 h-60 rounded-full border-r border-l-transparent border-primary dark:border-primary-foreground  animate-spin " />
            <span className="animate-pulse">Loading…</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            {...fadeOnly}
            className="text-center   my-10 flex flex-col justify-center items-center gap-4"
          >
            <div className="p-4 rounded-full border-2 border-red-600 bg-red-500 dark:bg-red-600/70 text-white">
              <Bug size={90} strokeWidth={0.6} />
            </div>
            <h2>
              Error <span className="text-red-600">400</span>
            </h2>
            <h6>Plz try Again or you can contact us and we will help you</h6>
            <p>
              <span className="mark"> Error Details </span>: {error}
            </p>
          </motion.div>
        )}

        {!loading && !error && data && (
          <div className="space-y-3">
            {data.length === 0 && (
              <motion.div
                {...fadeOnly}
                className="text-sm text-muted-foreground flex flex-col justify-center items-center gap-4 my-10"
              >
                <div className="p-4 rounded-full border-2 border-primary/70 bg-primary dark:bg-primary-foreground/70 text-white">
                  <PencilOff size={90} strokeWidth={0.6} />
                </div>
                <h4>
                  No items <span className="mark"> yet </span>.
                </h4>
                <p>You can contact Us if you want btw</p>
                <div className="flex items-center gap-5">
                  <Button link={"/contact"}>Contact Us</Button>
                  <Button link={"/dashboard"} variant={"outline"}>
                    dashboard
                  </Button>
                </div>
              </motion.div>
            )}
            {data.map((item) => (
              <div>
                {item.title && <div className="font-medium">{item.title}</div>}
                <div className="text-sm mt-1">{item.thought}</div>
                {item.createdAt && (
                  <div className="text-xs mt-2 text-muted-foreground">
                    At: {new Date(item.createdAt).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}
