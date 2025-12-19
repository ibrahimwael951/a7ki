import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
} from "lucide-react";
export const rankConfig: Record<string, any> = {
  good: {
    icon: CheckCircle,
    iconColor: "text-green-600",
    badge: "bg-green-600 text-white",
    label: "Safe Content",
  },
  okay: {
    icon: Shield,
    iconColor: "text-blue-600",
    badge: "bg-blue-600 text-white",
    label: "Acceptable",
  },
  "kinda bad": {
    icon: AlertTriangle,
    iconColor: "text-orange-600 ",
    badge: "bg-orange-600 text-white",
    label: "Flagged",
  },
  bad: {
    icon: XCircle,
    iconColor: "text-red-600",
    badge: "bg-red-600 text-white",
    label: "Inappropriate",
  },
  unknown: {
    icon: HelpCircle,
    iconColor: "text-gray-600",
    badge: "bg-gray-600 text-white",
    label: "Under Review",
  },
};
