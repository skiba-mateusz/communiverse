import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "@/theme";

export type Themes = "light" | "dark";

interface ThemeContextProps {
  theme: Themes;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Themes>("light");

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark" || theme === "light") {
      localStorage.setItem("theme", theme);
    }
  }, []);

  const toggleTheme = () =>
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      return prevTheme;
    });

  const currentTheme = theme === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <StyledThemeProvider theme={currentTheme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("theme context used outside its provider");
  }
  return context;
};
