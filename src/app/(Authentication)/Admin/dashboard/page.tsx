"use client";
import { Button } from "@/components/ui/button";
import { useDashboardLinks } from "@/data/DashboardLinks";
import { useSession } from "@/lib/auth-client";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { signOutAction } from "../../Actions/auth";
import Admin_Loading from "@/components/ui/Admin_Loading";
import { fadeUp, transition } from "@/Animation";
import { useAdmin } from "../../../../providers/AdminContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGT, useLocale } from "gt-next";
import System_Setting from "@/components/dashboard/System_Setting";

const MotionLink = motion.create(Link);

export default function Page() {
  const { data: session, isPending, refetch, isRefetching } = useSession();
  const { isAdmin, loadingAdmin } = useAdmin();
  const handleSignIn = async () => {
    await signOutAction();
    await refetch();
  };
  const dashboardLinks = useDashboardLinks();
  const router = useRouter();
  const t = useGT();
  const locale = useLocale();

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
                {t("Admin Dashboard")}
              </motion.h1>
              <motion.p {...fadeUp} transition={{ ...transition, delay: 0.1 }}>
                {t("Welcome back,")}
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
              <Button className="w-full ">{t("LogOut")}</Button>
            </motion.form>
          </div>

          <System_Setting />

          <section className="mb-10">
            <motion.h3
              {...fadeUp}
              transition={{ ...transition, delay: 0.4 }}
              className="mb-5"
            >
              {t("Main Links")}
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
                        <div className="p-4 rounded-xl bg-primary/20 dark:bg-primary-foreground/5">
                          <item.icon className="w-8 h-8 text-primary dark:text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-2xl font-bold mb-2">
                            {item.title}
                          </h4>
                          <p>{item.description}</p>
                        </div>
                      </div>
                      <div
                        className={`relative flex justify-end items-center text-primary dark:text-primary-foreground font-medium w-fit  ${
                          locale === "ar-EG" ? "mr-auto" : "ml-auto mr-6"
                        } `}
                      >
                        {t(" View Details")}
                        <MoveRight className="absolute top-2/4 -translate-y-2/4 left-full w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" />
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
