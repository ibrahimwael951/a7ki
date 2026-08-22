"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { fadeOnly, fadeUp } from "@/Animation";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { Comment } from "@/types/Comment";
import { T, useGT, useLocale } from "gt-next";
import { MessageSquare, Pencil, Trash2, CornerDownRight } from "lucide-react";
import { toast } from "sonner";

type Props = {
  thoughtId: string;
};

function getErrorMessage(err: any, fallback: string) {
  return (
    err?.response?.data?.problem ||
    err?.response?.data?.error ||
    fallback
  );
}

export default function Comment_Section({ thoughtId }: Props) {
  const { data: session } = useSession();
  const t = useGT();
  const locale = useLocale();

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/comment/${thoughtId}`);
      setComments(res.data);
    } catch (err) {
      console.log("Failed to load comments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!thoughtId) return;
    loadComments();
  }, [thoughtId]);

  const handleCreateTopLevel = async () => {
    if (!session) return;
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await axios.post("/api/comment", {
        thoughtId,
        userId: session.user.id,
        content: newComment.trim(),
        locale,
      });
      setNewComment("");
      await loadComments();
    } catch (err: any) {
      toast.error(getErrorMessage(err, t("Failed to post comment")), {
        position: "bottom-right",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div {...fadeUp} className="w-full mt-10 flex flex-col gap-6">
      <T>
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <MessageSquare size={30} className="mark" />
          Comments
        </h3>
      </T>

      {/* New top-level comment box */}
      {session ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            maxLength={1000}
            placeholder={t("Write a comment...")}
            className="w-full min-h-20 p-2.5 rounded-lg bg-neutral-300/50 dark:bg-neutral-700/50 outline-none border-2 border-neutral-300/50 dark:border-neutral-700/50 focus:bg-transparent dark:focus:bg-transparent duration-200 resize-none"
            disabled={submitting}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleCreateTopLevel}
              disabled={submitting || !newComment.trim()}
            >
              {submitting ? t("Posting...") : t("Post Comment")}
            </Button>
          </div>
        </div>
      ) : (
        <T>
          <p className="text-sm text-muted-foreground">
            Sign in to leave a comment.
          </p>
        </T>
      )}

      {/* Comment list */}
      {loading ? (
        <motion.div {...fadeOnly} className="flex justify-center py-10">
          <div className="w-10 h-10 rounded-full border-r border-l-transparent border-primary dark:border-primary-foreground animate-spin" />
        </motion.div>
      ) : comments.length === 0 ? (
        <T>
          <p className="text-sm text-muted-foreground text-center py-6">
            No comments yet. Be the first to share your thoughts.
          </p>
        </T>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              thoughtId={thoughtId}
              currentUserId={session?.user?.id ?? null}
              onChanged={loadComments}
              depth={0}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function CommentItem({
  comment,
  thoughtId,
  currentUserId,
  onChanged,
  depth,
}: {
  comment: Comment;
  thoughtId: string;
  currentUserId: string | null;
  onChanged: () => Promise<void> | void;
  depth: number;
}) {
  const t = useGT();
  const locale = useLocale();
  const { data: session } = useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyValue, setReplyValue] = useState("");
  const [busy, setBusy] = useState(false);

  const isOwner = currentUserId === comment.userId;

  const handleEdit = async () => {
    if (!editValue.trim()) return;
    setBusy(true);
    try {
      await axios.put("/api/comment", {
        commentId: comment._id,
        userId: currentUserId,
        content: editValue.trim(),
        locale,
      });
      setIsEditing(false);
      await onChanged();
    } catch (err: any) {
      toast.error(getErrorMessage(err, t("Failed to edit comment")), {
        position: "bottom-right",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await axios.delete("/api/comment", {
        data: { commentId: comment._id, userId: currentUserId },
      });
      await onChanged();
    } catch (err: any) {
      toast.error(getErrorMessage(err, t("Failed to delete comment")), {
        position: "bottom-right",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleReply = async () => {
    if (!session) return;
    if (!replyValue.trim()) return;
    setBusy(true);
    try {
      await axios.post("/api/comment", {
        thoughtId,
        userId: session.user.id,
        content: replyValue.trim(),
        parentCommentId: comment._id,
        locale,
      });
      setReplyValue("");
      setIsReplying(false);
      await onChanged();
    } catch (err: any) {
      toast.error(getErrorMessage(err, t("Failed to post reply")), {
        position: "bottom-right",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={`flex flex-col gap-2 ${
        depth > 0 ? "pl-4 md:pl-6 border-l-2 border-neutral-300/50 dark:border-neutral-700/50" : ""
      }`}
    >
      <div className="rounded-xl border-2 border-neutral-300/50 dark:border-neutral-700/50 p-4 bg-neutral-200/40 dark:bg-neutral-800/40">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <textarea
              dir="auto"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              maxLength={1000}
              className="w-full min-h-16 p-2 rounded-lg bg-neutral-300/50 dark:bg-neutral-700/50 outline-none border-2 border-neutral-300/50 dark:border-neutral-700/50 resize-none"
              disabled={busy}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditValue(comment.content);
                }}
                disabled={busy}
              >
                {t("Cancel")}
              </Button>
              <Button size="sm" onClick={handleEdit} disabled={busy || !editValue.trim()}>
                {busy ? t("Saving...") : t("Save")}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-sm  whitespace-pre-wrap" dir="auto">{comment.content}</div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                {comment.edited && <T><span>(edited)</span></T>}
              </div>
              <div className="flex items-center gap-1">
                {session && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsReplying((v) => !v)}
                    className="h-7 px-2"
                  >
                    <CornerDownRight size={14} />
                  </Button>
                )}
                {isOwner && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="h-7 px-2"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                      disabled={busy}
                      className="h-7 px-2"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Reply box */}
      <AnimatePresence>
        {isReplying && (
          <motion.div
            {...fadeOnly}
            className="flex flex-col gap-2 pl-4 md:pl-6"
          >
            <textarea
              value={replyValue}
              onChange={(e) => setReplyValue(e.target.value)}
              maxLength={1000}
              placeholder={t("Write a reply...")}
              className="w-full min-h-16 p-2 rounded-lg bg-neutral-300/50 dark:bg-neutral-700/50 outline-none border-2 border-neutral-300/50 dark:border-neutral-700/50 resize-none"
              disabled={busy}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsReplying(false);
                  setReplyValue("");
                }}
                disabled={busy}
              >
                {t("Cancel")}
              </Button>
              <Button size="sm" onClick={handleReply} disabled={busy || !replyValue.trim()}>
                {busy ? t("Posting...") : t("Reply")}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="flex flex-col gap-4 mt-1">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              thoughtId={thoughtId}
              currentUserId={currentUserId}
              onChanged={onChanged}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}