import { MessageSquare, Users, UserX } from "lucide-react";

export const dashboardLinks = [
    {
      title: "Contact Messages",
      path: "/Admin/contact_messages",
      icon: MessageSquare,
      description: "View all contact form submissions",
    },
    {
      title: "People Thought",
      path: "/Admin/people_thought",
      icon: Users,
      description: "Browse user thoughts and feedback",
    },
    {
      title: "Blocked People",
      path: "/Admin/blocked_people",
      icon: UserX,
      description: "Manage blocked users",
    },
  ];