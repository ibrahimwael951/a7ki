"use client";
import { fadeOnly, fadeUp, transition } from "@/Animation";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./button";
import { useRankConfig } from "@/data/rankConfig";
import { useEffect, useState } from "react";
import { BadgeX, CircleCheckBig, X, Trash2, Edit, User } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import axios from "axios";
import { ThoughtFeedback } from "@/types/Thoughts";
import { T, useGT, useLocale } from "gt-next";
import { RankKey } from "@/types/Thoughts_Rank";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SaveBtn from "./SaveBtn";

const Thought_Card = ({
  thought,
  saved,
  thoughtId,
  rank,
  userId,
  userName,
  withUserBTN = false,
  createdAt,
  withoutSlice = false,
  ThoughtFeedback,
}: {
  thought: string;
  thoughtId: string;
  userId?: string;
  userName?: string;
  saved?: boolean;
  withUserBTN?: boolean;
  withoutSlice?: boolean;
  rank: RankKey;
  ThoughtFeedback?: ThoughtFeedback[];
  createdAt: string;
}) => {
  const { data: session } = useSession();
  const t = useGT();
  const locale = useLocale();
  const rankConfig = useRankConfig();

  // Feedback popup states
  const [showFeedbackPopup, setShowFeedbackPopup] = useState<boolean>(false);
  const [showSendFB, setShowSendFB] = useState<boolean>(false);
  const [FeedBack, setFeedBack] = useState<ThoughtFeedback[]>(
    ThoughtFeedback || [],
  );

  // Send feedback states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");
  const [AdminName, setAdminName] = useState<string>(session?.user.name || "");

  // Edit feedback states
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(
    null,
  );
  const [editFeedbackText, setEditFeedbackText] = useState<string>("");
  const [editLoading, setEditLoading] = useState<boolean>(false);

  // Delete THOUGHT confirmation popup (separate from feedback delete confirm)
  const [showDeleteThoughtConfirm, setShowDeleteThoughtConfirm] =
    useState<boolean>(false);
  const [deleteThoughtLoading, setDeleteThoughtLoading] =
    useState<boolean>(false);

  // Delete confirmation popup
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deletingFeedbackId, setDeletingFeedbackId] = useState<string | null>(
    null,
  );
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // Edit thought states
  const [showEditThought, setShowEditThought] = useState<boolean>(false);
  const [currentThought, setCurrentThought] = useState<string>(thought);
  const [currentRank, setCurrentRank] = useState<RankKey>(rank);
  const [editThoughtText, setEditThoughtText] = useState<string>(thought);
  const [editThoughtLoading, setEditThoughtLoading] = useState<boolean>(false);

  const [showFullMessage, setShowFullMessage] = useState<boolean>(withoutSlice);

  const route = useRouter();
  const config = rankConfig[currentRank];
  const Icon = config.icon;

  const confirmDeleteThought = async () => {
    setDeleteThoughtLoading(true);
    const toastId = toast.loading(t("Deleting....."));
    try {
      await axios.delete("/api/thought", {
        data: {
          thoughtId,
        },
      });

      toast.success(t("Deleted Successfully"), { id: toastId });
      route.push("/");
    } catch (Error) {
      console.log("delete Error", Error);
      toast.error(t("Something wrong happened"), { id: toastId });
    } finally {
      setDeleteThoughtLoading(false);
      setShowDeleteThoughtConfirm(false);
    }
  };
  // Handle send feedback
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post<ThoughtFeedback>(
        "/api/thought/feedback",
        {
          message: feedback,
          AdminName,
          thoughtId,
        },
      );
      setSubmitted(true);
      setFeedBack((prev) => [response.data, ...prev]);
      setFeedback("");
      toast.success(t("Feedback sent successfully!"));
      setTimeout(() => {
        setShowSendFB(false);
        setSubmitted(false);
      }, 2000);
    } catch (error: any) {
      const errorMsg = error.response?.data || "An error occurred";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete feedback - show confirmation popup
  const handleDeleteFeedbackClick = (feedbackId: string) => {
    setDeletingFeedbackId(feedbackId);
    setShowDeleteConfirm(true);
  };

  // Confirm delete feedback
  const confirmDeleteFeedback = async () => {
    if (!deletingFeedbackId) return;

    setDeleteLoading(true);
    try {
      await axios.delete(`/api/thought/feedback`, {
        params: { feedbackId: deletingFeedbackId },
      });
      setFeedBack((prev) => prev.filter((fb) => fb._id !== deletingFeedbackId));
      toast.success(t("Feedback deleted successfully!"));
      setShowDeleteConfirm(false);
      setDeletingFeedbackId(null);
    } catch (error: any) {
      toast.error(error.response?.data || "Failed to delete feedback");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle edit feedback
  const handleEditFeedback = async (feedbackId: string) => {
    setEditLoading(true);
    try {
      const response = await axios.put<ThoughtFeedback>(
        `/api/thought/feedback/`,
        {
          feedbackId,
          message: editFeedbackText,
        },
      );
      setFeedBack((prev) =>
        prev.map((fb) => (fb._id === feedbackId ? response.data : fb)),
      );
      setEditingFeedbackId(null);
      setEditFeedbackText("");
      toast.success(t("Feedback updated successfully!"));
    } catch (error: any) {
      toast.error(error.response?.data || "Failed to update feedback");
    } finally {
      setEditLoading(false);
    }
  };

  // Handle edit thought
  const handleEditThought = async () => {
    if (editThoughtText.trim().length <= 120) {
      toast.error(t("Thought should be at least 120 characters long"));
      return;
    }

    setEditThoughtLoading(true);
    try {
      const response = await axios.put(`/api/thought`, {
        thoughtId,
        thought: editThoughtText,
        locale,
      });
      setCurrentThought(response.data.updatedThought.thought);
      setCurrentRank(response.data.updatedThought.rank);
      toast.success(t("Thought updated successfully!"));
      setShowEditThought(false);
    } catch (error: any) {
      toast.error(error.response?.data || "Failed to update thought");
    } finally {
      setEditThoughtLoading(false);
    }
  };

  useEffect(() => {
    if (
      showSendFB ||
      showFeedbackPopup ||
      showEditThought ||
      showDeleteConfirm
    ) {
      window.document.body.style.overflow = "hidden";
    } else {
      window.document.body.style.overflow = "auto";
    }
  }, [showSendFB, showFeedbackPopup, showEditThought, showDeleteConfirm]);

  return (
    <>
      <motion.div
        variants={fadeOnly}
        initial="initial"
        whileInView="animate"
        {...transition}
        className={`w-full h-full border-2 border-primary/20 dark:border-primary rounded-xl p-5 flex flex-col justify-between items-start`}
      >
        <div className="flex items-start gap-4 w-full">
          <div className="flex-1 min-w-0">
            {/* Author row */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-end gap-1.5 mb-3 text-muted-foreground w-70 md:w-full">
                <User size={24} className="mark" strokeWidth={3} />
                <span className="text-foreground! text-sm font-medium truncate">
                  {userName}
                </span>
              </div>

              <SaveBtn Saved={saved} thoughtId={thoughtId} />
            </div>
            <p
              dir="auto"
              className={` text-foreground! text-lg leading-relaxed cursor-pointer whitespace-pre-wrap wrap-break-word ${
                showFullMessage ? "" : "line-clamp-4"
              }`}
              onClick={() => setShowFullMessage(!showFullMessage)}
            >
              {currentThought}

              {!showFullMessage && (
                <span className="mark mx-2 border-b border-transparent hover:border-primary">
                  {t("see more")}
                </span>
              )}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <p className="text-xs">
                {new Date(createdAt).toLocaleDateString()} •{" "}
                {new Date(createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-2 w-full flex flex-col lg:flex-row justify-between lg:items-center gap-4">
          {(() => {
            const isAdmin = session?.user?.role === "admin";
            const isOwner =
              !userId || (session?.user?.id && session.user.id === userId);

            if (isOwner) {
              return (
                <>
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
                  <div className="flex justify-center items-center gap-5">
                    <Button onClick={() => setShowEditThought(true)}>
                      {t("Edit my thought")}
                    </Button>
                    <Button
                      onClick={() => setShowDeleteThoughtConfirm(true)}
                      variant={"destructive"}
                    >
                      {t("Delete my thought")}
                    </Button>
                  </div>
                </>
              );
            }

            if (isAdmin && userId) {
              return (
                <>
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
                      }`}
                      onClick={() => setShowSendFB(true)}
                    >
                      {t("Send Feedback")}
                    </Button>
                  </div>
                </>
              );
            }

            return null;
          })()}
        </div>

        {/* Show feedback count button */}
        {FeedBack &&
          FeedBack.length > 0 &&
          (() => {
            const isAdmin = session?.user?.role === "admin";
            const isOwner =
              !userId || (session?.user?.id && session.user.id === userId);
            return isAdmin || isOwner;
          })() && (
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => setShowFeedbackPopup(true)}
            >
              {t("View Admin Messages")} ({FeedBack.length})
            </Button>
          )}
      </motion.div>

      {/* View Feedback Messages Popup */}
      <AnimatePresence>
        {showFeedbackPopup && (
          <motion.div
            {...fadeOnly}
            className="fixed top-0 left-0 h-screen w-full flex justify-center items-center z-60 px-5"
          >
            <div
              className="absolute top-0 left-0 w-full h-full bg-black/40 backdrop-blur-xs"
              onClick={() => setShowFeedbackPopup(false)}
            />
            <motion.div
              {...fadeUp}
              className="relative w-full max-w-2xl max-h-[80vh] p-5 rounded-2xl border-2 border-primary/20 dark:border-primary bg-background overflow-hidden z-10"
            >
              <Button
                variant={"outline"}
                className="absolute top-2 right-2 rounded-xl"
                onClick={() => setShowFeedbackPopup(false)}
              >
                <X />
              </Button>
              <h3 className="font-bold text-xl text-center mb-4">
                {t("Admins Messages")}
              </h3>
              <div className="overflow-y-auto max-h-[calc(80vh-8rem)] space-y-3">
                {FeedBack.map((item) => (
                  <div
                    key={item._id}
                    className="w-full border border-primary/20 dark:border-primary rounded-xl p-4"
                  >
                    {editingFeedbackId === item._id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editFeedbackText}
                          onChange={(e) => setEditFeedbackText(e.target.value)}
                          className="w-full h-32 p-2.5 rounded-lg bg-neutral-300/50 dark:bg-neutral-700/50 outline-none border-2 border-neutral-300/50 dark:border-neutral-700/50 focus:bg-transparent dark:focus:bg-transparent duration-200"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditFeedback(item._id)}
                            disabled={editLoading}
                            className="text-xs"
                          >
                            {editLoading ? t("Saving...") : t("Save")}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditingFeedbackId(null);
                              setEditFeedbackText("");
                            }}
                            className="text-xs"
                          >
                            {t("Cancel")}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="mark font-semibold">
                            Admin {item.AdminName}
                          </span>
                          <div className="flex items-center gap-2">
                            {withUserBTN && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingFeedbackId(item._id);
                                    setEditFeedbackText(item.message);
                                  }}
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteFeedbackClick(item._id)
                                  }
                                >
                                  <Trash2
                                    size={16}
                                    className="text-destructive"
                                  />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        <p className="text-sm mb-2">{item.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()} •{" "}
                          {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Popup */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            {...fadeOnly}
            className="fixed top-0 left-0 h-screen w-full flex justify-center items-center z-70 px-5"
          >
            <div
              className="absolute top-0 left-0 w-full h-full bg-black/40 backdrop-blur-xs"
              onClick={() => !deleteLoading && setShowDeleteConfirm(false)}
            />
            <motion.div
              {...fadeUp}
              className="relative w-full max-w-md p-6 text-center rounded-2xl border-2 border-primary/20 dark:border-primary bg-background overflow-hidden z-10"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <Trash2 size={32} className="text-destructive" />
                </div>
                <h3 className="font-bold text-xl">{t("Delete Feedback")}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t(
                    "Are you sure you want to delete this feedback? This action cannot be undone.",
                  )}
                </p>
                <div className="flex items-center gap-3 w-full mt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleteLoading}
                    className="flex-1"
                  >
                    {t("Cancel")}
                  </Button>
                  <Button
                    onClick={confirmDeleteFeedback}
                    disabled={deleteLoading}
                    className="flex-1 bg-destructive hover:bg-destructive/80 text-white"
                  >
                    {deleteLoading ? t("Deleting...") : t("Delete")}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete THOUGHT Confirmation Popup */}
      <AnimatePresence>
        {showDeleteThoughtConfirm && (
          <motion.div
            {...fadeOnly}
            className="fixed top-0 left-0 h-screen w-full flex justify-center items-center z-70 px-5"
          >
            <div
              className="absolute top-0 left-0 w-full h-full bg-black/40 backdrop-blur-xs"
              onClick={() =>
                !deleteThoughtLoading && setShowDeleteThoughtConfirm(false)
              }
            />
            <motion.div
              {...fadeUp}
              className="relative w-full max-w-md p-6 text-center rounded-2xl border-2 border-primary/20 dark:border-primary bg-background overflow-hidden z-10"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <Trash2 size={32} className="text-destructive" />
                </div>
                <h3 className="font-bold text-xl">
                  {t("Delete This Thought")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t(
                    "This will permanently delete this thought and ALL of its comments and replies. This action cannot be undone.",
                  )}
                </p>
                <div className="flex items-center gap-3 w-full mt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteThoughtConfirm(false)}
                    disabled={deleteThoughtLoading}
                    className="flex-1"
                  >
                    {t("Cancel")}
                  </Button>
                  <Button
                    onClick={confirmDeleteThought}
                    disabled={deleteThoughtLoading}
                    className="flex-1 bg-destructive hover:bg-destructive/80 text-white"
                  >
                    {deleteThoughtLoading
                      ? t("Deleting...")
                      : t("Yes, Delete Everything")}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Send Feedback Popup */}
      <AnimatePresence>
        {showSendFB && (
          <motion.div
            {...fadeOnly}
            className="fixed top-0 left-0 h-screen w-full flex justify-center items-center z-60 px-5"
          >
            <div
              className="absolute top-0 left-0 w-full h-full bg-black/40 backdrop-blur-xs"
              onClick={() => setShowSendFB(false)}
            />
            <motion.div
              {...fadeUp}
              className="relative w-full max-w-xl h-fit p-5 text-center rounded-2xl border-2 border-primary/20 dark:border-primary bg-background overflow-hidden z-10"
            >
              <Button
                variant={"outline"}
                className="absolute top-2 right-2 rounded-xl"
                onClick={() => setShowSendFB(false)}
              >
                <X />
              </Button>
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    {...fadeOnly}
                    {...transition}
                    className="flex flex-col justify-center items-center gap-5"
                  >
                    <div className="w-60 h-60 rounded-full border-r border-l-transparent border-primary dark:border-primary-foreground animate-spin" />
                    <h4 className="animate-pulse">{t("Loading...")}</h4>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="Error"
                    {...fadeOnly}
                    {...transition}
                    className="flex flex-col justify-center items-center gap-5 text-xl m-5"
                  >
                    <BadgeX size={50} className="text-destructive" />
                    <h3>{t("Error while submitting")}</h3>
                    <p>
                      <span className="text-destructive">Error : </span> {error}
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
                        className="w-full h-52 p-2.5 rounded-lg bg-neutral-300/50 dark:bg-neutral-700/50 mt-3 mb-1.5 outline-none border-2 border-neutral-300/50 dark:border-neutral-700/50 focus:bg-transparent dark:focus:bg-transparent duration-200 disabled:cursor-not-allowed"
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
                          onClick={() => setShowSendFB(false)}
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

      {/* Edit Thought Popup */}
      <AnimatePresence>
        {showEditThought && (
          <motion.div
            {...fadeOnly}
            className="fixed top-0 left-0 h-screen w-full flex justify-center items-center z-60 px-5"
          >
            <div
              className="absolute top-0 left-0 w-full h-full bg-black/40 backdrop-blur-xs"
              onClick={() => setShowEditThought(false)}
            />
            <motion.div
              {...fadeUp}
              className="relative w-full max-w-4xl h-fit p-5 text-center rounded-2xl border-2 border-primary/20 dark:border-primary bg-background overflow-hidden z-10"
            >
              <Button
                variant={"outline"}
                className="absolute top-2 right-2 rounded-xl"
                onClick={() => {
                  setShowEditThought(false);
                  setEditThoughtText(currentThought);
                }}
              >
                <X />
              </Button>
              <h3 className="font-bold text-xl mb-4">
                {t("Edit Your Thought")}
              </h3>
              <div className="w-full flex flex-col items-start gap-4">
                <textarea
                  value={editThoughtText}
                  dir="auto"
                  onChange={(e) => setEditThoughtText(e.target.value)}
                  className="w-full h-120 p-2.5 rounded-lg bg-neutral-300/50 dark:bg-neutral-700/50 outline-none border-2 border-neutral-300/50 dark:border-neutral-700/50 focus:bg-transparent dark:focus:bg-transparent duration-200"
                />
                <div className="flex items-center gap-4 w-full justify-center">
                  <Button
                    onClick={handleEditThought}
                    disabled={editThoughtLoading}
                    className="text-xs sm:text-sm"
                  >
                    {editThoughtLoading ? t("Saving...") : t("Save Changes")}
                  </Button>
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      setShowEditThought(false);
                      setEditThoughtText(currentThought);
                    }}
                    className="text-xs sm:text-sm"
                  >
                    {t("Cancel")}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Thought_Card;
