"use client";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { fadeUp, transition } from "@/Animation";

const Ready = () => {
  return (
    <section className="text-center my-20">
      <motion.h2
        variants={fadeUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2, margin: "-100px" }}
        {...transition}
        className="text-3xl font-semibold mb-3"
      >
        Ready to Share Your Story?
      </motion.h2>
      <motion.p
        variants={fadeUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2, margin: "-100px" }}
        {...transition}
        className="text-muted-foreground mb-6"
      >
        One message could be all you need to breathe a little easier.
      </motion.p>
      <Button link="/send">Send Your Message</Button>
    </section>
  );
};

export default Ready;
