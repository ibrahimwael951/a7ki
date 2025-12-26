"use client";
import { ContactMessagesAreaChart } from "@/components/ui/customCharts";
import { useAdmin } from "../../../../providers/AdminContext";
import Admin_Loading from "@/components/ui/Admin_Loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { T, useGT } from "gt-next";

export default function Page() {
  const router = useRouter();
  const {
    isAdmin,
    loadingAdmin,
    thoughts,
    contactMessages,
    loadingData,
    users,
  } = useAdmin();
  const t = useGT();

  useEffect(() => {
    if (loadingAdmin) return;
    if (!isAdmin) {
      router.push("/Admin");
    }
  }, [isAdmin, loadingAdmin, router]);

  if (
    !isAdmin ||
    loadingAdmin ||
    loadingData ||
    !contactMessages ||
    !thoughts ||
    !users
  )
    return <Admin_Loading />;
  return (
    <main className="py-20">
      <div className="mb-10 flex items-center justify-between gap-4 ">
        <T>
          <h1>Analyze Data</h1>
          <Button link={"/Admin/dashboard"} variant="outline">
            Go Back
          </Button>
        </T>
      </div>
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 ">
        <ContactMessagesAreaChart
          title={t("Contact Messages ")}
          description={t("Message received per day")}
          messages={contactMessages}
        />
        <ContactMessagesAreaChart
          title={t("People Thoughts ")}
          description={t("Thought received per day")}
          messages={thoughts}
        />
        <ContactMessagesAreaChart
          title={t("Users")}
          description={t("user joined per day")}
          messages={users}
        />
      </div>
    </main>
  );
}
