"use client";
import { useEffect, useState, useRef } from "react";

import { AppCard } from "@/components/AppCard";
import { Themes, ThemeProvider } from "@/components/ThemeProvider";

export default function App() {
  const initialTheme =
    (global?.window?.localStorage?.getItem("current_theme") as Themes) ||
    "stellar-jades";
  const [theme, setTheme] = useState<Themes>(initialTheme);
  const previousTheme = useRef<Themes>(initialTheme);

  useEffect(() => {
    document.documentElement.classList.remove(previousTheme.current);
    document.documentElement.classList.add(theme);
    previousTheme.current = theme;
    localStorage.setItem("current_theme", theme);
  }, [theme]);

  return (
    <>
      <ThemeProvider theme={theme} setTheme={setTheme}>
        <main>
          <div className="flex flex-col py-16 items-center justify-center">
            <AppCard />
          </div>
        </main>
      </ThemeProvider>
    </>
  );
}
