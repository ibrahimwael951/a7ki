"use client";
import { fadeOnly, fadeUp } from "@/Animation";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Bug, PencilOff } from "lucide-react";
import Admin_Loading from "@/components/ui/Admin_Loading";
import { useRouter } from "next/navigation";
import { Thought } from "@/types/Thoughts";
import Thought_Card from "@/components/ui/Thought_Card";
import axios from "axios";
import { T, useGT } from "gt-next";
import Link from "next/link";

export default function Page() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Thought[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const t = useGT();

  const load = async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    const userId = session.user.id;
    try {
      const res = await axios.get("/api/thought", { params: { userId } });
      setData(res.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load data.",
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
    <main className="py-20">
      <T>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            My <span className="mark">Thought</span>
          </h2>
          <Button
            link={"/dashboard"}
            className="px-3 py-1 rounded-md border text-sm"
          >
            Go Back
          </Button>
        </div>
      </T>

      <motion.div {...fadeUp} className="mt-8">
        {loading && (
          <motion.div
            {...fadeOnly}
            className="flex flex-col justify-center items-center gap-4 text-xl my-10"
          >
            <div className="w-60 h-60 rounded-full border-r border-l-transparent border-primary dark:border-primary-foreground  animate-spin " />
            <span className="animate-pulse">{t("Loading…")}</span>
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
            <T>
              <h2>
                Error <span className="text-red-600">400</span>
              </h2>
              <h6>Plz try Again or you can contact us and we will help you</h6>
            </T>
            <p>
              <span className="mark"> Error Details </span>: {error}
            </p>
          </motion.div>
        )}

        {!loading && !error && data && (
          <div className="grid grid-cols-1 gap-5">
            {data.length === 0 && (
              <motion.div
                {...fadeOnly}
                className="text-sm text-muted-foreground flex flex-col justify-center items-center gap-4 my-10"
              >
                <div className="p-4 rounded-full border-2 border-primary/70 bg-primary dark:bg-primary-foreground/70 text-white">
                  <PencilOff size={90} strokeWidth={0.6} />
                </div>
                <T>
                  <h4>
                    No items <span className="mark"> yet </span>.
                  </h4>
                  <p>You can contact Us if you want btw</p>
                  <div className="flex items-center gap-5">
                    <Button link={"/send"}>Send Thought</Button>
                    <Button link={"/dashboard"} variant={"outline"}>
                      dashboard
                    </Button>
                  </div>
                </T>
              </motion.div>
            )}
            {data.map((item) => (
              <Link
                key={item._id}
                href={`/thought/${item._id}`}
                className="block rounded-xl border-2 border-neutral-300/50 dark:border-neutral-700/50 p-4 bg-neutral-200/40 dark:bg-neutral-800/40 hover:bg-neutral-200/70 dark:hover:bg-neutral-800/70 transition-colors"
              >
                <p className="text-sm line-clamp-5">{item.thought}</p>
                <div className="flex items-center justify-end gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}
