import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { friendlyAuthError, useAuth } from "@/lib/auth";

export function AccountDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    if (mode === "signup" && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name.trim() || email.split("@")[0] },
          },
        });
        if (authError) {
          setError(friendlyAuthError(authError.message));
          return;
        }
        if (!data.session) {
          setNotice("Almost there — check your inbox and confirm your email, then log in.");
          setMode("signin");
          setPassword("");
          return;
        }
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (authError) {
          setError(friendlyAuthError(authError.message));
          return;
        }
      }
      onOpenChange(false);
      void navigate({ to: "/dashboard" });
    } catch {
      setError("We couldn't reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open && !session} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{mode === "signin" ? "Log in to SpendSmart" : "Create your account"}</DialogTitle>
          <DialogDescription>{mode === "signin" ? "Your saved finances are waiting for you." : "Keep your finances across visits and devices."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4 pt-2">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <label htmlFor="account-name" className="text-sm font-medium">Name</label>
              <input id="account-name" className="field" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
            </div>
          )}
          <div className="space-y-1.5">
            <label htmlFor="account-email" className="text-sm font-medium">Email</label>
            <input id="account-email" type="email" className="field" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="account-password" className="text-sm font-medium">Password</label>
            <input id="account-password" type="password" className="field" autoComplete={mode === "signin" ? "current-password" : "new-password"} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" />
          </div>
          {error && <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
          {notice && <p role="status" className="rounded-md bg-secondary px-3 py-2 text-sm text-secondary-foreground">{notice}</p>}
          <Button type="submit" className="w-full" disabled={busy}>{busy ? "Please wait…" : mode === "signin" ? "Log In" : "Create account"}</Button>
        </form>
        <p className="text-center text-xs text-muted-foreground">
          {mode === "signin" ? (
            <>New to SpendSmart? <Button type="button" variant="link" className="h-auto p-0 text-xs" onClick={() => { setMode("signup"); setError(""); setNotice(""); }}>Sign up here</Button></>
          ) : (
            <>Already have an account? <Button type="button" variant="link" className="h-auto p-0 text-xs" onClick={() => { setMode("signin"); setError(""); setNotice(""); }}>Log in</Button></>
          )}
        </p>
      </DialogContent>
    </Dialog>
  );
}
