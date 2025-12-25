"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { mainLinks } from "@/data/MainLinks";
import Link from "next/link";
import { Button } from "./ui/button";
import { HeartHandshake, UserRound, UserStar } from "lucide-react";
import { fadeDown, transition } from "@/Animation";
import TextAnimated from "./ui/TextAnimated";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/IsMobile";
import { useAdmin } from "@/providers/AdminContext";

const Navbar = () => {
  const [menu, setMenu] = useState<Boolean>(false);
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const { isAdmin, loadingAdmin } = useAdmin();
  return (
    <>
      <motion.div
        initial={{ y: "-100%" }}
        animate={{
          y: 0,
          height: isMobile ? (menu ? "325px" : "fit-content") : "fit-content",
        }}
        {...transition}
        whileHover="Show"
        className="fixed top-3 left-2/4 -translate-x-2/4 w-full! max-w-[90%] lg:max-w-4xl z-50 bg-neutral-300/10 dark:bg-neutral-600/10 backdrop-blur-2xl rounded-2xl"
      >
        <div className="w-full px-5 py-2.5 flex justify-between items-center gap-5 z-20 ">
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

          <div className="hidden md:flex justify-center items-center gap-4 ">
            {mainLinks.map((item) => (
              <div key={item.label} className="relative">
                <TextAnimated href={item.href}>{item.label}</TextAnimated>
                <motion.div
                  variants={{
                    Show: { width: pathname == item.href ? "100%" : "0%" },
                  }}
                  transition={{ duration: 0.1 }}
                  className={` mx-auto w-0 h-0.5 bg-accent dark:bg-primary-foreground  `}
                />
              </div>
            ))}
          </div>

          <div className="hidden md:flex justify-center items-center gap-3">
            {!loadingAdmin && isAdmin ? (
              <Button link={"/Admin/dashboard"}>
                <UserStar />
              </Button>
            ) : (
              <Button link={"/dashboard"}>
                <UserRound />
              </Button>
            )}
            {pathname != "/send" && (
              <Button link={"/send"}>Send Message</Button>
            )}
          </div>

          {/* Mobile Button */}

          <Button onClick={() => setMenu(!menu)} className="md:hidden">
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
        </div>
      </motion.div>
      <AnimatePresence mode="wait">
        {isMobile && menu && (
          <motion.div
            id="Menu_links"
            {...fadeDown}
            className="fixed top-19 left-2/4 -translate-x-2/4 w-full max-w-[90%] h-fit md:hidden z-50"
          >
            <div className="flex flex-col justify-start items-center space-y-2 p-5">
              {mainLinks.map((item) => (
                <Link
                  key={item.label}
                  onClick={() => setMenu(false)}
                  href={item.href}
                  className={`relative text-center w-full rounded-2xl py-1.5 px-3 overflow-hidden 
                    ${pathname == item.href && "text-white"}
                    `}
                >
                  <motion.div
                    id="Link_BG"
                    initial={{ width: "0px" }}
                    exit={{ width: "0px" }}
                    animate={{
                      width: menu && pathname == item.href ? "100%" : "0px",
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-0 h-full absolute top-0 left-2/4 -translate-x-2/4 bg-primary dark:bg-primary-foreground -z-10"
                  />

                  {item.label}
                </Link>
              ))}
            </div>
            <motion.div
              {...fadeDown}
              transition={{ ...transition, delay: 0.3 }}
              className="mb-3 flex justify-center items-center gap-2 px-4"
            >
              <Button
                link={isAdmin ? "/Admin/dashboard" : "/dashboard"}
                variant={"outline"}
                onClick={() => setMenu(false)}
                className="w-2/4"
              >
                Dashboard
              </Button>
              <Button
                link={"/send"}
                onClick={() => setMenu(false)}
                className="w-2/4"
              >
                Send Message
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
