"use client";
import { fadeOnly } from "@/Animation";
import MessageCard from "@/components/ui/MessageCard";
import Thought_Card from "@/components/ui/Thought_Card";
import { motion } from "framer-motion";
import { Contact_Message } from "@/types/ContactMessages";
import axios from "axios";
import { use, useEffect, useState } from "react";
import { Thought } from "@/types/Thoughts";
import { useAdmin } from "../../AdminContext";
import Admin_Loading from "@/components/ui/Admin_Loading";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useIsMobile } from "@/hooks/IsMobile";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [Thoughts, setThoughts] = useState<Thought[]>([]);
  const [contactMessages, setContactMessages] = useState<Contact_Message[]>([]);
  const { isAdmin, loadingAdmin } = useAdmin();
  const router = useRouter();
  const isMobile = useIsMobile();

  const fetchUser = async () => {
    if (!isAdmin) return;
    try {
      const data = await axios.get("/api/Admin/users", { params: { id } });
      setThoughts(data.data.userThoughts);
      setContactMessages(data.data.userContactMessages);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id || !isAdmin || loadingAdmin) return;
    fetchUser();
  }, [id, loadingAdmin, isAdmin]);

  useEffect(() => {
    if (loadingAdmin) return;
    if (!isAdmin) {
      router.push("/Admin");
    }
  }, [isAdmin, loadingAdmin, router]);

  if (loading || !isAdmin || loadingAdmin) return <Admin_Loading />;
  return (
    <main className="pt-20 space-y-10">
      <section className="text-start flex items-center justify-between gap-5 ">
        <div>
          <h1 className="flex items-center gap-3">
            <User size={isMobile ? 30 : 55} className="mark" />
            User
          </h1>
          <p>{id}</p>
        </div>
        <div className="flex flex-col justify-center items-center gap-5 my-5">
          <Button link={"/Admin/people_thought"} variant={"outline"}>
            Go Back
          </Button>
          <Button variant={"destructive"}>Ban User</Button>
        </div>
      </section>

      <section className="min-h-[400px]">
        <h3>User Thoughts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {Thoughts.map((item) => (
            <Thought_Card
              key={item._id}
              thoughtId={item._id}
              ThoughtFeedback={item.feedback}
              userId={item.userId}
              thought={item.thought}
              rank={item.rank}
              createdAt={item.createdAt}
            />
          ))}
        </div>
      </section>

      <section className="min-h-[400px]">
        <h3>User Contact Messages</h3>
        <div className="mt-4">
          {contactMessages.length >= 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactMessages.map((item) => (
                <MessageCard
                  key={item._id}
                  _id={item._id}
                  name={item.name}
                  email={item.email}
                  message={item.message}
                  createdAt={item.createdAt}
                />
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
        </div>
      </section>
    </main>
  );
}
