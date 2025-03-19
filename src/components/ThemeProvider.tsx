import { createContext } from "react";

export const themes = [
  "stellar-jades",
  "stellar-jades-dark",
  "night-time",
  "march-7th-preservation",
  "march-7th-hunt",
  "evil-march",
] as const;
export type Themes = (typeof themes)[number];

export const ThemeContext = createContext<{
  theme: Themes;
  setTheme: (theme: Themes) => void;
}>({
  theme: "stellar-jades",
  setTheme: (_theme: Themes) => {},
});

export const ThemeProvider = ({
  theme,
  setTheme,
  children,
}: {
  theme: Themes;
  setTheme: (theme: Themes) => void;
  children: React.ReactNode;
}) => (
  <ThemeContext.Provider value={{ theme, setTheme }}>
    {children}
  </ThemeContext.Provider>
);
