import { useGT } from "gt-next";
import { ChartLine, MessageSquare, Users, UserX } from "lucide-react";

export const useDashboardLinks = () => {
  const t = useGT();

  return [
    {
      title: t("Contact Messages"),
      path: "/Admin/contact_messages",
      icon: MessageSquare,
      description: t("View all contact form submissions"),
    },
    {
      title: t("People Thought"),
      path: "/Admin/people_thought",
      icon: Users,
      description: t("Browse user thoughts and feedback"),
    },
    {
      title: t("Blocked People"),
      path: "/Admin/blocked_people",
      icon: UserX,
      description: t("Manage blocked users"),
    },
    {
      title: t("Data Analyze"),
      path: "/Admin/Data_Analyze",
      icon: ChartLine,
      description: t("See All Data progress"),
    },
  ];
};
