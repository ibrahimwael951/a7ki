import { RankKey } from "./Thoughts_Rank";

export type Thought = {
  _id: string;
  userId: string;
  thought: string;
  createdAt: string;
  country: string;
  rank: RankKey;
  feedback: ThoughtFeedback[];
};

export type ThoughtFeedback = {
  _id: string;
  thoughtId: string;
  message: string;
  AdminName: string;
  createdAt: string;
};
