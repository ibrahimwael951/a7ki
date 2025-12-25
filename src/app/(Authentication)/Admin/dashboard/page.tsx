"use client";
import { Button } from "@/components/ui/button";
import { dashboardLinks } from "@/data/DashboardLinks";
import { useSession } from "@/lib/auth-client";
import { Languages, MoveRight, Shirt } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { signOutAction } from "../../Actions/auth";
import Admin_Loading from "@/components/ui/Admin_Loading";
import { fadeUp, transition } from "@/Animation";
import { useAdmin } from "../../../../providers/AdminContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/IsMobile";
import { useTheme } from "next-themes";

const MotionLink = motion.create(Link);

export default function Page() {
  const { data: session, isPending, refetch, isRefetching } = useSession();
  const { isAdmin, loadingAdmin } = useAdmin();
  const handleSignIn = async () => {
    await signOutAction();
    await refetch();
  };
  const { setTheme, resolvedTheme } = useTheme();
  const isMobile = useIsMobile();
  const router = useRouter();

  useEffect(() => {
    if (loadingAdmin) return;
    if (!isAdmin) {
      router.push("/Admin");
    }
  }, [isAdmin, loadingAdmin, router]);

  if (isPending || isRefetching || !isAdmin || loadingAdmin)
    return <Admin_Loading />;
  if (session)
    return (
      <main className="pt-20 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:justify-between mb-12 text-center md:text-start">
            <div>
              <motion.h1
                {...fadeUp}
                transition={{ ...transition, delay: 0 }}
                className="text-4xl font-bold mb-2"
              >
                Admin Dashboard
              </motion.h1>
              <motion.p {...fadeUp} transition={{ ...transition, delay: 0.1 }}>
                Welcome back,
                <span className="mark text-xl font-semibold">
                  {" "}
                  {session.user.name}
                </span>
              </motion.p>
            </div>
            <motion.form
              {...fadeUp}
              transition={{ ...transition, delay: 0.2 }}
              action={handleSignIn}
              className="w-full md:w-fit"
            >
              <Button className="w-full ">LogOut</Button>
            </motion.form>
          </div>
          <section className="my-10">
            <motion.h3 {...fadeUp} transition={{ ...transition, delay: 0.3 }}>
              System Setting
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-5">
              <motion.button
                {...fadeUp}
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
                className="relative p-6 rounded-2xl border border-primary/30 dark:border-primary shadow-sm text-left hover:shadow-lg focus:outline-none duration-200 cursor-pointer disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-primary/20 dark:bg-primary-foreground/20">
                    <Shirt className="w-8 h-8 text-primary dark:text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">theme</div>
                    <div className="text-sm text-muted-foreground">
                      {`${isMobile ? "Tap" : "Click"} to `}
                      change to{" "}
                      <span className="mark">
                        {" "}
                        {resolvedTheme === "dark" ? "light" : "dark"} mode{" "}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
              <motion.button
                className="relative p-6 rounded-2xl border border-primary/30 dark:border-primary shadow-sm text-left hover:shadow-lg focus:outline-none duration-200 cursor-pointer disabled:cursor-not-allowed"
                {...fadeUp}
              >
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-primary/20 dark:bg-primary-foreground/20">
                    <Languages className="w-8 h-8 text-primary dark:text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Language</div>
                    <div className="text-sm text-muted-foreground">
                      Click to change Language
                    </div>
                  </div>
                </div>
              </motion.button>
            </div>{" "}
          </section>

          <section className="my-10">
            <motion.h3 {...fadeUp} transition={{ ...transition, delay: 0.4 }}>
              Main Links
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboardLinks.map((item, i) => {
                return (
                  <MotionLink
                    {...fadeUp}
                    transition={{ ...transition, delay: 0.3 + i / 8 }}
                    key={item.path}
                    href={item.path}
                    className="group block"
                  >
                    <div className="h-full border-2 border-primary/20 dark:border-primary rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-4 rounded-xl bg-primary/20 dark:bg-primary-foreground/20">
                          <item.icon className="w-8 h-8 text-primary dark:text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-2xl font-bold mb-2 text-primary dark:text-primary-foreground ">
                            {item.title}
                          </h4>
                          <p>{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-primary dark:text-primary-foreground font-medium">
                        View Details
                        <MoveRight className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </MotionLink>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    );
}
