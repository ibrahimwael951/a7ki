"use client";
import { fadeUp, transition } from "@/Animation";
import { FAQ_Questions } from "@/data/FAQ";
import { Forward } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import React, { useState } from "react";

const FAQ = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  return (
    <section className="flex flex-col md:flex-row justify-between gap-4 my-10 ">
      <div className="w-full md:w-2/4 max-w-xl">
        <motion.h3
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px", amount: 0.2 }}
          {...transition}
        >
          Frequently Asked Questions
        </motion.h3>
        <motion.p
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px", amount: 0.2 }}
          {...transition}
        >
          See if we've answered you question already. If not then don't hesitate
          to get in touch
        </motion.p>
      </div>
      <div className="w-full md:w-2/4 flex flex-col justify-start gap-4">
        {FAQ_Questions.map((item) => (
          <motion.div
            key={item.label}
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            {...transition}
            onClick={() =>
              setOpenFaq(
                openFaq === FAQ_Questions.indexOf(item)
                  ? null
                  : FAQ_Questions.indexOf(item)
              )
            }
            className={`${
              openFaq == FAQ_Questions.indexOf(item) ? " h-24" : " h-16"
            }  cursor-pointer duration-300`}
          >
            <div className="flex justify-between items-center gap-2">
              <h4>{item.label}</h4>
              <Forward
                className={`${
                  openFaq == FAQ_Questions.indexOf(item)
                    ? "rotate-180"
                    : "rotate-0 "
                }
                duration-300
                `}
              />
            </div>
            <AnimatePresence>
              {openFaq == FAQ_Questions.indexOf(item) && (
                <motion.p {...fadeUp}>{item.description}</motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
