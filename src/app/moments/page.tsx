"use client";
import { motion } from "motion/react";
import SimpleTitle from "@/components/ui/SimpleTitle";

import { Button } from "@/components/ui/button";
import { fadeUp, transition } from "@/Animation";
import { useRive } from "@rive-app/react-canvas";
import { T, useGT } from "gt-next";

export default function Page() {
  const t = useGT();
  const { RiveComponent } = useRive({
    src: "/Animated_Images/Melted_Cat.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });
  return (
    <main className="relative flex flex-col md:flex-row justify-center items-center gap-10 overflow-hidden">
      <div className="absolute top-2/4 left-2/4 -translate-2/4 w-full h-60 -z-20 opacity-30 dark:opacity-15">
        <RiveComponent className="absolute top-2/4 left-2/4 -translate-2/4 object-cover w-[700px] h-[700px] max-w-5xl min-h-96" />
      </div>
      <div className="w-full text-center">
        <SimpleTitle title={t("Moments")} className="mx-auto" />
        <T>
          <motion.h1
            {...fadeUp}
            transition={{ ...transition, delay: 0.1 }}
            className=" text-6xl! md:text-[100px]! w-full text-center"
          >
            Coming Soon
          </motion.h1>
          <motion.p {...fadeUp} transition={{ ...transition, delay: 0.2 }}>
            Hang tight! The moments will be made public on the announced date.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ ...transition, delay: 0.3 }}
            className="flex items-center justify-center gap-5 mt-5"
          >
            <Button link={"/send"}>Send Message</Button>
            <Button link={"/contact"} variant={"outline"}>
              Contact
            </Button>
          </motion.div>
        </T>
      </div>
    </main>
  );
}
