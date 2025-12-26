"use client";
import { motion } from "motion/react";
import SimpleTitle from "@/components/ui/SimpleTitle";
import { useRive } from "@rive-app/react-canvas";
import { fadeRight, fadeUp, transition } from "@/Animation";
import Ready from "@/components/Ready";
import { useState } from "react";
import { T, useGT } from "gt-next";

export default function Page() {
  const t = useGT();
  const { rive, RiveComponent } = useRive({
    src: "/Animated_Images/Just_Track.riv",
    stateMachines: "drive",
    autoplay: true,
  });
  const [hit, setHit] = useState<boolean>(false);

  function playBounce() {
    rive?.play("bounce");
  }

  return (
    <main className="relative min-h-screen mt-24 flex flex-col items-center gap-20 ">
      <section className="flex flex-col md:flex-row justify-center items-center gap-5 w-full">
        <div className="w-full md:w-2/4 text-center max-w-3xl">
          <SimpleTitle title={t("About")} className="mx-auto" />
          <T>
            <motion.h1
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ ...transition }}
              className="text-4xl font-bold mb-4"
            >
              About A7KI
            </motion.h1>
            <motion.p
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ ...transition, delay: 0.1 }}
              className="text-lg text-muted-foreground"
            >
              A7KI is a safe and anonymous space where people can share their
              thoughts, heavy moments, and personal stories without fear of
              being judged. We built this platform to make opening up easier —
              because sometimes talking is the first step to feeling lighter.
            </motion.p>
          </T>
        </div>

        <motion.div
          variants={fadeRight}
          initial="initial"
          animate="animate"
          transition={{ ...transition, delay: 0.2 }}
          className="relative h-[400px] w-full md:w-2/4 max-w-2xl rounded-3xl overflow-hidden bg-primary/65 cursor-pointer"
          onClick={() => playBounce()}
        >
          <p className="absolute bottom-5 right-5">
            {hit ? ": |" : t("don't hit!")}
          </p>
          <RiveComponent onClick={() => setHit(true)} />
        </motion.div>
      </section>
      <section className="max-w-4xl text-center flex flex-col gap-6 leading-relaxed">
        <T>
          <motion.p
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2, margin: "-100px" }}
            {...transition}
          >
            Here, you don’t need to show your face, name, or identity. Just say
            what’s on your mind. Whether you're dealing with stress, heartbreak,
            confusion, or simply need someone to listen — A7KI gives you the
            space to express it all.
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2, margin: "-100px" }}
            {...transition}
          >
            We believe that sharing what's inside helps you heal, understand
            yourself better, and connect with others going through the same
            feelings. A simple message can lift a huge emotional weight.
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2, margin: "-100px" }}
            {...transition}
          >
            Your privacy comes first. We don’t track personal info, store
            unnecessary data, or try to guess who you are. Your words belong to
            you — and only you.
          </motion.p>
        </T>
      </section>
      <Ready />
    </main>
  );
}
