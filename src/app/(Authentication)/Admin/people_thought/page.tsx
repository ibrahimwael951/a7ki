"use client";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Admin_Loading from "@/components/ui/Admin_Loading";
import { fadeLeft, fadeOnly, fadeUp } from "@/Animation";
import { Thought } from "@/types/Thoughts";
import { useAdmin } from "../../../../providers/AdminContext";
import { useRouter } from "next/navigation";
import { useIsTablet } from "@/hooks/IsMobile";
import { T } from "gt-next";
import Link from "next/link";
export default function Page() {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Thought[] | null>(null);
  const [error, setError] = useState();
  const { isAdmin, loadingAdmin } = useAdmin();
  const isTablet = useIsTablet();
  const router = useRouter();

  async function FetchData(pageNumber = 1) {
    setLoading(true);
    try {
      const result = await axios.get(
        `/api/Admin/people_thoughts?page=${pageNumber}`,
      );

      if (pageNumber === 1) {
        setData(result.data);
      } else {
        setData((prev) => [...(prev || []), ...result.data]);
      }

      if (result.data.length < 10) {
        setHasMore(false);
      }

      setLoading(false);
    } catch (error: any) {
      setError(error.response?.data?.message || "Something broke");
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isAdmin || loadingAdmin) return;
    FetchData();
  }, [isAdmin, loadingAdmin]);

  useEffect(() => {
    if (loadingAdmin) return;
    if (!isAdmin) {
      router.push("/Admin");
    }
  }, [isAdmin, loadingAdmin, router]);

  if (error)
    return (
      <main className="flex justify-center items-center text-4xl">{error}</main>
    );
  if (!data || !isAdmin || loadingAdmin) return <Admin_Loading />;
  return (
    <main className="mt-20 p-6">
      <section className="flex flex-row justify-between items-center gap-3 md:gap-10 mb-8">
        <T>
          <motion.h3
            {...fadeLeft}
            className="lg:text-4xl! 2xl:text-5xl! flex items-center gap-3"
          >
            <MessageSquare
              size={isTablet ? 30 : 50}
              strokeWidth={3}
              className="shrink-0 mt-1 text-primary dark:text-primary-foreground"
            />
            People Thoughts
          </motion.h3>

          <Button link={"/Admin/dashboard"} variant={"outline"}>
            Go Back
          </Button>
        </T>
      </section>
      <section>
        {data.length >= 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((item) => (
              <Link
                key={item._id}
                href={`/thought/${item._id}`}
                className="block rounded-xl border-2 border-neutral-300/50 dark:border-neutral-700/50 p-4 bg-neutral-200/40 dark:bg-neutral-800/40 hover:bg-neutral-200/70 dark:hover:bg-neutral-800/70 transition-colors"
              >
                <p dir="auto" className="text-accent! dark:text-accent-foreground! text-sm line-clamp-5">{item.thought}</p>
                <div className="flex items-center justify-end gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <motion.div {...fadeOnly} className="text-center">
            <h3 className="text-primary dark:text-primary-foreground">
              There is no messages yet
            </h3>
            <p>Try again later</p>
          </motion.div>
        )}
        {hasMore && (
          <div className="flex justify-center mt-6">
            <Button
              onClick={() => {
                const nextPage = page + 1;
                setPage(nextPage);
                FetchData(nextPage);
              }}
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
        {loading && (
          <div className="flex flex-col justify-center items-center gap-5">
            <motion.div
              {...fadeUp}
              className="w-60 h-60 rounded-full border-r border-l-transparent border-primary dark:border-primary-foreground  animate-spin "
            />
            <motion.h4 {...fadeUp}>Loading...</motion.h4>
          </div>
        )}
      </section>
    </main>
  );
}
