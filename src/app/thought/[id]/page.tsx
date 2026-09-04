"use client";
import { fadeOnly, fadeUp } from "@/Animation";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { use, useEffect, useState } from "react";
import { Bug } from "lucide-react";
import Admin_Loading from "@/components/ui/Admin_Loading";
import { Thought } from "@/types/Thoughts";
import Thought_Card from "@/components/ui/Thought_Card";
import Comment_Section from "@/components/ui/Comment_Section";
import axios from "axios";
import { T, useGT } from "gt-next";
import { useRive } from "@rive-app/react-canvas";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session, isPending: isSessionPending } = useSession();
  const [loading, setLoading] = useState(true);
  const [thoughtData, setThoughtData] = useState<Thought | null>(null);
  const [error, setError] = useState<string | null>(null);
  const t = useGT();

  const { RiveComponent } = useRive({
    src: "/Animated_Images/Cat.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

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
    <main className="pt-20 pb-30 w-full min-h-[80vh] flex flex-row-reverse justify-center items-start gap-10">
      <section className="relative overflow-hidden w-2/4 h-120 hidden xl:inline">
        <div className="w-[560] h-[560] absolute top-2/4 left-2/4 -translate-2/4 ">
          <RiveComponent />
        </div>
      </section>
      <section className="xl:max-w-3xl! max-w-4xl! flex flex-col justify-start pt-5">
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
                  Error <span className="text-red-600">404</span>
                </h2>
                <h6>
                  The requested thought could not be loaded. It may have been
                  deleted or the link might be invalid.
                </h6>
              </T>
              <p>
                <span className="mark"> {t("Error Details")} </span>: {error}
              </p>
            </motion.div>
          )}

          {!loading && !error && thoughtData && (
            <div className="w-full h-full flex flex-col justify-baseline">
              <Thought_Card
                thoughtId={thoughtData._id}
                saved={thoughtData.saved}
                ThoughtFeedback={thoughtData.feedback}
                userId={thoughtData.userId}
                userName={thoughtData.userName}
                thought={thoughtData.thought}
                rank={thoughtData.rank}
                createdAt={thoughtData.createdAt}
                withoutSlice
              />

              <Comment_Section thoughtId={thoughtData._id} />
            </div>
          )}
        </motion.div>
      </section>
    </main>
  );
}
