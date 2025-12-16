"use client";

import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import { Languages, Mail, Shirt, Sun } from "lucide-react";
import Admin_Loading from "@/components/ui/Admin_Loading";
import { useTheme } from "next-themes";
import Link from "next/link";
import { fadeUp } from "@/Animation";
import { useState } from "react";
import { useIsMobile } from "@/hooks/IsMobile";

const MotionLink = motion.create(Link);

export default function Page() {
  const { data: session, isPending } = useSession();
  const { setTheme, resolvedTheme } = useTheme();
  const [showId, setShowId] = useState(false);
  const isMobile = useIsMobile();

  if (isPending || !session) return <Admin_Loading />;
  return (
    <main className="pt-20 px-6">
      <div className="mb-9">
        <h2 className="text-2xl font-semibold ">
          Hello Mr.<span className="mark">{session?.user.name}</span>
        </h2>
        <p>
          Your Anonymous Id :{" "}
          <span
            onClick={() => setShowId(!showId)}
            className="mark cursor-pointer"
          >
            {showId
              ? session?.user.id
              : `${isMobile ? "Tap" : "Click"} to Show your Id `}
          </span>
        </p>
      </div>
      <section className="mb-10">
        <h3>
          Setting<span className="mark">s</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-5">
          <motion.button
            {...fadeUp}
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="relative p-6 rounded-2xl border border-primary/30 dark:border-primary shadow-sm text-left hover:shadow-lg focus:outline-none duration-200 cursor-pointer disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary dark:bg-primary-foreground text-white">
                <Shirt />
              </div>
              <div>
                <div className="font-semibold text-lg">theme</div>
                <div className="text-sm text-muted-foreground">
                  {`${isMobile ? "Tap" : "Click"} to `}
                  change to{" "}
                  <span className="mark">
                    {" "}
                    {resolvedTheme === "dark" ? "light" : "dark"} mode{" "}
                  </span>
                </div>
              </div>
            </div>
          </motion.button>
          <motion.button
            className="relative p-6 rounded-2xl border border-primary/30 dark:border-primary shadow-sm text-left hover:shadow-lg focus:outline-none duration-200 cursor-pointer disabled:cursor-not-allowed"
            {...fadeUp}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary dark:bg-primary-foreground text-white">
                <Languages />
              </div>
              <div>
                <div className="font-semibold text-lg">Language</div>
                <div className="text-sm text-muted-foreground">
                  Click to change Language
                </div>
              </div>
            </div>
          </motion.button>
        </div>
      </section>
      <section className="mb-10">
        <h3>
          My <span className="mark">Submissions</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-5">
          {[
            {
              title: "Contact Messages",
              href: "/dashboard/Contact_Messages",
              icon: Mail,
            },
            { title: "My Thoughts", href: "/dashboard/Thoughts", icon: Sun },
          ].map((item) => (
            <MotionLink
              key={item.title}
              href={item.href}
              {...fadeUp}
              className="relative p-6 rounded-2xl border border-primary/30 dark:border-primary shadow-sm text-left hover:shadow-lg duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary dark:bg-primary-foreground text-white">
                  <item.icon />
                </div>
                <div>
                  <div className="font-semibold text-lg">{item.title}</div>
                  <div className="text-sm text-muted-foreground">
                    Click to show
                  </div>
                </div>
              </div>
            </MotionLink>
          ))}
        </div>
      </section>
    </main>
  );
}
