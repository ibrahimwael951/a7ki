"use client";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Clock, Mail, MessageSquare, Trash2, User, X } from "lucide-react";
import { Contact_Message } from "@/types/ContactMessages";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "./button";
import { motion, AnimatePresence } from "motion/react";
import { fadeOnly, fadeUp, transition } from "@/Animation";

dayjs.extend(relativeTime);

const MessageCard = ({
  message,
  _id,
  name,
  email,
  createdAt,
}: Contact_Message) => {
  const [showEmail, setShowEmail] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [warning, setWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  async function DeleteMessage() {
    setLoading(true);
    try {
      axios.delete("/api/contact/admin", { data: { _id } });
      setDeleted(true);
      toast.success("messageDeleted Successfully", {
        description: "Try again later",
      });
    } catch (error: any) {
      toast.error(error.message || error.error || "Unknown Error", {
        description: "Try again later",
      });
    } finally {
      setLoading(false);
    }
  }
  if (deleted) return;
  return (
    <>
      <motion.div
        variants={fadeOnly}
        initial="initial"
        whileInView={"animate"}
        {...transition}
        viewport={{ margin: "-100px" }}
        className="relative border border-accent rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 overflow-hidden"
      >
        <Button
          title="Delete message"
          onClick={() => setWarning(true)}
          className="absolute top-0 right-0 rounded-none rounded-bl-2xl "
        >
          <Trash2 />
        </Button>
        <div className="flex items-center gap-1 mb-4">
          <User strokeWidth={3} size={35} className="mark  shrink-0 mt-1" />
          <h4 className="text-primary dark:text-primary-foreground font-semibold">
            {name}
          </h4>
        </div>

        <div
          onClick={() => setShowEmail(!showEmail)}
          className="flex items-center gap-3 mb-4 cursor-pointer hover:opacity-70 transition-opacity"
        >
          <Mail strokeWidth={3} className="mark w-4 h-4 shrink-0" />
          <p>{showEmail ? email : <span>Hidden Email</span>}</p>
        </div>

        <div className="flex items-start gap-3 mb-4">
          <MessageSquare
            strokeWidth={3}
            className="mark w-4 h-4 shrink-0 mt-1"
          />
          <h6 className="leading-relaxed">{message}</h6>
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-accent/50">
          <Clock strokeWidth={3} className="mark w-4 h-4 shrink-0" />
          <p className="opacity-75">{dayjs(createdAt).fromNow()}</p>
        </div>
      </motion.div>
      <AnimatePresence>
        {warning && (
          <>
            <motion.div
              {...fadeOnly}
              className="fixed top-0 left-0 w-full h-screen bg-black/20 backdrop-blur-xs z-50"
              onClick={() => setWarning(loading ? true : false)}
            />
            <motion.div
              {...fadeUp}
              className="fixed top-2/4 left-2/4 -translate-2/4 w-[90%] h-[400px] max-w-2xl p-10 gap-5 bg-background border-2 border-primary rounded-2xl text-center overflow-hidden z-50"
            >
              <Button
                onClick={() => setWarning(false)}
                disabled={loading}
                className="absolute top-0 right-0 rounded-none rounded-bl-2xl"
              >
                <X />
              </Button>
              {loading ? (
                <motion.div
                  id="Loading"
                  className="w-full h-full flex flex-col justify-center items-center gap-5 text-center"
                >
                  <div className="w-20 h-20 rounded-full border-r border-l-transparent border-primary dark:border-primary-foreground  animate-spin " />
                  <h4 className="animate-pulse">Loading...</h4>
                </motion.div>
              ) : (
                <motion.div
                  {...fadeOnly}
                  id="Not_Loading"
                  className="w-full h-full flex flex-col justify-evenly items-center"
                >
                  <h3 className="mark">
                    Are you sure you want delete this message ?
                  </h3>
                  <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                    <Button variant={"destructive"} onClick={DeleteMessage}>
                      Yes, delete this message
                    </Button>
                    <Button
                      variant={"outline"}
                      onClick={() => setWarning(false)}
                    >
                      No, Keep the message{" "}
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MessageCard;
