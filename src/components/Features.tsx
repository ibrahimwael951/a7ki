"use client";
import { fadeUp, transition } from "@/Animation";
import SimpleTitle from "./ui/SimpleTitle";
import { motion } from "motion/react";
import { features } from "@/data/Features";
import Image from "next/image";

const MotionImage = motion.create(Image);
const Features = () => {
  return (
    <section className="min-h-screen max-w-7xl mx-auto">
      <SimpleTitle title="Features" whileHover />
      <div className="flex flex-col md:flex-row gap-5 my-3 justify-between items-center">
        <motion.h1
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          {...transition}
        >
          All the features, none of the headaches
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          {...transition}
        >
          We’ve bundled everything you need to track, understand, and shrink
          your footprint without the usual hassle.
        </motion.p>
      </div>
      <section className="min-h-[70vh] w-full flex flex-col lg:flex-row justify-center items-center gap-10 mt-10">
        <div className="w-full md:w-2/4 h-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((item) => (
            <motion.div
              key={item.label}
              variants={fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group w-full h-44 md:h-full flex flex-col justify-between items-start bg-primary text-primary-foreground overflow-hidden p-4 rounded-xl "
            >
              <item.icon
                size={40}
                className="mb-4 group-hover:rotate-45 duration-300"
              />
              <div>
                <h6>{item.label}</h6>
                <p className="text-secondary-foreground /80!">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <MotionImage
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          src={"/Happy_2Girls.jpg"}
          alt="2 happy girls"
          draggable={false}
          width={1000}
          height={1000}
          className="w-full md:w-2/4 min-h-96 h-full rounded-2xl overflow-hidden object-cover"
        />
      </section>
    </section>
  );
};

export default Features;
