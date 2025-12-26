"use client";
import { fadeUp, transition } from "@/Animation";
import SimpleTitle from "./ui/SimpleTitle";
import { motion } from "motion/react";
import { useFeatures } from "@/data/Features";
import Image from "next/image";
import { T, useGT } from "gt-next";

const MotionImage = motion.create(Image);
const Features = () => {
  const t = useGT();
  const features = useFeatures();
  return (
    <section className="min-h-screen max-w-7xl mx-auto">
      <SimpleTitle title={t("Features")} whileHover />
      <div className="flex flex-col md:flex-row gap-5 my-3 justify-between items-center">
        <T>
          <motion.h1
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2, margin: "-100px" }}
            {...transition}
          >
            What Makes A7KI Different
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2, margin: "-100px" }}
            {...transition}
          >
            A7KI gives you a private space to speak freely, read others’
            stories, and feel supported — all without revealing who you are.
          </motion.p>
        </T>
      </div>
      <section className="min-h-[70vh] w-full flex flex-col lg:flex-row justify-center items-center gap-10">
        <div className="w-full lg:w-2/4 h-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((item) => (
            <motion.div
              key={item.label}
              variants={fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2, margin: "-100px" }}
              whileHover={{ y: -5 }}
              className="group w-full h-44 md:h-full flex flex-col justify-between items-start border-2 border-primary/30 dark:border-primary hover:bg-primary hover:text-primary-foreground overflow-hidden p-4 rounded-xl transition-colors duration-200"
            >
              <item.icon
                size={40}
                className="mb-4 group-hover:rotate-45 text-primary dark:text-primary-foreground group-hover:text-primary-foreground transition-transform duration-300"
              />
              <div>
                <h6 className="text-primary dark:text-primary-foreground group-hover:text-primary-foreground">
                  {item.label}
                </h6>
                <p className="group-hover:text-white/60!">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <MotionImage
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2, margin: "-100px" }}
          src={"/Happy_2Girls.jpg"}
          alt="2 happy girls"
          draggable={false}
          width={1000}
          height={1000}
          className="w-full lg:w-2/4 min-h-96 h-full rounded-2xl overflow-hidden object-cover"
        />
      </section>
    </section>
  );
};

export default Features;
