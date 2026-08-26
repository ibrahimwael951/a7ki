"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { fadeOnly, fadeUp } from "@/Animation";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { Comment } from "@/types/Comment";
import { T, useGT, useLocale } from "gt-next";
import {
  MessageSquare,
  Pencil,
  Trash2,
  CornerDownRight,
  User,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

type Props = {
  thoughtId: string;
};

function getErrorMessage(err: any, fallback: string) {
  return err?.response?.data?.problem || err?.response?.data?.error || fallback;
}

function addReplyToTree(
  tree: Comment[],
  parentId: string,
  newReply: Comment,
): Comment[] {
  return tree.map((node) => {
    if (node._id === parentId) {
      return {
        ...node,
        replies: [...(node.replies || []), newReply],
        totalReplies: (node.totalReplies ?? node.replies?.length ?? 0) + 1,
      };
    }
    if (node.replies && node.replies.length > 0) {
      return { ...node, replies: addReplyToTree(node.replies, parentId, newReply) };
    }
    return node;
  });
}

function removeNodeFromTree(tree: Comment[], id: string): Comment[] {
  return tree
    .filter((node) => node._id !== id)
    .map((node) => {
      if (!node.replies || node.replies.length === 0) return node;
      const hadDirectMatch = node.replies.some((r) => r._id === id);
      return {
        ...node,
        replies: removeNodeFromTree(node.replies, id),
        totalReplies:
          hadDirectMatch && node.totalReplies != null
            ? Math.max(0, node.totalReplies - 1)
            : node.totalReplies,
      };
    });
}

function updateNodeContent(tree: Comment[], id: string, content: string): Comment[] {
  return tree.map((node) => {
    if (node._id === id) {
      return { ...node, content, edited: true };
    }
    if (node.replies && node.replies.length > 0) {
      return { ...node, replies: updateNodeContent(node.replies, id, content) };
    }
    return node;
  });
}

function appendRepliesToNode(
  tree: Comment[],
  nodeId: string,
  newReplies: Comment[],
  newHasMore: boolean,
): Comment[] {
  return tree.map((node) => {
    if (node._id === nodeId) {
      return {
        ...node,
        replies: [...(node.replies || []), ...newReplies],
        hasMoreReplies: newHasMore,
      };
    }
    if (node.replies && node.replies.length > 0) {
      return {
        ...node,
        replies: appendRepliesToNode(node.replies, nodeId, newReplies, newHasMore),
      };
    }
    return node;
  });
}

type TreeUpdater = (tree: Comment[]) => Comment[];

export default function Comment_Section({ thoughtId }: Props) {
  const { data: session } = useSession();
  const t = useGT();
  const locale = useLocale();

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Top-level pagination / infinite scroll state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const applyTreeUpdate = (updater: TreeUpdater) => {
    setComments((prev) => updater(prev));
  };

  const fetchPage = async (pageNum: number) => {
    const res = await axios.get(`/api/comment/${thoughtId}`, {
      params: { page: pageNum, limit: 10, repliesLimit: 0 },
    });
    return res.data as { comments: Comment[]; hasMore: boolean; page: number };
  };

  const loadInitial = async () => {
    setLoading(true);
    try {
      const data = await fetchPage(1);
      setComments(data.comments);
      setHasMore(data.hasMore);
      setPage(1);
    } catch (err) {
      console.log("Failed to load comments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!thoughtId) return;
    loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thoughtId]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await fetchPage(nextPage);
      setComments((prev) => [...prev, ...data.comments]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch (err) {
      console.log("Failed to load more comments", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Infinite scroll: watch a sentinel div at the bottom of the list
  useEffect(() => {
    if (!hasMore) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loadingMore, page]);

  const handleCreateTopLevel = async () => {
    if (!session) return;
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await axios.post("/api/comment", {
        thoughtId,
        userId: session.user.id,
        content: newComment.trim(),
        locale,
      });

      const created: Comment = {
        ...res.data,
        userName: session.user.name,
        replies: [],
        totalReplies: 0,
        hasMoreReplies: false,
      };

      setComments((prev) => [...prev, created]);
      setNewComment("");
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
        <>
          <div className="flex flex-col gap-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                thoughtId={thoughtId}
                currentUserId={session?.user?.id ?? null}
                onUpdateTree={applyTreeUpdate}
                depth={0}
              />
            ))}
          </div>

          {/* Infinite-scroll sentinel + loading state for more TOP-LEVEL comments */}
          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center py-4">
              {loadingMore && (
                <div className="w-6 h-6 rounded-full border-r border-l-transparent border-primary dark:border-primary-foreground animate-spin" />
              )}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------
// Recursive comment node — renders a comment plus its currently-loaded
// replies, handles edit / delete / reply for itself, and exposes a
// "Show more replies" button when the server says more exist.
// ---------------------------------------------------------------------
function CommentItem({
  comment,
  thoughtId,
  currentUserId,
  onUpdateTree,
  depth,
}: {
  comment: Comment;
  thoughtId: string;
  currentUserId: string | null;
  onUpdateTree: (updater: TreeUpdater) => void;
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
  const [loadingReplies, setLoadingReplies] = useState(false);

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
      onUpdateTree((tree) => updateNodeContent(tree, comment._id, editValue.trim()));
      setIsEditing(false);
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
    const toastId = toast.loading(t("Deleting...."));
    try {
      await axios.delete("/api/comment", {
        data: { commentId: comment._id, userId: currentUserId },
      });
      onUpdateTree((tree) => removeNodeFromTree(tree, comment._id));
      toast.success(t("Comment Deleted Successfully"), { id: toastId });
    } catch (err: any) {
      toast.error(getErrorMessage(err, t("Failed to delete comment")), {
        id: toastId,
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
      const res = await axios.post("/api/comment", {
        thoughtId,
        userId: session.user.id,
        content: replyValue.trim(),
        parentCommentId: comment._id,
        locale,
      });

      const created: Comment = {
        ...res.data,
        userName: session.user.name,
        replies: [],
        totalReplies: 0,
        hasMoreReplies: false,
      };

      onUpdateTree((tree) => addReplyToTree(tree, comment._id, created));
      setReplyValue("");
      setIsReplying(false);
    } catch (err: any) {
      toast.error(getErrorMessage(err, t("Failed to post reply")), {
        position: "bottom-right",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleLoadMoreReplies = async () => {
    setLoadingReplies(true);
    try {
      const skip = comment.replies?.length || 0;
      const res = await axios.get("/api/comment/replies", {
        params: { commentId: comment._id, skip, limit: 3 },
      });
      onUpdateTree((tree) =>
        appendRepliesToNode(tree, comment._id, res.data.replies, res.data.hasMore),
      );
    } catch (err: any) {
      toast.error(getErrorMessage(err, t("Failed to load replies")), {
        position: "bottom-right",
      });
    } finally {
      setLoadingReplies(false);
    }
  };

  const remainingReplies = Math.max(
    (comment.totalReplies ?? 0) - (comment.replies?.length || 0),
    0,
  );

  return (
    <div
      className={`flex flex-col gap-2 ${
        depth > 0
          ? "pl-4 md:pl-6 border-l-2 border-neutral-300/50 dark:border-neutral-700/50"
          : ""
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
              <Button
                size="sm"
                onClick={handleEdit}
                disabled={busy || !editValue.trim()}
              >
                {busy ? t("Saving...") : t("Save")}
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Author row */}
            {comment.userName && (
              <div className="flex items-center gap-1.5 mb-2 text-muted-foreground max-w-70">
                <User size={13} className="mark" strokeWidth={3} />
                <span className="text-foreground! text-xs font-medium truncate">
                  {comment.userName}
                </span>
              </div>
            )}

            <div className="text-md whitespace-pre-wrap" dir="auto">
              {comment.content}
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                {comment.edited && (
                  <T>
                    <span>(edited)</span>
                  </T>
                )}
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
              <Button
                size="sm"
                onClick={handleReply}
                disabled={busy || !replyValue.trim()}
              >
                {busy ? t("Posting...") : t("Reply")}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Currently-loaded nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="flex flex-col gap-4 mt-1">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              thoughtId={thoughtId}
              currentUserId={currentUserId}
              onUpdateTree={onUpdateTree}
              depth={depth + 1}
            />
          ))}
        </div>
      )}

      {/* "Show more replies" — under the comment, only if the server says more exist */}
      {comment.hasMoreReplies && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLoadMoreReplies}
          disabled={loadingReplies}
          className="self-start ml-4 md:ml-6 text-xs flex items-center gap-1"
        >
          {loadingReplies ? (
            t("Loading...")
          ) : (
            <>
              {t("Show more replies")} ({remainingReplies})
            </>
          )}
        </Button>
      )}
    </div>
  );
}