"use client";
import { fadeOnly, fadeUp, transition } from "@/Animation";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import SimpleTitle from "./ui/SimpleTitle";
import { useRive } from "@rive-app/react-canvas";
import { T, useGT } from "gt-next";

const Hero = () => {
  const { RiveComponent } = useRive({
    src: "/Animated_Images/Cat.riv",
    autoplay: true,
    stateMachines: "State Machine 1",
  });
  const t = useGT();

  return (
    <section className="h-screen flex flex-col md:flex-row  justify-center items-center text-center  overflow-hidden ">
      <motion.div
        {...fadeOnly}
        transition={{ ...transition, delay: 0.1 }}
        className="relative w-full md:w-2/4 h-96 md:h-full"
      >
        <RiveComponent />
      </motion.div>
      <T>
        <div className="w-full md:w-2/4 flex flex-col justify-center items-center gap-2">
          <SimpleTitle title={t("Welcome")} />
          <motion.h1
            {...fadeUp}
            transition={{ ...transition, delay: 0.1 }}
            className="max-w-3xl "
          >
            Share Your Story. Feel Lighter.
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ ...transition, delay: 0.2 }}
            className="max-w-2xl "
          >
            A safe and anonymous place to let out what’s heavy on your mind.
            Tell your story, express your feelings, and find comfort knowing
            someone out there understands.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ ...transition, delay: 0.3 }}
            className="flex justify-center items-center gap-4 lg:scale-125 mt-5 lg:mt-7"
          >
            <Button link="/send" className="">
              Send Your Message
            </Button>
            <Button link="/about" variant={"outline"}>
              About Us
            </Button>
          </motion.div>
        </div>
      </T>
    </section>
  );
};

export default Hero;
