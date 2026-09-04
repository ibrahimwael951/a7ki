"use client";
import { fadeOnly, transition } from "@/Animation";
import { Button } from "@/components/ui/button";
import Moment_Card from "@/components/ui/Moment_Card";
import { Thought } from "@/types/Thoughts";
import { useRive } from "@rive-app/react-canvas";
import axios from "axios";
import { T, useGT } from "gt-next";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const t = useGT();
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);

  const { RiveComponent } = useRive({
    src: "/Animated_Images/Happy_Dog.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  const fetchSavedThoughts = async () => {
    try {
      const response = await axios.get("/api/mySavedThought");
      setThoughts(response.data.thoughts);
    } catch (error) {
      toast.error("Failed to load saved thoughts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedThoughts();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center py-24">
      <T>
        <h1 className="text-3xl font-bold text-center md:hidden">
          Saved <span className="mark">Thoughts</span>...
        </h1>
      </T>
      <section className="flex justify-center items-start gap-10 w-full md:mt-10">
        <div className="hidden md:inline relative w-2/4 h-60 -z-20 mt-10">
          <RiveComponent className="absolute top-2/4 left-2/4 -translate-2/4 object-cover w-[700px] h-[700px] max-w-5xl min-h-96" />
        </div>

        <div className="w-full md:w-2/4 max-w-2xl flex flex-col justify-center items-center gap-5 mt-5">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                {...fadeOnly}
                {...transition}
                className="flex flex-col justify-center items-center gap-4 text-xl my-20"
              >
                <div className="w-20 h-20 rounded-full border-r border-l-transparent border-primary dark:border-primary-foreground animate-spin" />
                <span className="animate-pulse">{t("Loading...")}</span>
              </motion.div>
            ) : thoughts.length === 0 ? (
              <motion.div
                {...fadeOnly}
                {...transition}
                className="flex flex-col justify-center items-center gap-4 text-xl my-20"
              >
                <h2 className="text-lg text-muted-foreground">
                  No saved thoughts yet.
                </h2>
                <div className="flex flex-col md:flex-row gap-4">
                  <T>
                    <Button link={"/"}>Create New Thought</Button>
                    <Button variant="outline" link={"/thought"}>
                      Take a look at People's Thoughts
                    </Button>
                  </T>
                </div>
              </motion.div>
            ) : (
              thoughts.map((item) => (
                <Moment_Card key={item._id} thought={item} />
              ))
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
