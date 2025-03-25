"use client";
import { AppCard } from "@/components/AppCard";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { TouchProvider } from "@/providers/TouchProvider";

export default function App() {
  return (
    <>
      <TouchProvider>
        <ThemeProvider>
          <main>
            <div className="flex flex-col py-16 items-center justify-center">
              <AppCard />
            </div>
          </main>
        </ThemeProvider>
      </TouchProvider>
    </>
  );
}
