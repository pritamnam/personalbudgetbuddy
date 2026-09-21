import { useSyncExternalStore } from "react";

import { startGuestData, clearFinanceData } from "./finance";

const KEY = "pf.guest";

let guest = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Restore a guest session on page load (browser only). */
export function restoreGuestMode() {
  try {
    if (window.sessionStorage.getItem(KEY) === "1") {
      guest = true;
      startGuestData();
      emit();
    }
  } catch {
    /* ignore */
  }
}

export function isGuestMode() {
  if (guest) return true;
  try {
    return typeof window !== "undefined" && window.sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

/** Start exploring with sample data. Nothing is saved anywhere. */
export function startGuestMode() {
  guest = true;
  try {
    window.sessionStorage.setItem(KEY, "1");
  } catch {
    /* ignore */
  }
  startGuestData();
  emit();
}

/** Leave guest mode and drop the sample data. */
export function endGuestMode() {
  if (!guest && !isGuestMode()) return;
  guest = false;
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  clearFinanceData();
  emit();
}

/** True while browsing as a guest (view-only, nothing saved). */
export function useGuestMode() {
  return useSyncExternalStore(
    subscribe,
    () => guest,
    () => false,
  );
}
