import type { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";
import { clearFinanceData, loadFinanceData } from "./finance";

type AuthCtx = {
  session: Session | null;
  user: User | null;
  displayName: string;
  loading: boolean;
};

const Ctx = createContext<AuthCtx>({
  session: null,
  user: null,
  displayName: "",
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      if (!active) return;
      setSession(next);
      if (event === "SIGNED_OUT") clearFinanceData();
      if (next?.user) void loadFinanceData(next.user.id);
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session?.user) void loadFinanceData(data.session.user.id);
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthCtx>(() => {
    const user = session?.user ?? null;
    const meta = (user?.user_metadata ?? {}) as { display_name?: string };
    return {
      session,
      user,
      displayName: meta.display_name ?? user?.email?.split("@")[0] ?? "",
      loading,
    };
  }, [session, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);

/** Sign out safely: clear local data, end the session, and return home. */
export async function signOutSafely() {
  clearFinanceData();
  await supabase.auth.signOut();
}

/** Turn backend auth errors into friendly, non-leaky messages. */
export function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "That email or password isn't right.";
  if (m.includes("email not confirmed")) return "Please confirm your email address first, then sign in.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "An account with this email already exists. Try signing in instead.";
  if (m.includes("password")) return "Password must be at least 6 characters.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Too many attempts. Please wait a moment and try again.";
  if (m.includes("invalid email") || m.includes("valid email"))
    return "Please enter a valid email address.";
  return "Something went wrong. Please try again.";
}
