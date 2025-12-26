import { useGT } from "gt-next";

export const useMainLinks = () => {
  const t = useGT();

  return [
    { href: "/", label: t("Home") },
    { href: "/about", label: t("About") },
    { href: "/moments", label: t("Moments") },
    { href: "/contact", label: t("Contact") },
  ];
};
