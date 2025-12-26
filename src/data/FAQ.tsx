import { useGT } from "gt-next";


export const useFAQ_Questions = () => {
  const t = useGT();
  return [
    {
      label: t("Is A7KI completely anonymous?"),
      description: t(
        "Yes! You can share your story or read others’ stories without ever revealing your identity."
      ),
    },
    {
      label: t("Can I interact with other users?"),
      description: t(
        "You can react and comment in a safe, supportive environment, but your personal details remain hidden."
      ),
    },
    {
      label: t("What kind of stories can I share?"),
      description: t(
        "Any personal experience or emotional story you feel comfortable sharing — serious or lighthearted, all are welcome."
      ),
    },
    {
      label: t("Is my data safe?"),
      description: t(
        "Absolutely. We do not track or store personal information. Your stories remain private and secure."
      ),
    },
    {
      label: t("Can I delete my story?"),
      description: t(
        "Yes, you can remove any story you’ve posted at any time with a single click."
      ),
    },
  ];
};
