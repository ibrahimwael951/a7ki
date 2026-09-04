import { RankKey } from "./Thoughts_Rank";

export type Thought = {
  _id: string;
  userId: string;
  userName?: string;
  thought: string;
  country: string;
  rank: RankKey;
  views?: number;
  saved?: boolean;
  createdAt: string;
  feedback?: ThoughtFeedback[];
};

export type ThoughtFeedback = {
  _id: string;
  thoughtId: string;
  message: string;
  AdminName: string;
  createdAt: string;
};
