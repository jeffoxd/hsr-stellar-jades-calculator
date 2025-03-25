import {
  PropsWithChildren,
  createContext,
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";

export const themes = [
  "stellar-jades",
  "stellar-jades-dark",
  "night-time",
  "march-7th-preservation",
  "march-7th-hunt",
  "evil-march",
] as const;
export type Themes = (typeof themes)[number];

const ThemeContext = createContext<{
  theme: Themes;
  setTheme: (theme: Themes) => void;
}>({
  theme: "stellar-jades",
  setTheme: (_theme: Themes) => {},
});

export const ThemeProvider = (props: PropsWithChildren) => {
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

  return <ThemeContext.Provider value={{ theme, setTheme }} {...props} />;
};

export const useTheme = () => useContext(ThemeContext);
