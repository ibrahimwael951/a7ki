"use client";
import { AnimatePresence, motion } from "motion/react";
import { useRive } from "@rive-app/react-canvas";
import { useEffect, useState } from "react";
import { fadeOnly, fadeUp, transition } from "@/Animation";
import TextType from "@/components/TextType";
import { Button } from "@/components/ui/button";
import { useExamples } from "@/data/Messages_Examples";
import { X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useSession } from "@/lib/auth-client";
import { T, useGT } from "gt-next";

export default function Page() {
  const t = useGT();
  const [message, setMessage] = useState(0);
  const [showForm, setShowForm] = useState<boolean | null>(null);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [thought, setThought] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const { data: session, isPending } = useSession();
  const Examples = useExamples();
  const Messages = [
    t("Hi there !"),
    t("Here, you can share all your negative thoughts"),
    t("And don’t worry, no one will know who you are."),
    t("Lastly, please remember to be respectful to others and to our privacy"),
  ];

  const { RiveComponent } = useRive({
    src: "/Animated_Images/Cute_Girl.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  useEffect(() => {
    const value = localStorage.getItem("know_the_roles");
    if (value) {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  }, []);
  useEffect(() => {
    if (showExamples) {
      window.document.body.style.overflow = "hidden";
    } else {
      window.document.body.style.overflow = "auto";
    }
  }, [showExamples]);

  const btnHandler = () => {
    if (!buttonEnabled) return;
    if (message < Messages.length - 1) {
      setMessage((prev) => prev + 1);
      setButtonEnabled(false);
    } else {
      localStorage.setItem("know_the_roles", "true");
      setShowForm(true);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!session) return;
    if (thought.trim().length <= 120)
      return toast.error(t("Type more than 120 letters"), {
        description: t("you can add more details to your story"),
        position: "bottom-right",
      });

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));
    try {
      await axios.post("/api/thought", {
        thought,
        userId: session.user.id,
      });

      setSubmitted(true);
    } catch (error: any) {
      return toast.error(error.response.data.error || "Unknown Error", {
        position: "bottom-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative max-w-full! flex flex-col justify-center items-center p-4 overflow-hidden">
      <motion.div
        variants={fadeUp}
        transition={{ ...transition, delay: 0.2 }}
        className="relative min-h-80 w-full flex justify-end items-end overflow-hidden"
      >
        <div className="absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px]">
          <RiveComponent />
        </div>
        <p className="absolute -bottom-1 left-2/4 -translate-x-1/2 w-full text-center md:hidden text-sm text-gray-500">
          {t("Tap the character to interact")}
        </p>
      </motion.div>
      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.div
            key="intro"
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center justify-center w-full"
          >
            <motion.div
              variants={fadeUp}
              transition={{ ...transition, delay: 0.3 }}
              className="w-full md:w-2/4 flex flex-col justify-center items-center gap-5 text-center"
            >
              <AnimatePresence mode="wait">
                <motion.div key={message} {...fadeOnly}>
                  <TextType
                    text={Messages[message]}
                    onSentenceComplete={() => setButtonEnabled(true)}
                    loop={false}
                    className="text-4xl md:text-5xl font-medium"
                  />
                </motion.div>
              </AnimatePresence>

              <motion.div variants={fadeUp} transition={transition}>
                <Button disabled={!buttonEnabled} onClick={btnHandler}>
                  {message === 0 ? t("Hi!") : t("Okay, Got it")}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center justify-center w-full"
          >
            <motion.div
              variants={fadeUp}
              transition={{ ...transition, delay: 0.3 }}
              className="w-full  max-w-2xl flex flex-col justify-center items-center gap-5"
            >
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form-content"
                    {...fadeOnly}
                    onSubmit={handleSubmit}
                    className="w-full space-y-5"
                  >
                    <T>
                      <motion.h2
                        variants={fadeUp}
                        className="text-4xl md:text-5xl font-medium text-center"
                      >
                        Share your{" "}
                        <span className="text-primary dark:text-primary-foreground">
                          {" "}
                          thoughts{" "}
                        </span>
                      </motion.h2>
                    </T>

                    <motion.div variants={fadeUp} className="relative w-full">
                      <textarea
                        value={thought}
                        onChange={(e) => setThought(e.target.value)}
                        maxLength={2000}
                        placeholder={t(
                          "Write your negative thoughts here... Remember, this is anonymous and safe."
                        )}
                        className="w-full min-h-40 h-fit max-h-[400px] p-2.5 rounded-lg bg-neutral-300/50 dark:bg-neutral-700/50 mt-3 mb-1.5 outline-none border-2 border-neutral-300/50 dark:border-neutral-700/50 focus:bg-transparent dark:focus:bg-transparent duration-200 resize-y"
                        disabled={isSubmitting}
                      />
                      <p className="absolute bottom-3 right-4">
                        {thought.length}/ 2000
                      </p>
                    </motion.div>

                    <motion.div
                      variants={fadeUp}
                      className="flex justify-center"
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            {t("Submitting...")}
                          </span>
                        ) : (
                          t("Submit")
                        )}
                      </Button>
                    </motion.div>
                    <T>
                      <p className="text-center">
                        want examples?{" "}
                        <span
                          onClick={() => setShowExamples(true)}
                          className="text-primary dark:text-primary-foreground border-b border-primary dark:border-primary-foreground cursor-pointer"
                        >
                          Examples
                        </span>
                      </p>
                    </T>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    {...fadeOnly}
                    className="text-center space-y-4"
                  >
                    <T>
                      <h2>Thank you for sharing</h2>
                      <p>Your thoughts have been submitted </p>
                      <div className="flex justify-center items-center gap-4 mt-5">
                        <Button link={"/dashboard"} variant={"outline"}>
                          Dashboard
                        </Button>
                        <Button link={"/sendMail"}>Contact!</Button>
                      </div>
                    </T>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExamples && (
          <>
            <motion.div
              {...fadeOnly}
              onClick={() => setShowExamples(false)}
              className="hidden md:flex fixed top-0 right-0 bg-black/30 backdrop-blur-xs w-full h-full z-30"
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              exit={{ x: "100%", opacity: 0 }}
              animate={{ x: "0", opacity: 100 }}
              transition={{ duration: 0.4, stiffness: 10 }}
              className="fixed top-0 right-0 bg-accent text-white w-full md:w-4/5 lg:w-3/5 p-10 pt-20 md:rounded-l-2xl h-full z-40"
            >
              <Button
                onClick={() => setShowExamples(false)}
                className="scale-110 mb-3"
              >
                <X size={40} />
              </Button>
              <h1 className="mb-4 text-white dark:text-primary-foreground">
                {t("Examples")}
              </h1>
              <div className="flex flex-col gap-4">
                {Examples.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-start items-start md:items-end gap-2"
                  >
                    <h2>{i + 1}</h2>
                    <h6>“{item}“</h6>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
