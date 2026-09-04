"use client";
import Link from "next/link";
import { Eye, User } from "lucide-react";
import { Thought } from "@/types/Thoughts";
import { motion, type Variants } from "motion/react";
import { fadeOnly } from "@/Animation";

const MotionLink = motion.create(Link);

const blobVariants: Variants = {
  rest: {
    width: 0,
    height: 0,
  },
  hover: {
    width: "120%",
    height: 300,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function Moment_Card({ thought }: { thought: Thought }) {
  return (
    <MotionLink
      {...fadeOnly}
      initial="rest"
      whileHover="hover"
      animate="rest"
      href={`/thought/${thought._id}`}
      className="relative rounded-xl border-2 border-neutral-300/50 dark:border-neutral-700/50 p-4 duration-100 h-full flex flex-col justify-between overflow-hidden"
    >
      <motion.div
        variants={blobVariants}
        className="absolute bottom-0 left-0 bg-neutral-300/50 dark:bg-primary rounded-r-full -z-10"
      />
      <div>
        {thought.userName && (
          <div className="flex items-center gap-1.5 mb-2 text-muted-foreground">
            <User size={13} strokeWidth={3} className="mark" />
            <span className="text-xs font-medium truncate">
              {thought.userName}
            </span>
          </div>
        )}

        <p
          dir="auto"
          className="text-sm text-foreground! leading-relaxed line-clamp-5 whitespace-pre-wrap wrap-break-word"
        >
          {thought.thought}
        </p>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-300/40 dark:border-neutral-700/40">
        <div className="flex items-center gap-2">
          <span className="text-xs mark">
            {new Date(thought.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Eye size={14} className="mark" />
          <span>{thought.views ?? 0}</span>
        </div>
      </div>
    </MotionLink>
  );
}
