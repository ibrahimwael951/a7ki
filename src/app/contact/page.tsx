"use client";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import SimpleTitle from "@/components/ui/SimpleTitle";
import { useRive } from "@rive-app/react-canvas";
import { fadeUp, transition } from "@/Animation";
import FAQ from "@/components/FAQ";

export default function Page() {
  const { RiveComponent } = useRive({
    src: "/Animated_Images/Black-Cat.riv",
    autoplay: true,
    stateMachines: "State Machine 1",
  });

  return (
    <main className="pt-24">
      <div className="flex flex-col justify-center items-center gap-2 text-center">
        <SimpleTitle title="Contact" className="mb-7" />
        <motion.h1 {...fadeUp} transition={{ ...transition }}>
          Contact Us
        </motion.h1>
        <motion.p {...fadeUp} transition={{ ...transition, delay: 0.1 }}>
          Carbon footprints may be complicated, but talking to us isn’t.
        </motion.p>
      </div>
      <section className="mt-5 flex flex-col md:flex-row justify-center gap-5">
        <div className="w-full md:w-2/5">
          <motion.h3
            {...fadeUp}
            transition={{ ...transition, delay: 0.3 }}
            className="mb-3"
          >
            We’d love to hear from you
          </motion.h3>
          <motion.p
            {...fadeUp}
            transition={{ ...transition, delay: 0.4 }}
            className="max-w-sm"
          >
            Got questions? Ideas? A burning desire to show us your electricity
            bill? Drop us a line.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ ...transition, delay: 0.5 }}
            className="relative w-full h-96 mt-5 overflow-hidden rounded-lg"
          >
            <div className="w-full h-full scale-150">
              <RiveComponent />
            </div>
          </motion.div>
        </div>
        <form className="w-full md:w-3/5 flex flex-col justify-center items-center gap-3 bg-primary p-10 rounded-lg">
          <motion.div
            {...fadeUp}
            transition={{ ...transition, delay: 0.6 }}
            className="w-full flex flex-col justify-start items-start"
          >
            <label className="text-primary-foreground">Name</label>
            <input
              type="type"
              placeholder="Your FullName "
              className="w-full p-2.5 rounded-lg bg-neutral-300/50 dark:bg-neutral-700/50 mt-3 mb-1.5 outline-none border-2 border-neutral-300/50 dark:border-neutral-700/50 focus:bg-transparent dark:focus:bg-transparent duration-200"
            />
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ ...transition, delay: 0.7 }}
            className="w-full flex flex-col justify-start items-start"
          >
            <label className="text-primary-foreground">Email</label>
            <input
              type="email"
              placeholder="Your@gmail.com"
              className="w-full p-2.5 rounded-lg bg-neutral-300/50 dark:bg-neutral-700/50 mt-3 mb-1.5 outline-none border-2 border-neutral-300/50 dark:border-neutral-700/50 focus:bg-transparent dark:focus:bg-transparent duration-200"
            />
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ ...transition, delay: 0.8 }}
            className="w-full flex flex-col justify-start items-start"
          >
            <label className="text-primary-foreground">Message</label>
            <textarea
              placeholder="Your Message"
              rows={5}
              className="w-full p-2.5 rounded-lg bg-neutral-300/50 dark:bg-neutral-700/50 mt-3 mb-1.5 outline-none resize-none border-2 border-neutral-300/50 dark:border-neutral-700/50 focus:bg-transparent dark:focus:bg-transparent duration-200"
            />
          </motion.div>
          <Button
            variant={"secondary"}
            type="submit"
            className="w-full text-primary-foreground"
          >
            Send Message
          </Button>
        </form>
      </section>
      <FAQ />
    </main>
  );
}
