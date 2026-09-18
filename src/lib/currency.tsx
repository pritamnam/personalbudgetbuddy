import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export const CURRENCIES = [
  { code: "USD", symbol: "$", label: "US Dollar", locale: "en-US" },
  { code: "INR", symbol: "₹", label: "Indian Rupee", locale: "en-IN" },
  { code: "EUR", symbol: "€", label: "Euro", locale: "de-DE" },
  { code: "GBP", symbol: "£", label: "British Pound", locale: "en-GB" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen", locale: "ja-JP" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar", locale: "en-AU" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar", locale: "en-CA" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

const STORAGE_KEY = "pf.currency";
const DEFAULT: CurrencyCode = "USD";

type Ctx = {
  code: CurrencyCode;
  setCode: (code: CurrencyCode) => void;
  symbol: string;
  format: (n: number) => string;
};

const CurrencyContext = createContext<Ctx | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [code, setCodeState] = useState<CurrencyCode>(DEFAULT);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
      if (raw && CURRENCIES.some((c) => c.code === raw)) setCodeState(raw);
    } catch {
      /* ignore */
    }
  }, []);

  const setCode = useCallback((next: CurrencyCode) => {
    setCodeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<Ctx>(() => {
    const meta = CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
    return {
      code,
      setCode,
      symbol: meta.symbol,
      format: (n: number) =>
        n.toLocaleString(meta.locale, {
          style: "currency",
          currency: meta.code,
          maximumFractionDigits: meta.code === "JPY" ? 0 : 2,
        }),
    };
  }, [code, setCode]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

export function CurrencySelect({ className = "" }: { className?: string }) {
  const { code, setCode } = useCurrency();
  return (
    <label className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
      <span className="sr-only sm:not-sr-only">Currency</span>
      <select
        className="field max-w-40 py-1.5 text-sm"
        value={code}
        onChange={(e) => setCode(e.target.value as CurrencyCode)}
        aria-label="Preferred currency"
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.symbol} {c.code}
          </option>
        ))}
      </select>
    </label>
  );
}
