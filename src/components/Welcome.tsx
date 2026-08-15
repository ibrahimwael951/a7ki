"use client";
import { useState, useEffect } from "react";
import LocaleSelector from "./LanguageSelector";
import { T, useGT, Var } from "gt-next";
import { AnimatePresence, motion } from "motion/react";
import { fadeOnly, transition } from "@/Animation";
import { ThemeSelect } from "./ui/ThemeButton";
import { Button } from "./ui/button";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
const textVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};
const Welcome = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const { data: session } = useSession();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const t = useGT();

  const oldUser =
    typeof window !== "undefined" ? localStorage.getItem("oldUser") : null;

  useEffect(() => {
    if (!oldUser) {
      setShowWelcome(true);
    }
  }, [oldUser]);

  useEffect(() => {
    if (showWelcome) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showWelcome]);

  const FinishHandler = async () => {
    if (session) {
      localStorage.setItem("oldUser", "true");
      setShowWelcome(false);
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signIn.anonymous();

      if (result.error) {
        toast.error(t("Error during anonymous sign-in. Please try again."), {
          description: `${t("Error:")} ${result.error.message}`,
        });
        return;
      }

      localStorage.setItem("oldUser", "true");
      setShowWelcome(false);

      toast.success(
        t("Signed in anonymously. You can now share your thoughts!"),
      );
    } catch (error) {
      toast.error(t("Error during anonymous sign-in. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          {...fadeOnly}
          {...transition}
          className="fixed top-0 left-0 w-full h-screen bg-black/20 backdrop-blur-xs overflow-hidden z-70 flex justify-center items-center px-4"
        >
          <section className="w-full max-w-xl text-center flex flex-col justify-center items-center gap-5 p-5 px-10 rounded-2xl bg-background border-2 border-primary/60 dark:border-primary">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step-1"
                  variants={textVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex flex-col items-center gap-4"
                >
                  <T>
                    <h2>Hi there..</h2>

                    <p>
                      Welcome to A7KI, the anonymous stories platform. Choose
                      your language to get started.
                    </p>
                    <div className="flex items-center gap-3">
                      <Var>
                        <LocaleSelector />
                      </Var>
                      <Button onClick={() => setStep(2)}>Next</Button>
                    </div>
                  </T>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  variants={textVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex flex-col items-center gap-4"
                >
                  <T>
                    <h2>Almost there</h2>

                    <p>
                      Pick a theme that feels right. You can always change it
                      later.
                    </p>
                    <div className="flex items-center gap-3">
                      <Var>
                        <ThemeSelect />
                      </Var>
                      <Button onClick={() => setStep(3)}>Next</Button>
                    </div>
                  </T>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  variants={textVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex flex-col items-center gap-4"
                >
                  <T>
                    <h2>Finally..!</h2>

                    <p>
                      Welcome to A7KI, the anonymous stories platform. Are you
                      ready to share your thoughts and feelings in a safe and
                      private space? Let's get started by choosing your
                      preferred language.
                    </p>
                    <div className="flex items-center gap-3">
                      <Button onClick={FinishHandler} disabled={loading}>
                        {loading ? "Loading..." : "Lets Get Started"}
                      </Button>
                    </div>
                  </T>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Welcome;
