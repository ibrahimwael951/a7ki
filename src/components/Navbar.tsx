"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { mainLinks } from "@/data/MainLinks";
import Link from "next/link";
import { Button } from "./ui/button";
import { HeartHandshake } from "lucide-react";
import { ThemeButton } from "./ui/ThemeButton";
import { AnimatePresence } from "motion/react";
import { fadeDown, transition } from "@/Animation";

const Navbar = () => {
  const [menu, setMenu] = useState<Boolean>(false);
  return (
    <>
      <motion.div
        initial={{ y: "-100%" }}
        animate={{ y: 0 }}
        {...transition}
        className="fixed top-3 left-2/4 -translate-x-2/4 w-full! max-w-[90%] lg:max-w-4xl z-40 bg-neutral-300/10 dark:bg-neutral-600/10 backdrop-blur-2xl rounded-2xl"
      >
        <div className="w-full px-5 py-2.5 flex justify-between items-center gap-5 z-20 ">
          <Link href={"/"} className="flex justify-center items-center gap-2">
            <HeartHandshake size={35} />
            A7KI
          </Link>

          <div className="hidden md:flex justify-center items-center gap-4 ">
            {mainLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative group overflow-hidden"
              >
                <div className="group-hover:-translate-y-full duration-150">
                  {item.label}
                </div>
                <div className="absolute top-2/4 left-2/4 -translate-x-2/4 translate-y-full group-hover:-translate-y-2/4 duration-150">
                  {item.label}
                </div>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex justify-center items-center gap-3">
            <ThemeButton />
            <Button link={"/send"}>Send Message</Button>
          </div>

          {/* Mobile Button */}
          <div className="flex justify-center items-center gap-2 md:hidden">
            <Button variant={"ghost"} onClick={() => setMenu(!menu)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 cursor-pointer "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 9h16.5m-16.5 6.75h16.5"
                />
              </svg>
            </Button>
            <ThemeButton />
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {menu && (
          <motion.div
            {...fadeDown}
            className="fixed top-20 left-2/4 -translate-x-2/4 w-full max-w-[90%] h-fit bg-neutral-300/10 dark:bg-neutral-600/10 backdrop-blur-2xl rounded-2xl md:hidden z-40"
          >
            <div className="flex flex-col justify-start items-center space-y-2 py-4">
              {mainLinks.map((item) => (
                <Link
                  key={item.label}
                  onClick={() => setMenu(false)}
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
