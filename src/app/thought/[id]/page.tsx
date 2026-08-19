"use client";
import { fadeOnly, fadeUp } from "@/Animation";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { use, useEffect, useState } from "react";
import { Bug  } from "lucide-react";
import Admin_Loading from "@/components/ui/Admin_Loading";
import { useRouter } from "next/navigation";
import { Thought } from "@/types/Thoughts";
import Thought_Card from "@/components/ui/Thought_Card";
import axios from "axios";
import { T, useGT } from "gt-next";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session, isPending: isSessionPending } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [thoughtData, setThoughtData] = useState<Thought | null>(null);
  const [error, setError] = useState<string | null>(null);
  const t = useGT();

  const loadThought = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/thought/${id}`);
      setThoughtData(res.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load the thought.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    loadThought();
  }, [id]);

  if (isSessionPending) return <Admin_Loading />;

  return (
    <main className="py-20 max-w-4xl mx-auto px-4 min-h-[80vh] flex flex-col justify-start">
      <T>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="mark">{t("Thought")}</span>
          </h2>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="px-3 py-1 rounded-md border text-sm flex flex-row justify-center items-center gap-2 "
          >
            {t("Go Back")}
          </Button>
        </div>
      </T>

      <motion.div {...fadeUp} className="flex-1 flex flex-col justify-start">
        {loading && (
          <motion.div
            {...fadeOnly}
            className="flex flex-col justify-center items-center gap-4 text-xl my-20"
          >
            <div className="w-60 h-60 rounded-full border-r border-l-transparent border-primary dark:border-primary-foreground animate-spin" />
            <span className="animate-pulse">{t("Loading...")}</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            {...fadeOnly}
            className="text-center my-10 flex flex-col justify-center items-center gap-4"
          >
            <div className="p-4 rounded-full border-2 border-red-600 bg-red-500 dark:bg-red-600/70 text-white">
              <Bug size={90} strokeWidth={0.6} />
            </div>
            <T>
              <h2>
                {t("Error")} <span className="text-red-600">404</span>
              </h2>
              <h6>
                {t(
                  "The requested thought could not be loaded. It may have been deleted or the link might be invalid.",
                )}
              </h6>
            </T>
            <p>
              <span className="mark"> {t("Error Details")} </span>: {error}
            </p>
          </motion.div>
        )}

        {!loading && !error && thoughtData && (
          <div className="w-full">
            <Thought_Card
              thoughtId={thoughtData._id}
              ThoughtFeedback={thoughtData.feedback}
              userId={thoughtData.userId}
              thought={thoughtData.thought}
              rank={thoughtData.rank}
              createdAt={thoughtData.createdAt}
              withoutSlice
            />
          </div>
        )}
      </motion.div>
    </main>
  );
}
