"use client";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { fadeUp, transition } from "@/Animation";

interface Props {
  className?: string;
  title: string;
  whileHover?: boolean;
}
const SimpleTitle = ({ title, className, whileHover = false }: Props) => {
  return (
    <motion.div
      variants={fadeUp}
      initial="initial"
      animate={whileHover ? "" : "animate"}
      whileInView={whileHover ? "animate" : ""}
      viewport={whileHover ? { once: true } : {}}
      {...transition}
      className={cn(
        "w-fit px-3 py-2 bg-primary text-primary-foreground rounded-xl text-center",
        className
      )}
    >
      {title}
    </motion.div>
  );
};

export default SimpleTitle;
