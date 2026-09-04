"use client";
import { motion } from "motion/react";
import SimpleTitle from "@/components/ui/SimpleTitle";
import { Button } from "@/components/ui/button";
import { fadeUp, fadeOnly, transition } from "@/Animation";
import { useRive } from "@rive-app/react-canvas";
import { T, useGT } from "gt-next";
import Moment_Card from "@/components/ui/Moment_Card";
import { useMomentsFeedStore } from "@/store/useMomentsFeedStore";
import { useEffect, useRef } from "react";

export default function Page() {
  const t = useGT();
  const { RiveComponent } = useRive({
    src: "/Animated_Images/bear-sleeping.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  const { thoughts, loading, loadingMore, hasMore, fetchInitial, fetchMore } =
    useMomentsFeedStore();

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasMore) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMore();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loadingMore, thoughts.length]);

  return (
    <main className="relative flex flex-col justify-center items-center gap-5 overflow-hidden pt-20 md:pt-25 pb-20">
      <section className="flex flex-row-reverse justify-center items-start gap-5">
        <div className="hidden md:inline relative w-full h-60 -z-20 mt-10">
          <RiveComponent className="absolute top-2/4 left-2/4 -translate-2/4 object-cover w-[700px] h-[700px] max-w-5xl min-h-96" />
        </div>

        <div className="w-full max-w-6xl">
          {loading ? (
            <motion.div
              {...fadeOnly}
              className="flex flex-col justify-center items-center gap-4 text-xl my-20"
            >
              <div className="w-20 h-20 rounded-full border-r border-l-transparent border-primary dark:border-primary-foreground animate-spin" />
              <span className="animate-pulse">{t("Loading...")}</span>
            </motion.div>
          ) : thoughts.length === 0 ? (
            <T>
              <motion.div
                {...fadeOnly}
                className="text-center my-20 flex flex-col items-center gap-4"
              >
                <h3 className="text-xl font-semibold">No moments yet</h3>
                <p className="text-muted-foreground">
                  Be the first to share something.
                </p>
                <Button link="/send">Send Message</Button>
              </motion.div>
            </T>
          ) : (
            <>
              <motion.div {...fadeOnly} className="grid grid-cols-1 gap-4">
                {thoughts.map((thought) => (
                  <Moment_Card key={thought._id} thought={thought} />
                ))}
              </motion.div>

              {hasMore ? (
                <div ref={sentinelRef} className="flex justify-center py-10">
                  {loadingMore && (
                    <div className="w-8 h-8 rounded-full border-r border-l-transparent border-primary dark:border-primary-foreground animate-spin" />
                  )}
                </div>
              ) : (
                <T>
                  <motion.div
                    {...fadeOnly}
                    className="text-center my-14 flex flex-col items-center gap-4"
                  >
                    <p className="text-muted-foreground">
                      There are no more thoughts. Want to add yours?
                    </p>
                    <div className="flex items-center gap-4">
                      <Button link="/">Add Your Thought</Button>
                      <Button link="/contact" variant="outline">
                        Contact Us
                      </Button>
                    </div>
                  </motion.div>
                </T>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
