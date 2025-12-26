import { useGT } from "gt-next";
import { Lock, Heart, Users, Smile } from "lucide-react";

export const useFeatures = () => {
  const t = useGT();

  return [
    {
      label: t("Private Messages Until Deadline"),
      description: t(
        "All messages users send remain private until the deadline."
      ),
      icon: Lock,
    },
    {
      label: t("Feel Better"),
      description: t(
        "Helps you process all bad moments you had and feel better."
      ),
      icon: Heart,
    },
    {
      label: t("Share & Connect"),
      description: t("Share your bad moments with others and feel not alone."),
      icon: Users,
    },
    {
      label: t("Learn from Others"),
      description: t(
        "Benefit from other people's experiences and feel better yourself."
      ),
      icon: Smile,
    },
  ];
};

