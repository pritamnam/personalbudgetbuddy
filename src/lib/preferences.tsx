import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "light" | "dark" | "system";
type Preferences = { theme: Theme; setTheme: (value: Theme) => void; notifications: boolean; setNotifications: (value: boolean) => void };
const PreferencesContext = createContext<Preferences | null>(null);
export const themeInitScript = `(function(){try{var t=localStorage.getItem('pf.theme')||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, updateTheme] = useState<Theme>("system");
  const [notifications, updateNotifications] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const stored = localStorage.getItem("pf.theme");
      if (stored === "light" || stored === "dark" || stored === "system") updateTheme(stored);
      updateNotifications(localStorage.getItem("pf.notifications") === "true");
    } catch { /* Preferences still work without storage. */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => document.documentElement.classList.toggle("dark", theme === "dark" || (theme === "system" && media.matches));
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme, loaded]);
  function setTheme(value: Theme) {
    updateTheme(value);
    try { localStorage.setItem("pf.theme", value); } catch { /* Optional persistence. */ }
  }
  function setNotifications(value: boolean) {
    updateNotifications(value);
    try { localStorage.setItem("pf.notifications", String(value)); } catch { /* Optional persistence. */ }
  }
  return <PreferencesContext.Provider value={{ theme, setTheme, notifications, setNotifications }}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error("PreferencesProvider is required");
  return context;
}