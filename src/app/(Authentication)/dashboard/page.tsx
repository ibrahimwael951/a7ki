"use client";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import { Mail, Sun } from "lucide-react";
import Admin_Loading from "@/components/ui/Admin_Loading";
import Link from "next/link";
import { fadeUp } from "@/Animation";
import { useState } from "react";
import { useIsMobile } from "@/hooks/IsMobile";
import { T, useGT } from "gt-next";
import System_Setting from "@/components/dashboard/System_Setting";

const MotionLink = motion.create(Link);

export default function Page() {
  const { data: session, isPending } = useSession();
  const [showId, setShowId] = useState(false);
  const isMobile = useIsMobile();
  const t = useGT();

  if (isPending || !session) return <Admin_Loading />;
  return (
    <main className="pt-20 px-6">
      <div className="mb-9">
        <T>
          <h2 className="text-2xl font-semibold ">
            Hello Mr.<span className="mark"> Anonymous </span>
          </h2>
        </T>
        <p>
          {t("Your Anonymous Id")} :{" "}
          <span
            onClick={() => setShowId(!showId)}
            className="mark cursor-pointer"
          >
            {showId
              ? session?.user.id
              : t(`${isMobile ? "Tap" : "Click"} to Show your Id `)}
          </span>
        </p>
      </div>

      <System_Setting />

      <section className="mb-10">
        <T>
          <h3>
            My <span className="mark">Submissions</span>
          </h3>
        </T>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-5">
          {[
            {
              title: t("Contact Messages"),
              href: "/dashboard/Contact_Messages",
              icon: Mail,
            },
            { title: t("My Thoughts"), href: "/dashboard/Thoughts", icon: Sun },
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
                <div className="text-start">
                  <div className="font-semibold text-lg">{item.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {t(`View and manage your ${item.title.toLowerCase()}`)}
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
