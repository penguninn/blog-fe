import { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Helper function to get theme from local storage or use default value
const getStoredTheme = (storageKey: string, defaultTheme: Theme): Theme => {
  // Only execute in client environment
  if (typeof window === 'undefined') return defaultTheme;
  
  const storedTheme = localStorage.getItem(storageKey) as Theme;
  return storedTheme || defaultTheme;
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  // Use lazy initialization for state
  const [theme, setThemeState] = useState<Theme>(() => 
    getStoredTheme(storageKey, defaultTheme)
  );

  // Use useCallback to avoid recreating function on re-render
  const setTheme = useCallback((theme: Theme) => {
    localStorage.setItem(storageKey, theme);
    setThemeState(theme);
  }, [storageKey]);

  // Update class on document element when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  // Watch for system changes if theme is set to "system"
  useEffect(() => {
    if (theme !== "system") return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(mediaQuery.matches ? "dark" : "light");
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Use useMemo to avoid recreating value on re-render
  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
