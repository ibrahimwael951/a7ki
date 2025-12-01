"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { Moon, Sun } from "lucide-react";

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
