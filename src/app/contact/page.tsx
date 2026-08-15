"use client";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import SimpleTitle from "@/components/ui/SimpleTitle";
import { useRive } from "@rive-app/react-canvas";
import { fadeOnly, fadeUp, transition } from "@/Animation";
import FAQ from "@/components/FAQ";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";
import { T, useGT } from "gt-next";

export default function Page() {
  const t = useGT();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { data: session } = useSession();
  const [form, setForm] = useState({
    message: "",
    name: "",
    email: "",
    company: "",
  });
  const { RiveComponent } = useRive({
    src: "/Animated_Images/Black-Cat.riv",
    autoplay: true,
    stateMachines: "State Machine 1",
  });

  const SendMessage = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!form) return;
    if (!form.name) return toast.error("Type Your Full Name, bro!");
    if (!form.email) return toast.error("Type Your Email, bro!");
    if (!form.message) return toast.error("Type Your Message, bro!");
    if (form.message.length <= 20)
      return toast.error(t("Type More than 20 letter"), {
        description: t("add more details to your message"),
      });

    setLoading(true);
    try {
      if (!session) {
        return toast.error(t("No anonymous user found. Clear web cache and try again"));
      }
      await axios.post("/api/contact", { userId: session?.user.id, ...form });
      setSubmitted(true);

      setForm({ message: "", email: "", name: "", company: "" });
      return toast.success(t("Message Send Successfully"), {
        description: t("Contact support will message you as soon as possible"),
        position: "bottom-right",
      });
    } catch (error: any) {
      return toast.error(error.response.data.error || "Unknown Error", {
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-24">
      <div className="flex flex-col justify-center items-center gap-2 text-center">
        <SimpleTitle title={t("Contact")} className="mb-7" />
        <T>
          <motion.h1 {...fadeUp} transition={{ ...transition }}>
            Contact Us
          </motion.h1>
          <motion.p {...fadeUp} transition={{ ...transition, delay: 0.1 }}>
            Carbon footprints may be complicated, but talking to us isn’t.
          </motion.p>
        </T>
      </div>
      <section className="mt-5 flex flex-col md:flex-row justify-center gap-5">
        <div className="w-full md:w-2/5">
          <T>
            <motion.h3
              {...fadeUp}
              transition={{ ...transition, delay: 0.3 }}
              className="mb-3"
            >
              We’d love to hear from you
            </motion.h3>
            <motion.p
              {...fadeUp}
              transition={{ ...transition, delay: 0.4 }}
              className="max-w-sm"
            >
              Got questions? Ideas?. Drop us a line.
            </motion.p>
          </T>
          <motion.div
            {...fadeUp}
            transition={{ ...transition, delay: 0.5 }}
            className="relative w-full h-96 mt-5 overflow-hidden rounded-lg"
          >
            <div className="absolute top-2/4 left-2/4 -translate-2/4 h-[500px] w-[500]">
              <RiveComponent />
            </div>
          </motion.div>
        </div>
        <form
          onSubmit={SendMessage}
          className="w-full md:w-3/5 flex flex-col justify-center items-center gap-3 border-2 border-primary/30 dark:border-primary p-10 rounded-lg"
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div id="Submitted" {...fadeOnly} className="text-center">
                <T>
                  <motion.h3 {...fadeUp} {...transition}>
                    Message Send Successfully
                  </motion.h3>
                  <motion.p
                    {...fadeUp}
                    transition={{ ...transition, delay: 0.1 }}
                  >
                    Contact support will message you as soon as possible
                  </motion.p>
                  <motion.div
                    {...fadeUp}
                    transition={{ ...transition, delay: 0.2 }}
                    className="flex justify-center items-center gap-2 my-5"
                  >
                    <Button link={"/"}>Home</Button>
                    <Button link={"/send"}>Send Your Message</Button>
                  </motion.div>
                </T>
              </motion.div>
            ) : (
              <>
                <motion.div
                  {...fadeUp}
                  transition={{ ...transition, delay: 0.6 }}
                  id="InputForm"
                  className="w-full flex flex-col justify-start items-start"
                >
                  <label className="text-primary dark:text-primary-foreground">
                    <T>Full Name</T>
                  </label>
                  <input
                    disabled={loading}
                    type="type"
                    placeholder="Your FullName"
                    name="fullName"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-neutral-300/50 dark:bg-neutral-700/50 mt-3 mb-1.5 outline-none border-2 border-neutral-300/50 dark:border-neutral-700/50 focus:bg-transparent dark:focus:bg-transparent duration-200 disabled:cursor-not-allowed"
                  />
                </motion.div>

                <motion.div
                  {...fadeUp}
                  id="InputForm"
                  transition={{ ...transition, delay: 0.7 }}
                  className="w-full flex flex-col justify-start items-start"
                >
                  <label className="text-primary dark:text-primary-foreground">
                    <T>Email</T>
                  </label>
                  <input
                    disabled={loading}
                    name="email"
                    type="email"
                    placeholder="Your@gmail.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg bg-neutral-300/50 dark:bg-neutral-700/50 mt-3 mb-1.5 outline-none border-2 border-neutral-300/50 dark:border-neutral-700/50 focus:bg-transparent dark:focus:bg-transparent duration-200 disabled:cursor-not-allowed"
                  />
                </motion.div>
                <motion.div
                  {...fadeUp}
                  id="InputForm"
                  transition={{ ...transition, delay: 0.8 }}
                  className="w-full flex flex-col justify-start items-start"
                >
                  <label className="text-primary dark:text-primary-foreground">
                    <T>Message</T>
                  </label>
                  <textarea
                    disabled={loading}
                    placeholder="Your Message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg bg-neutral-300/50 dark:bg-neutral-700/50 mt-3 mb-1.5 outline-none resize-none border-2 border-neutral-300/50 dark:border-neutral-700/50 focus:bg-transparent dark:focus:bg-transparent duration-200 disabled:cursor-not-allowed"
                  />
                  <input
                    type="text"
                    name="company"
                    className="hidden"
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                    autoComplete="off"
                  />
                </motion.div>
                <Button
                  disabled={loading}
                  textAnimated={loading ? false : true}
                  type="submit"
                  className="w-full text-primary-foreground flex flex-row items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 rounded-full border border-white border-t-transparent animate-spin" />
                      <T>Sending</T>
                    </>
                  ) : (
                    <T>Send Message</T>
                  )}
                </Button>
              </>
            )}
          </AnimatePresence>
        </form>
      </section>
      <FAQ />
    </main>
  );
}
