import { create } from "zustand";
import axios from "axios";
import { Thought } from "@/types/Thoughts";

const PAGE_LIMIT = 10;

type MomentsFeedState = {
  thoughts: Thought[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  hasFetchedOnce: boolean;
  error: string | null;
  fetchInitial: () => Promise<void>;
  fetchMore: () => Promise<void>;
};

export const useMomentsFeedStore = create<MomentsFeedState>((set, get) => ({
  thoughts: [],
  page: 1,
  hasMore: true,
  loading: false,
  loadingMore: false,
  hasFetchedOnce: false,
  error: null,

  fetchInitial: async () => {
    // Already cached from a previous visit this session (e.g. user
    // navigated away and came back) — skip hitting the API again.
    if (get().hasFetchedOnce) return;

    set({ loading: true, error: null });
    try {
      const res = await axios.get("/api/thought/feed", {
        params: { page: 1, limit: PAGE_LIMIT },
      });
      set({
        thoughts: res.data.thoughts,
        page: 1,
        hasMore: res.data.hasMore,
        hasFetchedOnce: true,
      });
    } catch (err: any) {
      set({ error: err?.response?.data?.error || "Failed to load moments" });
    } finally {
      set({ loading: false });
    }
  },

  fetchMore: async () => {
    const { loadingMore, hasMore, page } = get();
    if (loadingMore || !hasMore) return;

    set({ loadingMore: true });
    try {
      const nextPage = page + 1;
      const res = await axios.get("/api/thought", {
        params: { page: nextPage, limit: PAGE_LIMIT },
      });
      set((state) => ({
        thoughts: [...state.thoughts, ...res.data.thoughts],
        page: nextPage,
        hasMore: res.data.hasMore,
      }));
    } catch (err: any) {
      set({
        error: err?.response?.data?.error || "Failed to load more moments",
      });
    } finally {
      set({ loadingMore: false });
    }
  },
}));