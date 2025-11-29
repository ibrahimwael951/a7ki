"use client";
import { fadeOnly, fadeUp, transition } from "@/Animation";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { useRive } from "@rive-app/react-canvas";

const Hero = () => {
  const { RiveComponent } = useRive({
    src: "/Cat.riv",
    autoplay: true,
    stateMachines: "State Machine 1",
  });

  return (
    <section className="h-screen flex flex-col md:flex-row  justify-center items-center text-center  overflow-hidden ">
      <motion.div
        {...fadeOnly}
        transition={{ ...transition, delay: 0.1 }}
        className="w-full md:w-2/5 h-96 md:h-full"
      >
        <RiveComponent />
      </motion.div>
      <div className="flex flex-col justify-center items-center gap-2">
        <motion.h1
          {...fadeUp}
          transition={{ ...transition, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl max-w-3xl "
        >
          Measure. Reduce. Report. With AI.
        </motion.h1>
        <motion.p
          {...fadeUp}
          transition={{ ...transition, delay: 0.2 }}
          className="md:text-lg lg:text-xl max-w-2xl "
        >
          Smarter carbon management software that helps your business cut
          emissions and stay compliant — automatically.
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
    </section>
  );
};

export default Hero;
