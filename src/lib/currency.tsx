import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { convertStoredAmounts } from "./finance";

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
const RATES_URL = "https://open.er-api.com/v6/latest/USD";

/** Fallback rates (units per 1 USD) used when the live rates API is unreachable. */
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  INR: 83.2,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  AUD: 1.52,
  CAD: 1.36,
};

type Ctx = {
  code: CurrencyCode;
  setCode: (code: CurrencyCode) => void;
  symbol: string;
  format: (n: number) => string;
  /** True while live exchange rates are being fetched. */
  ratesLoading: boolean;
  /** True once live rates were loaded (false when using fallback rates). */
  liveRates: boolean;
};

const CurrencyContext = createContext<Ctx | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [code, setCodeState] = useState<CurrencyCode>(DEFAULT);
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [liveRates, setLiveRates] = useState(false);
  const codeRef = useRef(code);
  codeRef.current = code;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
      if (raw && CURRENCIES.some((c) => c.code === raw)) setCodeState(raw);
    } catch {
      /* ignore */
    }
  }, []);

  // Fetch live exchange rates once on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(RATES_URL);
        if (!res.ok) throw new Error("rates fetch failed");
        const data = (await res.json()) as { rates?: Record<string, number> };
        if (!cancelled && data.rates && typeof data.rates["USD"] === "number") {
          setRates(data.rates);
          setLiveRates(true);
        }
      } catch {
        /* keep fallback rates */
      } finally {
        if (!cancelled) setRatesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setCode = useCallback(
    (next: CurrencyCode) => {
      const prev = codeRef.current;
      if (next === prev) return;
      // Convert all stored amounts so values stay consistent in the new currency.
      convertStoredAmounts(prev, next, rates);
      setCodeState(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
    },
    [rates],
  );

  const value = useMemo<Ctx>(() => {
    const meta = CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
    return {
      code,
      setCode,
      symbol: meta.symbol,
      ratesLoading,
      liveRates,
      format: (n: number) =>
        n.toLocaleString(meta.locale, {
          style: "currency",
          currency: meta.code,
          maximumFractionDigits: meta.code === "JPY" ? 0 : 2,
        }),
    };
  }, [code, setCode, ratesLoading, liveRates]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

export function CurrencySelect({ className = "" }: { className?: string }) {
  const { code, setCode, ratesLoading, liveRates } = useCurrency();
  return (
    <label className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
      <span className="sr-only sm:not-sr-only">Currency</span>
      <select
        className="field max-w-40 py-1.5 text-sm"
        value={code}
        onChange={(e) => setCode(e.target.value as CurrencyCode)}
        aria-label="Preferred currency"
        disabled={ratesLoading}
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.symbol} {c.code}
          </option>
        ))}
      </select>
      <span
        className={`hidden size-1.5 rounded-full sm:inline-block ${ratesLoading ? "animate-pulse bg-muted-foreground" : liveRates ? "bg-emerald-500" : "bg-amber-500"}`}
        title={ratesLoading ? "Loading live exchange rates…" : liveRates ? "Live exchange rates" : "Offline — using approximate rates"}
      />
    </label>
  );
}
