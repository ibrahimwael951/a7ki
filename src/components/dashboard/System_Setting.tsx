"use client";
import { Languages, Shirt } from "lucide-react";
import LocaleSelector from "@/components/LanguageSelector";
import { ThemeSelect } from "@/components/ui/ThemeButton";
import { motion } from "framer-motion";
import { fadeUp, transition } from "@/Animation";
import { T, useGT } from "gt-next";
import { useIsMobile } from "@/hooks/IsMobile";

const System_Setting = () => {
  const isMobile = useIsMobile();
  const t = useGT();

  return (
    <section className="my-10">
      <motion.h3 {...fadeUp} transition={{ ...transition, delay: 0.3 }}>
        {t("System Setting")}
      </motion.h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-5">
        <motion.div
          {...fadeUp}
          className="relative p-6 rounded-2xl flex items-start lg:items-center gap-3 border border-primary/30 dark:border-primary shadow-sm text-left hover:shadow-lg focus:outline-none duration-200 disabled:cursor-not-allowed"
        >
          <div className="p-4 rounded-xl bg-primary/20 dark:bg-primary-foreground/5">
            <Shirt className="w-8 h-8 text-primary dark:text-primary-foreground" />
          </div>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 w-full">
            <T>
              <div className="text-start">
                <div className="font-semibold text-lg">theme</div>
                <div className="text-sm text-muted-foreground">
                  {`${isMobile ? "Tap" : "Click"} to `}
                  change to <span className="mark"> Theme</span>
                </div>
              </div>
            </T>
            <div className="w-fit">
              <ThemeSelect />
            </div>
          </div>
        </motion.div>
        <motion.div
          className="relative p-6 rounded-2xl flex items-start lg:items-center gap-3 border border-primary/30 dark:border-primary shadow-sm text-left hover:shadow-lg focus:outline-none duration-200 disabled:cursor-not-allowed"
          {...fadeUp}
        >
          <div className="p-4 rounded-xl bg-primary/20 dark:bg-primary-foreground/5">
            <Languages className="w-8 h-8 text-primary dark:text-primary-foreground" />
          </div>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 w-full">
            <div className="text-start">
              <T>
                <div className="font-semibold text-lg">Language</div>
                <div className="text-sm text-muted-foreground">
                  Click to change Language
                </div>
              </T>
            </div>
            <div className="w-fit">
              <LocaleSelector />
            </div>
          </div>
        </motion.div>
      </div>{" "}
    </section>
  );
};

export default System_Setting;
