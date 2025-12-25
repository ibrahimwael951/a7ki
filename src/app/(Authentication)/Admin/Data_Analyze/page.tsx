"use client";
import { ContactMessagesAreaChart } from "@/components/ui/customCharts";
import { useAdmin } from "../../../../providers/AdminContext";
import Admin_Loading from "@/components/ui/Admin_Loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

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
        <h1>Analyze Data</h1>
        <Button link={"/Admin/dashboard"} variant="outline">
          Go Back
        </Button>
      </div>
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 ">
        <ContactMessagesAreaChart
          title="Contact Messages "
          description="Message received per day"
          messages={contactMessages}
        />
        <ContactMessagesAreaChart
          title="People Thoughts "
          description="Thought received per day"
          messages={thoughts}
        />
        <ContactMessagesAreaChart
          title="Users"
          description="user joined per day"
          messages={users}
        />
      </div>
    </main>
  );
}
