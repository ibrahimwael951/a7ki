"use client";
import axios from "axios";
import { T } from "gt-next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type RecentThought = {
  _id: string;
  thought: string;
  rank: string;
  createdAt: string;
};

export default function Page() {
  const [thoughts, setThoughts] = useState<RecentThought[]>([]);
  const fetchSavedThoughts = async () => {
    try {
      const response = await axios.get("/api/mySavedThought");
      setThoughts(response.data.thoughts);
    } catch (error) {
      toast.error("Failed to load saved thoughts.");
    }
  };

  useEffect(() => {
    fetchSavedThoughts();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center py-24">
      <T>
        <h1>
          Saved <span className="mark">Thoughts</span>...
        </h1>
      </T>
      <div className="max-w-2xl flex flex-col justify-center items-center gap-5 mt-5">
        {thoughts.length === 0 ? (
          <p>No saved thoughts yet.</p>
        ) : (
          thoughts.map((item) => (
            <Link
              key={item._id}
              href={`/thought/${item._id}`}
              className="block rounded-xl border-2 border-neutral-300/50 dark:border-neutral-700/50 p-4  bg-neutral-200/40 dark:bg-neutral-800/40 hover:bg-neutral-200/70 dark:hover:bg-neutral-800/70 transition-colors"
            >
              <p className="text-sm line-clamp-3 max-w-2xl" dir="auto">
                {item.thought}
              </p>
              <div className="flex items-center justify-end gap-2 mt-2">
                <span className="mark text-xs">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
