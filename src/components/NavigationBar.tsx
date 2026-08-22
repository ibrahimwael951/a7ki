"use client";

import { motion } from "motion/react";
import { Home, PanelsTopLeft, Mail, MessageCircleQuestionMark } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/moments", icon: PanelsTopLeft, label: "Moments" },
  { href: "/contact", icon: Mail, label: "Contact" },
  { href: "/FAQs", icon: MessageCircleQuestionMark, label: "FAQs" },
 
];

const NavigationBar = () => {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[80%] md:w-fit flex items-center justify-evenly gap-1 bg-neutral-300/10 dark:bg-neutral-600/10 backdrop-blur-2xl border border-white/10 rounded-2xl z-50 p-1.5 shadow-lg shadow-black/5"
    >
      {navItems.map(({ href, icon: Icon, label }) => {
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
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-0 bg-primary rounded-xl"
                />
              )}

              <Icon
                size={22}
                strokeWidth={2.2}
                className={`relative z-10 transition-colors duration-300 ${
                  isActive
                    ? "text-primary-foreground"
                    : "text-neutral-600 dark:text-neutral-300"
                }`}
              />

              <span className="sr-only">{label}</span>
            </motion.div>
          </Link>
        );
      })}
    </motion.div>
  );
};

export default NavigationBar;