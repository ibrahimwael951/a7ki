"use client";
import React from "react";
import { fadeOnly, fadeUp, transition } from "@/Animation";
import { motion } from "motion/react";
import { useRive } from "@rive-app/react-canvas";
import { Button } from "@/components/ui/button";

export default function notFound() {
  const { RiveComponent } = useRive({
    src: "/Animated_Images/404-cat.riv",
    autoplay: true,
  });
  return (
    <main className="flex flex-col md:flex-row justify-center items-center gap-5 ">
      <motion.div
        {...fadeOnly}
        transition={{ ...transition, delay: 0.1 }}
        className="w-full md:w-2/4 h-[500px]   "
      >
        <RiveComponent />
      </motion.div>
      <div className="max-w-xl">
        <motion.h1 {...fadeUp} transition={{ ...transition, delay: 0.1 }}>
          ERROR <span className="text-accent-foreground">404</span>
        </motion.h1>
        <motion.p {...fadeUp} transition={{ ...transition, delay: 0.2 }}>
          Oops! The page you're looking for doesn't exist. But don't worry, our
          curious cat is here to guide you back home.
        </motion.p>
        <motion.div
          {...fadeUp}
          transition={{ ...transition, delay: 0.3 }}
          className="flex items-center gap-4 mt-5"
        >
          <Button link="/">Home</Button>
          <Button link="/contact">Contact Support</Button>
        </motion.div>
      </div>
    </main>
  );
}
