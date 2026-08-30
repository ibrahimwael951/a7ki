"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  Home,
  PanelsTopLeft,
  Mail,
  MessageCircleQuestionMark,
  HeartHandshake,
  User,
  Bookmark,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useIsMobile } from "@/hooks/IsMobile";
import { useAdmin } from "@/providers/AdminContext";
import { useGT } from "gt-next";
import LocaleSelector from "./LanguageSelector";
import { ThemeSelect } from "./ui/ThemeButton";
import { fadeDown, transition } from "@/Animation";
import { Button } from "./ui/button";

const NavigationBar = () => {
  const [menu, setMenu] = useState<Boolean>(false);
  const isMobile = useIsMobile();
  const t = useGT();
  const { isAdmin } = useAdmin();
  const pathname = usePathname();

  const DesktopLinks = [
    { href: "/", icon: Home, label: t("Home") },
    { href: "/thought", icon: PanelsTopLeft, label: t("People Thoughts") },
    { href: "/contact", icon: Mail, label: t("Contact Us") },
    { href: "/FAQs", icon: MessageCircleQuestionMark, label: t("FAQs") },
  ];
  const MobileLinks = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/contact", icon: Mail, label: "Contact" },
    { href: "/thought", icon: PanelsTopLeft, label: "People Thoughts" },
    { href: "/Saved", icon: Bookmark, label: "Saved" },
    {
      href: isAdmin ? "/Admin/dashboard" : "/dashboard",
      icon: User,
      label: "profile",
    },
  ];
  return (
    <>
      {/* ---------Nav Bar----------- */}
      <motion.div
        initial={{ y: "-100%", opacity: 0 }}
        animate={{
          y: 0,
          height: isMobile ? (menu ? "245px" : "fit-content") : "fit-content",
          opacity: 1,
        }}
        transition={{
          y: { type: "spring", stiffness: 260, damping: 24 },
          opacity: { duration: 0.4 },
          height: { duration: 0.3, ease: "easeInOut" },
        }}
        whileHover="Show"
        className="fixed top-1 left-2/4 -translate-x-2/4 w-full! max-w-[97%] lg:max-w-4xl z-50 md:bg-neutral-300/10 md:dark:bg-neutral-600/10 md:backdrop-blur-2xl rounded-2xl"
      >
        <div className="w-full px-3 py-2 flex justify-between items-center gap-5 z-20 ">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href={"/"}
              className="flex justify-center items-center gap-2 text-xl font-bold px-5 py-2.5 md:p-0 bg-neutral-300/10 dark:bg-neutral-600/10 backdrop-blur-2xl md:bg-transparent md:dark:bg-transparent md:backdrop-blur-none rounded-2xl"
            >
              <HeartHandshake
                size={35}
                className="text-primary dark:text-primary-foreground"
              />
              A7KI
            </Link>
          </motion.div>
          {!isMobile && (
            <>
              <div className="flex justify-center items-center gap-2">
                {DesktopLinks.map((item) => (
                  <Button
                    link={item.href}
                    key={item.label}
                    variant={pathname == item.href ? "default" : "ghost"}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>

              <Button
                size={"lg"}
                link={isAdmin ? "/Admin/dashboard" : "/dashboard"}
              >
                <Settings size={30} />
              </Button>
            </>
          )}
        </div>
      </motion.div>

      {/* ----------Navbar mobile Menu------  */}
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
              className="mb-3 flex flex-col justify-center items-center md:items-end md:flex-row md:justify-between gap-4 w-full"
            >
              <div className="w-full flex flex-col justify-center items-center gap-2">
                {[]}
              </div>
              <div className="flex justify-center items-center md:flex-col md:items-end gap-2 w-full md:w-2/4">
                <LocaleSelector />
                <ThemeSelect className="w-full bg-primary text-white dark:bg-primary-foreground hover:bg-primary dark:hover:bg-primary-foreground" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- Navigation bottom bar ----------------- */}
      {isMobile && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="fixed bottom-2 left-1/2 -translate-x-1/2 w-[97%] md:w-fit flex items-center justify-between gap-5 bg-neutral-300/10 dark:bg-neutral-600/10 backdrop-blur-2xl border border-white/10 rounded-2xl z-50 p-1.5 shadow-lg shadow-black/5"
        >
          {MobileLinks.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;

            return (
              <Link key={href} href={href} className="relative">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="relative flex items-center justify-center w-12 h-12 rounded-xl"
                >
                  {/* Sliding active pill — layoutId makes it glide between icons */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                      className="absolute inset-0 bg-primary dark:bg-primary-foreground rounded-xl"
                    />
                  )}

                  <Icon
                    size={22}
                    strokeWidth={2.2}
                    className={`relative z-10 transition-colors duration-300 ${
                      isActive
                        ? "text-primary-foreground dark:text-accent-foreground"
                        : "text-accent-foreground dark:text-accent-foreground"
                    }`}
                  />

                  <span className="sr-only">{label}</span>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      )}
    </>
  );
};

export default NavigationBar;
