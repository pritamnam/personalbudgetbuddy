import { useLanguage } from "@/lib/language";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { friendlyAuthError, useAuth } from "@/lib/auth";

type Mode = "signin" | "signup" | "forgot_request" | "forgot_verify";

const TITLES: Record<Mode, [string, string]> = {
  signin: ["Log in to SpendSmart", "Your saved finances are waiting for you."],
  signup: ["Create your account", "Keep your finances across visits and devices."],
  forgot_request: ["Reset your password", "Enter your account email and we'll send you a verification code."],
  forgot_verify: ["Enter verification code", "Check your inbox for the code, then choose a new password."],
};

export function AccountDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t, m, locale, date } = useLanguage();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setNotice("");
  }

  async function sendResetCode() {
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin,
    });
    if (authError) throw new Error(friendlyAuthError(authError.message));
    setCooldown(60);
  }

  async function submitForgotRequest() {
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    await sendResetCode();
    setCode("");
    setNewPassword("");
    setMode("forgot_verify");
    setNotice(m("codeSent", { email: email.trim() }));
  }

  async function submitForgotVerify() {
    const token = code.replace(/\s/g, "");
    if (!/^\d{6,10}$/.test(token)) {
      setError("Please enter the code from your email.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    setResetting(true);
    const { error: verifyError } = await supabase.auth.verifyOtp({ email: email.trim(), token, type: "recovery" });
    if (verifyError) {
      setResetting(false);
      setError("That code is invalid or has expired. Request a new one and try again.");
      return;
    }
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setResetting(false);
    if (updateError) {
      setError(friendlyAuthError(updateError.message));
      return;
    }
    finish();
  }

  async function resend() {
    setError("");
    setNotice("");
    setBusy(true);
    try {
      await sendResetCode();
      setNotice("A new code is on its way.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send the code. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function finish() {
    setPassword("");
    setNewPassword("");
    setCode("");
    setMode("signin");
    onOpenChange(false);
    void navigate({ to: "/dashboard" });
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);
    try {
      if (mode === "forgot_request") return await submitForgotRequest();
      if (mode === "forgot_verify") return await submitForgotVerify();

      if (!email.trim() || !password) {
        setError("Please enter your email and password.");
        return;
      }
      if (mode === "signup" && password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
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
      finish();
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "We couldn't reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const [title, description] = TITLES[mode];
  const submitLabel =
    mode === "signin" ? "Log In" : mode === "signup" ? "Create account" : mode === "forgot_request" ? "Send verification code" : "Verify & set new password";

  return (
    <Dialog open={open && (!session || resetting)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{t(title)}</DialogTitle>
          <DialogDescription>{t(description)}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4 pt-2">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <label htmlFor="account-name" className="text-sm font-medium">{t("Name")}</label>
              <input id="account-name" className="field" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder={t("Your name")} />
            </div>
          )}
          {mode !== "forgot_verify" && (
            <div className="space-y-1.5">
              <label htmlFor="account-email" className="text-sm font-medium">{t("Email")}</label>
              <input id="account-email" type="email" className="field" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
            </div>
          )}
          {(mode === "signin" || mode === "signup") && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="account-password" className="text-sm font-medium">{t("Password")}</label>
                {mode === "signin" && (
                  <Button type="button" variant="link" className="h-auto p-0 text-xs" onClick={() => switchMode("forgot_request")}>{t("Forgot password?")}</Button>
                )}
              </div>
              <input id="account-password" type="password" className="field" autoComplete={mode === "signin" ? "current-password" : "new-password"} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder={t("At least 6 characters")} />
            </div>
          )}
          {mode === "forgot_verify" && (
            <>
              <div className="space-y-1.5">
                <label htmlFor="account-code" className="text-sm font-medium">{t("Verification code")}</label>
                <input id="account-code" inputMode="numeric" autoComplete="one-time-code" maxLength={10} className="field text-center font-mono text-lg tracking-[0.4em]" required value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} placeholder="123456" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="account-new-password" className="text-sm font-medium">{t("New password")}</label>
                <input id="account-new-password" type="password" className="field" autoComplete="new-password" required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder={t("At least 6 characters")} />
              </div>
            </>
          )}
          {error && <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{t(error)}</p>}
          {notice && <p role="status" className="rounded-md bg-secondary px-3 py-2 text-sm text-secondary-foreground">{t(notice)}</p>}
          <Button type="submit" className="w-full" disabled={busy}>{busy ? t("Please wait…") : t(submitLabel)}</Button>
        </form>
        <p className="text-center text-xs text-muted-foreground">
          {mode === "signin" && (
            <>{t("New to SpendSmart?")} <Button type="button" variant="link" className="h-auto p-0 text-xs" onClick={() => switchMode("signup")}>{t("Sign up here")}</Button></>
          )}
          {mode === "signup" && (
            <>{t("Already have an account?")} <Button type="button" variant="link" className="h-auto p-0 text-xs" onClick={() => switchMode("signin")}>{t("Log in")}</Button></>
          )}
          {mode === "forgot_request" && (
            <>{t("Remembered it?")} <Button type="button" variant="link" className="h-auto p-0 text-xs" onClick={() => switchMode("signin")}>{t("Back to Log In")}</Button></>
          )}
          {mode === "forgot_verify" && (
            <span className="flex flex-wrap items-center justify-center gap-x-3">
              <Button type="button" variant="link" className="h-auto p-0 text-xs" disabled={busy || cooldown > 0} onClick={resend}>{cooldown > 0 ? m("resendIn", { seconds: cooldown }) : t("Resend code")}</Button>
              <Button type="button" variant="link" className="h-auto p-0 text-xs" onClick={() => switchMode("signin")}>{t("Back to Log In")}</Button>
            </span>
          )}
        </p>
      </DialogContent>
    </Dialog>
  );
}
