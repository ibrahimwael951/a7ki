"use client";
import { fadeOnly, fadeUp, transition } from "@/Animation";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./button";
import { useRankConfig } from "@/data/rankConfig";
import { useEffect, useState } from "react";
import { lenis } from "@/lib/lenis";
import { BadgeX, CircleCheckBig, X } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import axios from "axios";
import { ThoughtFeedback } from "@/types/Thoughts";
import { T, useGT } from "gt-next";
import { RankKey } from "@/types/Thoughts_Rank";



const Thought_Card = ({
  thought,
  thoughtId,
  rank,
  userId,
  withUserBTN = false,
  createdAt,
  withoutSlice = false,
  ThoughtFeedback,
}: {
  thought: string;
  thoughtId?: string;
  userId?: string;
  withUserBTN?: boolean;
  withoutSlice?: boolean;
  rank: RankKey;
  ThoughtFeedback?: ThoughtFeedback[];
  createdAt: string;
}) => {
  const { data: session } = useSession();
  const [showFB, setShowFB] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [FeedBack, setFeedBack] = useState<ThoughtFeedback[]>(
    ThoughtFeedback || []
  );
  const [error, setError] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");
  const [AdminName, setAdminName] = useState<string>(session?.user.name || "");
  const [showFullMessage, setShowFullMessage] = useState<boolean>(withoutSlice);
  const t = useGT();
  const rankConfig = useRankConfig();

  const config = rankConfig[rank];
  const Icon = config.icon;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post<ThoughtFeedback>(
        "/api/thought/feedback",
        {
          message: feedback,
          AdminName,
          thoughtId,
        }
      );
      setSubmitted(true);
      setFeedBack((prev) => [response.data, ...prev]);
    } catch (error: any) {
      setError(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!lenis) return;

    if (showFB) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [showFB, lenis]);

  return (
    <>
      <motion.div
        variants={fadeOnly}
        initial="initial"
        whileInView="animate"
        {...transition}
        className={`w-full h-full border-2 border-primary/20 dark:border-primary rounded-xl p-5 flex flex-col justify-between items-start`}
      >
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <p
              className="text-gray-700 text-lg leading-relaxed cursor-pointer"
              onClick={() => setShowFullMessage(!showFullMessage)}
            >
              {showFullMessage ? (
                thought
              ) : (
                <>
                  {thought.split(" ").slice(0, 20).join(" ") + "..."}
                  <span className="mark mx-2 border-b border-transparent hover:border-primary  dark:hover:border-primary-foreground">
                    {t("see more")}
                  </span>
                </>
              )}
            </p>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-xs ">
                {new Date(createdAt).toLocaleDateString()} •{" "}
                {new Date(createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
        {FeedBack && FeedBack.length > 0 && (
          <div className="w-full gap-1 border border-primary/20 dark:border-primary rounded-xl p-2">
            {FeedBack.map((item) => (
              <div
                key={item._id}
                className="w-full flex flex-col md:flex-row items-center justify-between gap-2 "
              >
                <div>
                  <span className="mark">
                    Admin {item.AdminName} Message :{" "}
                  </span>
                  {item.message}
                </div>
                <p className="text-xs">
                  {new Date(item.createdAt).toLocaleDateString()} •{" "}
                  {new Date(item.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
        {userId && (
          <div className="mt-2 w-full flex flex-col lg:flex-row justify-between lg:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className={`${config.iconColor} mt-1`}>
                <Icon size={24} strokeWidth={2} />
              </div>
              <span
                className={`${config.badge} text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide`}
              >
                {config.label}
              </span>
            </div>
            <div className="flex items-center gap-2 w-full lg:w-fit">
              {withUserBTN && (
                <Button
                  link={`/Admin/users/${userId}`}
                  className="text-xs 2xl:text-sm w-2/4"
                >
                  {t("See User Profile")}
                </Button>
              )}
              <Button
                variant={"outline"}
                className={`text-xs 2xl:text-sm ${
                  withUserBTN ? "w-2/4" : "w-full"
                } `}
                onClick={() => setShowFB(true)}
              >
                {t("Send Feedback")}
              </Button>
            </div>
          </div>
        )}
      </motion.div>
      <AnimatePresence>
        {showFB && (
          <motion.div
            {...fadeOnly}
            className="fixed top-0 left-0 h-screen w-full flex justify-center items-center z-60 px-5"
          >
            <div
              className="absolute top-0 left-0 w-full h-full bg-black/40 backdrop-blur-xs"
              onClick={() => setShowFB(false)}
            />
            <motion.div
              {...fadeUp}
              className="relative w-full max-w-xl h-fit p-5 text-center rounded-2xl border-2 border-primary/20 dark:border-primary bg-background overflow-hidden z-10"
            >
              <Button
                variant={"outline"}
                className="absolute top-2 right-2 rounded-xl"
                onClick={() => setShowFB(false)}
              >
                <X />
              </Button>
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    {...fadeOnly}
                    {...transition}
                    className="flex flex-col justify-center items-center gap-5 "
                  >
                    <div className="w-60 h-60 rounded-full border-r border-l-transparent border-primary dark:border-primary-foreground  animate-spin " />
                    <h4 className="animate-pulse">{t("Loading...")}</h4>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="Error"
                    {...fadeOnly}
                    {...transition}
                    className="flex flex-col justify-center items-center gap-5 text-xl m-5"
                  >
                    <BadgeX size={50} className="text-red-600" />
                    <h3>{t("Error while submitting")}</h3>
                    <p>
                      <span className="text-red-600">Error : </span> {error}
                    </p>
                  </motion.div>
                ) : submitted ? (
                  <motion.div
                    key="submitted"
                    {...fadeOnly}
                    {...transition}
                    className="flex flex-col justify-center items-center gap-5 text-xl m-5"
                  >
                    <CircleCheckBig size={50} className="text-green-600" />
                    <h3>{t("Your submited is done")}</h3>
                  </motion.div>
                ) : (
                  <motion.div
                    key="Form"
                    {...fadeOnly}
                    {...transition}
                    className="flex flex-col justify-between items-center gap-5"
                  >
                    <h3 className="font-bold!">{t("Send FeedBack")}</h3>
                    <div className="w-full max-w-xl flex flex-col items-start">
                      <label>
                        {t("Type your")}{" "}
                        <span className="mark font-bold">{t("Name")}</span>
                      </label>
                      <input
                        type="name"
                        placeholder="Ms.Apolo"
                        value={AdminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        className="w-full max-w-xl p-2.5 rounded-lg bg-neutral-300/50 dark:bg-neutral-700/50 mt-3 mb-1.5 outline-none border-2 border-neutral-300/50 dark:border-neutral-700/50 focus:bg-transparent dark:focus:bg-transparent duration-200 disabled:cursor-not-allowed"
                      />
                      <p className="w-full text-center text-xs mark">
                        {t("Your Admin Name has been took from your session")}
                      </p>
                    </div>
                    <div className="w-full max-w-xl flex flex-col items-start">
                      <label>
                        {t("Type your")}{" "}
                        <span className="mark font-bold">{t("feedBack")}</span>
                      </label>
                      <textarea
                        name="message"
                        placeholder="Hi, i loved your Thought"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full  h-52 p-2.5 rounded-lg bg-neutral-300/50 dark:bg-neutral-700/50 mt-3 mb-1.5 outline-none border-2 border-neutral-300/50 dark:border-neutral-700/50 focus:bg-transparent dark:focus:bg-transparent duration-200 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <T>
                        <Button
                          onClick={handleSubmit}
                          className="text-xs sm:text-sm"
                        >
                          Send your feedback
                        </Button>
                        <Button
                          variant={"outline"}
                          onClick={() => setShowFB(false)}
                          className="text-xs sm:text-sm"
                        >
                          Cancel, i don't want to!
                        </Button>
                      </T>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Thought_Card;
