export type Comment = {
  _id: string;
  thoughtId: string;
  userId: string;
  userName?: string;
  content: string;
  parentCommentId: string | null;
  edited: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
  totalReplies?: number;
  hasMoreReplies?: boolean;
};