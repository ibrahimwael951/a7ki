"use client";
import { AnimatePresence, motion, LayoutGroup } from "motion/react";
import { useRive } from "@rive-app/react-canvas";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { fadeOnly, fadeUp, transition } from "@/Animation";
import TextType from "@/components/TextType";
import { Button } from "@/components/ui/button";
import { useExamples } from "@/data/Messages_Examples";
import { X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useSession } from "@/lib/auth-client";
import { T, useGT, useLocale, Var } from "gt-next";
import { ScrollArea } from "@/components/ui/scroll-area";

type RecentThought = {
  _id: string;
  thought: string;
  rank: string;
  createdAt: string;
};

export default function Page() {
  const t = useGT();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const [message, setMessage] = useState(0);
  const [showForm, setShowForm] = useState<boolean | null>(null);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [thought, setThought] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [deletingLoading, setDeletingLoading] = useState(false);
  const [ai_Comment, setAi_Comment] = useState("");
  const [wantEdit, setWantEdit] = useState("");
  const [thought_id, setThought_id] = useState("");
  const { data: session, isPending } = useSession();
  const Examples = useExamples();

  // Recent thoughts panel (desktop only)
  const [recentThoughts, setRecentThoughts] = useState<RecentThought[]>([]);
  const isThereRecentThought = recentThoughts.length !== 0;
  const [hideRecentThought, setHideRecentThought] = useState(false);
  const showExamples = searchParams.get("examples") === "true";

  const Messages = [
    t("Hi there !"),
    t("Here, you can share all your negative thoughts"),
    t("And don't worry, no one will know who you are."),
    t("Lastly, please remember to be respectful to others and to our privacy"),
  ];

  const { RiveComponent } = useRive({
    src: "/Animated_Images/Cute_Girl.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const storedThought = localStorage.getItem("User_Thought");

    if (storedThought) {
      setThought(storedThought);
    }
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(
          textareaRef.current.scrollHeight + 20,
          700,
        )}px`;
      }
    });
  }, [thought]);

  const ThoughtHandler = (value: string) => {
    setThought(value);
    localStorage.setItem("User_Thought", value);
  };

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

  // Fetch the user's recent thoughts once we have a session
  useEffect(() => {
    if (!session) return;

    const fetchRecent = async () => {
      try {
        const res = await axios.get("/api/thought", {
          params: { userId: session.user.id },
        });
        setRecentThoughts(res.data);
      } catch (err) {
        console.log("Failed to load recent thoughts", err);
      }
    };

    fetchRecent();
    // Re-fetch after a successful submit so the list stays current
  }, [session, submitted]);

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
      let response;

      if (thought_id !== "") {
        response = await axios.put("/api/thought", {
          thoughtId: thought_id,
          thought,
          locale,
        });
      } else {
        response = await axios.post("/api/thought", {
          thought,
          locale,
          userId: session.user.id,
        });
      }

      setSubmitted(true);

      if (response.data.wantEdit != "") {
        setWantEdit(response.data.wantEdit);
        setThought_id(response.data.thoughtId);
        setAi_Comment(response.data.comment);
      } else {
        setAi_Comment(response.data.comment);
        setThought("");
        setThought_id("");
        setWantEdit("");
        localStorage.removeItem("User_Thought");
      }
    } catch (error: any) {
      return toast.error(error.response?.data?.error || "Unknown Error", {
        position: "bottom-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const DeleteHandler = async () => {
    const toastId = toast.loading(t("Deleting....."));
    setDeletingLoading(true);
    try {
      await axios.delete("/api/thought", {
        data: {
          thoughtId: thought_id,
        },
      });

      toast.success(t("Deleted Successfully"), { id: toastId });
      setWantEdit("");
      setAi_Comment("");
      setThought("");
      localStorage.removeItem("User_Thought");
      setThought_id("");
      setSubmitted(false);
    } catch (Error) {
      console.log("delete Error", Error);
      toast.error(t("Something wrong happened"), { id: toastId });
    } finally {
      setDeletingLoading(false);
    }
  };

  const openExamples = () => {
    router.push(`${pathname}?examples=true`);
  };

  const closeExamples = () => {
    if (window.history.state?.examplesOpened) {
      router.back();
    } else {
      router.push(pathname);
    }
  };

  // Whether the right panel should currently be rendered at all
  const showRecentThoughtPanel = isThereRecentThought && !hideRecentThought;

  return (
    <LayoutGroup>
      <main className="relative max-w-full! flex flex-col md:flex-row justify-center items-center pt-15 md:pt-0 p-4 gap-8 overflow-hidden">
        {/* LEFT SIDE — everything that used to be the whole page */}
        <motion.div
          layout
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="flex-1 w-full flex flex-col items-center"
        >
          <motion.div
            variants={fadeUp}
            transition={{ ...transition, delay: 0.2 }}
            className="relative min-h-80 w-full overflow-hidden"
          >
            <div className="absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2 w-[900] lg:w-[700] h-[900] lg:h-[700]">
              <RiveComponent />
            </div>
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
                  className="w-full md:w-4/5 flex flex-col justify-center items-center gap-5 text-center"
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
                  className="w-full max-w-2xl flex flex-col justify-center items-center gap-5"
                >
                  <AnimatePresence mode="wait">
                    {!submitted ? (
                      <form
                        key="form-content"
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

                        <motion.div
                          {...fadeUp}
                          {...transition}
                          className="relative w-full"
                        >
                          <textarea
                            ref={textareaRef}
                            dir="auto"
                            value={thought}
                            onChange={(e) => ThoughtHandler(e.target.value)}
                            maxLength={2000}
                            placeholder={t(
                              "Write your negative thoughts here... Remember, this is anonymous and safe.",
                            )}
                            className="w-full min-h-40 max-h-[700px] p-2.5 rounded-lg bg-neutral-300/50 dark:bg-neutral-700/50 mt-3 mb-1.5 outline-none border-2 border-neutral-300/50 dark:border-neutral-700/50 focus:bg-transparent dark:focus:bg-transparent duration-200 resize-none overflow-y-auto"
                            disabled={isSubmitting}
                          />
                          <p className="absolute bottom-3 right-4">
                            {thought.length}/ 2000
                          </p>
                        </motion.div>

                        <motion.div
                          {...fadeUp}
                          {...transition}
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
                            Want examples?{" "}
                            <span
                              onClick={openExamples}
                              className="text-primary dark:text-primary-foreground border-b border-primary dark:border-primary-foreground cursor-pointer"
                            >
                              Examples
                            </span>
                          </p>
                        </T>
                      </form>
                    ) : wantEdit == "" ? (
                      <motion.div
                        key="success"
                        {...fadeOnly}
                        className="text-center space-y-4"
                      >
                        <T>
                          <Var>
                            <h4 className="whitespace-pre-wrap">{ai_Comment}</h4>
                          </Var>

                          <div className="flex flex-col justify-center items-center gap-4 mt-5">
                            <Button
                              className="w-full"
                              size={"lg"}
                              link={"/moments"}
                            >
                              See People Moments!
                            </Button>
                            <Button
                              className="w-full"
                              size={"lg"}
                              link={"/dashboard/Thoughts"}
                              variant={"outline"}
                            >
                              See My Thoughts
                            </Button>
                          </div>
                        </T>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="success"
                        {...fadeOnly}
                        className="text-center space-y-4"
                      >
                        <T>
                          <Var>
                            <h4 className="whitespace-pre-wrap">{wantEdit}</h4>
                          </Var>

                          <div className="flex flex-col justify-center items-center gap-4 mt-5">
                            <Button
                              className="w-full"
                              size={"lg"}
                              onClick={() => {
                                (setSubmitted(false), setShowForm(true));
                              }}
                            >
                              Edit My Thought
                            </Button>
                            <Var>
                              <Button
                                className="w-full"
                                size={"lg"}
                                variant={"destructive"}
                                onClick={DeleteHandler}
                              >
                                {deletingLoading
                                  ? t("Deleting......")
                                  : t("Delete This Thought And Start Fresh")}{" "}
                              </Button>
                            </Var>
                          </div>
                        </T>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* RIGHT SIDE — recent thoughts, desktop only.
            Fully animates out (width + opacity) then unmounts completely. */}
        <AnimatePresence>
          {showRecentThoughtPanel && (
            <motion.section
              key="recent-thoughts"
              layout
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "45%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
              className="hidden md:flex flex-col gap-4 sticky top-10 h-full max-h-[85vh]"
            >
              {/* inner wrapper keeps content from squishing/wrapping while width animates */}
              <div className="flex flex-col gap-4 w-full min-w-[320px] pr-5 h-full max-h-[85vh] overflow-y-auto">
                <T>
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-medium">
                      Your Recent <span className="mark">Thoughts</span>
                    </h3>
                    <Button onClick={() => setHideRecentThought(true)}>
                      Hide For Now!
                    </Button>
                  </div>
                </T>
                <ScrollArea className="flex flex-col gap-4 h-full max-h-[85vh] overflow-y-auto px-5">
                  {recentThoughts.map((item) => (
                    <Link
                      key={item._id}
                      href={`/thought/${item._id}`}
                      className="block rounded-xl border-2 border-neutral-300/50 dark:border-neutral-700/50 p-4 my-5 bg-neutral-200/40 dark:bg-neutral-800/40 hover:bg-neutral-200/70 dark:hover:bg-neutral-800/70 transition-colors"
                    >
                      <p className="text-sm line-clamp-2">{item.thought}</p>
                      <div className="flex items-center justify-end gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </ScrollArea>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showExamples && (
            <>
              <motion.div
                {...fadeOnly}
                onClick={closeExamples}
                className="hidden md:flex fixed top-0 right-0 bg-black/30 backdrop-blur-xs w-full h-full z-30"
              />
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                exit={{ x: "100%", opacity: 0 }}
                animate={{ x: "0", opacity: 100 }}
                transition={{ duration: 0.3, stiffness: 10 }}
                className="fixed top-0 right-0 bg-accent text-white w-full md:w-4/5 lg:w-3/5 p-10 pt-20 md:rounded-l-2xl h-full z-40"
              >
                <Button onClick={closeExamples} className="scale-110 mb-3">
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
                      <h6>"{item}"</h6>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </LayoutGroup>
  );
}