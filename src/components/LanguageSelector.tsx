import { useLocaleSelector } from "gt-next/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
export default function LocaleSelector({
  locales: _locales,
  ...props
}: {
  locales?: string[];
  [key: string]: any;
}): React.JSX.Element | null {
  const { locale, locales, setLocale, getLocaleProperties } = useLocaleSelector(
    _locales ? _locales : undefined
  );

  const getDisplayName = (locale: string) => {
    return capitalizeLanguageName(
      getLocaleProperties(locale).nativeNameWithRegionCode
    );
  };

  if (!locales || locales.length === 0 || !setLocale) {
    return null;
  }

  return (
    <Select
      value={locale || ""}
      onValueChange={(value) => setLocale(value)}
      {...props}
    >
      <SelectTrigger className=" not-[]: w-full">
        <SelectValue placeholder="Select locale…" />
      </SelectTrigger>
      <SelectContent className="z-100 bg-primary text-white ">
        {locales.map((loc) => (
          <SelectItem key={loc} value={loc} className="hover:bg-white! dark:hover:bg-primary-foreground!">
            {getDisplayName(loc)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function capitalizeLanguageName(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
