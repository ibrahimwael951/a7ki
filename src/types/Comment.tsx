export type Comment = {
  _id: string;
  thoughtId: string;
  userId: string;
  content: string;
  parentCommentId: string | null;
  edited: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[]; // populated client-side / server-side when building the tree
};