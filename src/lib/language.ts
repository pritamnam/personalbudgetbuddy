import { useContext } from "react";
import { PreferencesContext } from "@/lib/preferences";
import { LANGUAGES, message, translate } from "@/lib/translations";

export function useLanguage() {
  const preferences = useContext(PreferencesContext);
  const language = preferences?.language ?? "en";
  const locale = LANGUAGES.find((item) => item.code === language)?.locale ?? "en-US";
  return {
    language,
    locale,
    t: (key: string) => translate(language, key),
    m: (key: Parameters<typeof message>[1], values: Record<string, string | number>) => message(language, key, values),
    date: (value: string) => new Date(`${value}T12:00:00`).toLocaleDateString(locale),
  };
}
