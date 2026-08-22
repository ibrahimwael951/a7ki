"use client";
import { fadeUp, transition } from "@/Animation";
import { useFAQ_Questions } from "@/data/FAQ";
import { Forward } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import React, { useState } from "react";
import SimpleTitle from "./ui/SimpleTitle";
import { usePathname } from "next/navigation";
import { T, useGT } from "gt-next";

const FAQ = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const pathname = usePathname();
  const isContactPage = pathname === "/contact" ? true : false;
  const t = useGT();
  const FAQ_Questions = useFAQ_Questions();
  return (
    <section
      className={`flex ${
        isContactPage
          ? "flex-col md:flex-row justify-between"
          : " flex-col justify-center items-center text-center"
      } gap-4 my-10 `}
    >
      <div className="w-full max-w-xl">
        <SimpleTitle
          title={t("FAQs")}
          className={`mb-3 ${!isContactPage && "mx-auto"} `}
        />
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2, margin: "-100px" }}
          {...transition}
        >
          {isContactPage ? (
            <T>
              <h3>Frequently Asked Questions</h3>
            </T>
          ) : (
            <T>
              <h2>Frequently Asked Questions</h2>
            </T>
          )}
        </motion.div>
        <T>
          <motion.p
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2, margin: "-100px" }}
            {...transition}
          >
            See if we've answered you question already. If not then don't
            hesitate to get in touch
          </motion.p>
        </T>
      </div>
      <div
        className={`w-full ${
          isContactPage ? "md:w-2/4 md:mt-20" : "max-w-xl md:max-w-3xl"
        } flex flex-col justify-start gap-4`}
      >
        {FAQ_Questions.map((item) => (
          <motion.div
            key={item.label}
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2, margin: "-100px" }}
            {...transition}
            onClick={() =>
              setOpenFaq(
                openFaq === FAQ_Questions.indexOf(item)
                  ? null
                  : FAQ_Questions.indexOf(item),
              )
            }
            className={`${
              openFaq == FAQ_Questions.indexOf(item) ? " h-24" : " h-16"
            } max-w-xl cursor-pointer duration-300`}
          >
            <div className="flex justify-between items-center gap-2">
              <h4>{item.label}</h4>
              <Forward
                className={`${
                  openFaq == FAQ_Questions.indexOf(item)
                    ? "rotate-150"
                    : "rotate-0 "
                }
                duration-300
                `}
              />
            </div>
            <AnimatePresence>
              {openFaq == FAQ_Questions.indexOf(item) && (
                <motion.p {...fadeUp} className="text-start w-full">
                  {item.description}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
