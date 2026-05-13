"use client";
import { motion, AnimatePresence } from "motion/react";
import { useMainLinks } from "@/data/MainLinks";
import { HeartHandshake } from "lucide-react";
import TextAnimated from "./ui/TextAnimated";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { fadeOnly, transition } from "@/Animation";
import { usePathname } from "next/navigation";
import { T, useGT } from "gt-next";

const Footer = () => {
  const pathName = usePathname();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const mainLinks = useMainLinks();
  const t = useGT();
  const handleSubscribe = async (email: string) => {
    if (!email || !email.includes("@"))
      return toast.error("Please enter a valid email", {
        position: "bottom-right",
      });
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (res.ok) toast.success("Subscribed!", { position: "bottom-right" });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong, try again later! ", {
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };
  if (pathName == "/send") return;
  if (pathName.slice(0, 6) == "/Admin") return;
  if (pathName.slice(0, 10) == "/dashboard") return;
  return (
    <footer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-5 md:px-10 min-h-96 mb-10 mt-20 max-w-7xl mx-auto">
      <div className="max-w-72 h-full text-start">
        <T>
          <h2 className="flex justify-start items-center gap-2">
            <HeartHandshake
              size={45}
              className="text-primary dark:text-primary-foreground"
            />
            A7KI
          </h2>
          <p>
            A safe space to share, connect, and lighten your emotional load.
            Read, relate, and let someone know they're not alone, all in
            privacy.
          </p>
        </T>
      </div>
      <div>
        <h3>{t("Sitemap")}</h3>
        <div className="flex flex-col justify-center items-start gap-2">
          {mainLinks.map((item) => (
            <TextAnimated
              key={item.label}
              href={item.href}
              className="text-neutral-600/80 dark:text-neutral-400/80 text-xl"
            >
              {item.label}
            </TextAnimated>
          ))}
        </div>
      </div>
      <div>
        <h4>{t("Newsletter")}</h4>
        <div className="flex flex-col justify-center items-start gap-2 w-60">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div id={"Loading"} {...fadeOnly} {...transition}>
                Loading...
              </motion.div>
            ) : (
              <motion.div
                id={"form"}
                {...fadeOnly}
                {...transition}
                className="w-full flex flex-col justify-center items-start"
              >
                <input
                  placeholder="your@gmail.com"
                  className="w-full p-2.5 rounded-lg bg-neutral-300/50 dark:bg-neutral-700/50 mt-3 mb-1.5 outline-none border-2 border-neutral-300/50 dark:border-neutral-700/50 focus:bg-transparent dark:focus:bg-transparent duration-200"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  onClick={() => handleSubscribe(email)}
                  className="w-full"
                >
                  {t("Subscribe")}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <p className="text-sm! mt-20 col-span-full text-center">
        &copy; {new Date().getFullYear()}{" "}
        <T>
          <span className="text-accent-foreground font-semibold">A7KI</span>.
          All rights reserved.
        </T>{" "}
      </p>
    </footer>
  );
};

export default Footer;
