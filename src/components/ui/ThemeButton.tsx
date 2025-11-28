"use client";
import { useTheme } from "next-themes";
import React from "react";
import { Button } from "./button";
import { Moon, Sun } from "lucide-react";

const ThemeButton = () => {
  const { setTheme, resolvedTheme } = useTheme();
  return (
    <Button
      variant={"default"}
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "dark" && <Moon />}
      {resolvedTheme === "light" && <Sun />}
    </Button>
  );
};

export default ThemeButton;
