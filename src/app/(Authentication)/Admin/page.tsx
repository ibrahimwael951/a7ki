"use client";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signInAction } from "../Actions/auth";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import Admin_Loading from "@/components/ui/Admin_Loading";
import { fadeUp, transition } from "@/Animation";

export default function AdminPanel() {
  const { data: session, isPending, refetch, isRefetching } = useSession();

  const handleSignIn = async (formData: FormData) => {
    await signInAction(formData);
    await refetch();
  };

  if (isPending || session || isRefetching) return <Admin_Loading />;
  return (  
    <main className="flex items-center justify-center p-6">
      <div
        className="w-full max-w-md"
        style={{
          animation: "fadeIn 0.6s ease-out",
        }}
      >
        <div className="text-center mb-8">
          <motion.h1
            {...fadeUp}
            transition={{ ...transition, delay: 0 }}
            className="text-4xl font-bold mb-2"
          >
            <span className="mark">Admin</span> Login
          </motion.h1>
          <motion.p {...fadeUp} transition={{ ...transition, delay: 0.1 }}>
            Enter your credentials to continue
          </motion.p>
        </div>

        <div className="  rounded-2xl shadow-2xl p-8 border-2  border-primary/40 dark:border-primary">
          <form action={handleSignIn} className="space-y-6">
            <motion.div {...fadeUp} transition={{ ...transition, delay: 0.2 }}>
              <label className="block mb-2 font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary dark:text-primary-foreground" />
                <input
                  type="email"
                  name="email"
                  className="w-full pl-12 p-2.5 rounded-lg bg-neutral-300/50 dark:bg-neutral-700/50 mt-3 mb-1.5 outline-none border-2 border-neutral-300/50 dark:border-neutral-700/50 focus:bg-transparent dark:focus:bg-transparent duration-200 disabled:cursor-not-allowed"
                  placeholder="admin@example.com"
                  required
                  disabled={isPending}
                />
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ ...transition, delay: 0.25 }}>
              <label className="block mb-2 font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary dark:text-primary-foreground" />
                <input
                  type="password"
                  name="password"
                  className="w-full pl-12 p-2.5 rounded-lg bg-neutral-300/50 dark:bg-neutral-700/50 mt-3 mb-1.5 outline-none border-2 border-neutral-300/50 dark:border-neutral-700/50 focus:bg-transparent dark:focus:bg-transparent duration-200 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                  required
                  disabled={isPending}
                />
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ ...transition, delay: 0.3 }}>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full py-4 font-semibold hover:shadow-xl"
              >
                {isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      style={{
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </motion.div>
          </form>
        </div>
      </div>
    </main>
  );
}
