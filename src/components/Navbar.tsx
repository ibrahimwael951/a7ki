"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { HeartHandshake, User } from "lucide-react";
import { fadeDown, transition } from "@/Animation";
import { useIsMobile } from "@/hooks/IsMobile";
import { useAdmin } from "@/providers/AdminContext";
import { useGT } from "gt-next";
import { ThemeSelect } from "./ui/ThemeButton";
import LocaleSelector from "./LanguageSelector";

const Navbar = () => {
  const [menu, setMenu] = useState<Boolean>(false);
  const isMobile = useIsMobile();
  const t = useGT();
  const { isAdmin } = useAdmin();

  return (
    <>
      <motion.div
        initial={{ y: "-100%", opacity: 0 }}
        animate={{
          y: 0,
          height: isMobile ? (menu ? "165px" : "fit-content") : "fit-content",
          opacity: 1,
        }}
        transition={{
          y: { type: "spring", stiffness: 260, damping: 24 },
          opacity: { duration: 0.4 },
          height: { duration: 0.3, ease: "easeInOut" },
        }}
        whileHover="Show"
        className="fixed top-3 left-2/4 -translate-x-2/4 w-full! max-w-[95%] lg:max-w-4xl z-50 bg-neutral-300/10 dark:bg-neutral-600/10 backdrop-blur-2xl rounded-2xl"
      >
        <div className="w-full px-5 py-2.5 flex justify-between items-center gap-5 z-20 ">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href={"/"}
              className="flex justify-center items-center gap-2 text-xl font-bold"
            >
              <HeartHandshake
                size={35}
                className="text-primary dark:text-primary-foreground"
              />
              A7KI
            </Link>
          </motion.div>
          <Button className="hidden md:inline" link={isAdmin ? "/Admin/dashboard" : "/dashboard"}>
            <User />
          </Button>
          {/* Menu Button — hamburger morphs into an X */}
          <Button onClick={() => setMenu(!menu)} className="md:hidden">
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 cursor-pointer"
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={
                  menu
                    ? { d: "M6 6L18 18", translateY: 0 }
                    : { d: "M3.75 9h16.5", translateY: 0 }
                }
                transition={{ duration: 0.25, ease: "easeInOut" }}
              />
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={
                  menu
                    ? { d: "M6 18L18 6", opacity: 1 }
                    : { d: "M3.75 15.75h16.5", opacity: 1 }
                }
                transition={{ duration: 0.25, ease: "easeInOut" }}
              />
            </motion.svg>
          </Button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {isMobile && menu && (
          <motion.div
            id="Menu_links"
            {...fadeDown}
            className="fixed top-19 left-2/4 -translate-x-2/4 w-full max-w-[90%] md:max-w-4xl h-fit z-50 md:justify-end flex px-5"
          >
            <motion.div
              {...fadeDown}
              transition={{ ...transition }}
              className="mb-3 flex flex-col justify-center items-center md:items-end md:flex-row md:justify-between gap-2 w-full"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full"
              >
                <Button
                  link={isAdmin ? "/Admin/dashboard" : "/dashboard"}
                  variant={"outline"}
                  onClick={() => setMenu(false)}
                  className="w-full"
                >
                  {t("Dashboard")}
                </Button>
              </motion.div>
              <div className="flex justify-center items-center md:flex-col md:items-end gap-2 w-full md:w-2/4">
                <LocaleSelector />
                <ThemeSelect className="w-full bg-primary text-white dark:bg-primary-foreground hover:bg-primary dark:hover:bg-primary-foreground" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
