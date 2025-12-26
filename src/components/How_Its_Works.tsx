"use client";
import { motion } from "motion/react";
import SimpleTitle from "./ui/SimpleTitle";
import { MessageSquare, Clock, BookOpen } from "lucide-react";
import { fadeUp } from "@/Animation";
import { T, useGT } from "gt-next";
const How_Its_Works = () => {
  const t = useGT();

  const Steps = [
    {
      title: t("Share Your Story"),
      description: t(
        "Send your heavy thoughts and difficult moments anonymously. Let it out without judgment."
      ),
      icon: MessageSquare,
    },
    {
      title: t("Wait for the Deadline"),
      description: t(
        "Your story will be reviewed and added before the deadline. Make sure to include your email so we can notify you."
      ),
      icon: Clock,
    },
    {
      title: t("Explore Others’ Stories"),
      description: t(
        "Read what others shared, react to their stories, and leave supportive comments."
      ),
      icon: BookOpen,
    },
  ];

  return (
    <section className="my-20">
      <div className="flex flex-col justify-center items-center gap-2 text-center max-w-xl m-auto mb-6">
        <SimpleTitle title={t("How it works")} />
        <T>
          <motion.h2
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2, margin: "-100px" }}
          >
            Three steps to less carbon (and less stress)
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2, margin: "-100px" }}
          >
            From data to action in less time than it takes to make a coffee.
          </motion.p>
        </T>
      </div>
      <section className="flex flex-wrap justify-center items-center gap-5">
        {Steps.map((item) => (
          <motion.div
            key={item.title}
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2, margin: "-100px" }}
            className="relative group w-xs h-96 p-8 flex flex-col justify-evenly items-center gap-5 text-center rounded-2xl border-2 border-primary/30 dark:border-primary hover:bg-primary duration-200 overflow-hidden cursor-default"
          >
            <item.icon
              size={70}
              className="group-hover:-rotate-12 text-primary dark:text-primary-foreground group-hover:text-primary-foreground transition-transform duration-300"
            />
            <div>
              <h4 className="text-primary dark:text-primary-foreground group-hover:text-primary-foreground">
                {item.title}
              </h4>
              <p className="group-hover:text-white/50!">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </section>
    </section>
  );
};

export default How_Its_Works;
