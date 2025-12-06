"use client";
import { AnimatePresence, motion } from "motion/react";
import { useRive } from "@rive-app/react-canvas";
import React, { useState } from "react";
import { fadeOnly, fadeUp, transition } from "@/Animation";
import TextType from "@/components/TextType";
import { Button } from "@/components/ui/button";

const Messages = [
  "Hi there!",
  "Here, you can share all your negative thoughts",
  "And don’t worry, no one will know who you are.",
  "Lastly, please remember to be respectful to others and to our privacy",
];

export default function Page() {
  const [message, setMessage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [thoughts, setThoughts] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { RiveComponent } = useRive({
    src: "/Animated_Images/Cute_Girl.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  const btnHandler = () => {
    if (!buttonEnabled) return;
    if (message < Messages.length - 1) {
      setMessage((prev) => prev + 1);
      setButtonEnabled(false);
    } else {
      setShowForm(true);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!thoughts.trim()) return;

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <main className="flex flex-col justify-center items-center p-4">
      <motion.div
        variants={fadeUp}
        transition={{ ...transition, delay: 0.2 }}
        className="relative min-h-80 w-full max-w-sm flex justify-end items-end overflow-hidden"
      >
        <div className="absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px]">
          <RiveComponent />
        </div>
        <p className="absolute -bottom-1 left-2/4 -translate-x-1/2 w-full text-center md:hidden text-sm text-gray-500">
          try Swipe on me
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
                  {message === 0 ? "Hi!" : "Okay, Got it"}
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

                    <motion.div variants={fadeUp} className="w-full">
                      <textarea
                        value={thoughts}
                        onChange={(e) => setThoughts(e.target.value)}
                        placeholder="Write your negative thoughts here... Remember, this is anonymous and safe."
                        className="w-full min-h-40 max-h-72 p-2.5 rounded-lg bg-neutral-300/50 dark:bg-neutral-700/50 mt-3 mb-1.5 outline-none border-2 border-neutral-300/50 dark:border-neutral-700/50 focus:bg-transparent dark:focus:bg-transparent duration-200 resize-y"
                        disabled={isSubmitting}
                      />
                    </motion.div>

                    <motion.div
                      variants={fadeUp}
                      className="flex justify-center"
                    >
                      <Button
                        type="submit"
                        disabled={!thoughts.trim() || isSubmitting}
                        className="w-full"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Sending...
                          </span>
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    </motion.div>
                    <p className="text-center">
                      want examples?{" "}
                      <span className="text-primary dark:text-primary-foreground border-b border-primary dark:border-primary-foreground cursor-pointer">
                        Examples
                      </span>
                    </p>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    {...fadeOnly}
                    className="text-center space-y-4"
                  >
                    <h2>Thank you for sharing</h2>
                    <p>Your thoughts have been submitted </p>
                    <div className="flex justify-center items-center gap-4 mt-5">
                      <Button  link={"/dashboard"} variant={"outline"}>Dashboard</Button>
                      <Button link={"/sendMail"} >Send Mail to me!</Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
