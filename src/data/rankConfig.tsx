import { useGT } from "gt-next";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
} from "lucide-react";

export const useRankConfig = () => {
  const t = useGT();

  return {
    good: {
      icon: CheckCircle,
      iconColor: "text-green-600",
      badge: "bg-green-600 text-white",
      label: t("Safe Content"),
    },
    okay: {
      icon: Shield,
      iconColor: "text-blue-600",
      badge: "bg-blue-600 text-white",
      label: t("Acceptable"),
    },
    "kinda bad": {
      icon: AlertTriangle,
      iconColor: "text-orange-600",
      badge: "bg-orange-600 text-white",
      label: t("Flagged"),
    },
    bad: {
      icon: XCircle,
      iconColor: "text-red-600",
      badge: "bg-red-600 text-white",
      label: t("Inappropriate"),
    },
    unknown: {
      icon: HelpCircle,
      iconColor: "text-gray-600",
      badge: "bg-gray-600 text-white",
      label: t("Under Review"),
    },
  } as const;
};
