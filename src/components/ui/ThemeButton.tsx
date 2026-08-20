"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { Moon, Sun } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { useGT } from "gt-next";
import { cn } from "@/lib/utils";

export const ThemeButton = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="default" size="icon">
        <span className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Button
      variant="default"
      size="icon"
      textAnimated
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "dark" ? <Moon /> : <Sun />}
    </Button>
  );
};

export const ThemeSelect = ({ className }: { className?: string }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useGT();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-[140px] rounded-md border bg-background" />;
  }

  return (
    <Select value={resolvedTheme} onValueChange={(value) => setTheme(value)}>
      <SelectTrigger className={cn(`w-[140px]`, className)}>
        <SelectValue placeholder="Select theme" />
      </SelectTrigger>

      <SelectContent className=" bg-primary text-white z-100">
        <SelectItem
          value="light"
          className="group hover:bg-white! dark:hover:bg-primary-foreground!"
        >
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 dark:text-white group-hover:text-primary dark:group-hover:text-white" />
            {t("Light")}
          </div>
        </SelectItem>

        <SelectItem
          value="dark"
          className="group hover:bg-white! dark:hover:bg-primary-foreground!"
        >
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 dark:text-white group-hover:text-primary dark:group-hover:text-white " />
            {t("Dark")}
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
