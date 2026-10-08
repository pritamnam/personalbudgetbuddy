import { describe, expect, test } from "bun:test";
import { dueReminderCount } from "./notification-preferences";

describe("due reminder notifications", () => {
  test("includes today and overdue reminders, excluding completed and future reminders", () => {
    expect(dueReminderCount([
      { due: "2026-10-07", done: false },
      { due: "2026-10-08", done: false },
      { due: "2026-10-09", done: false },
      { due: "2026-10-08", done: true },
      { due: "", done: false },
    ], "2026-10-08")).toBe(2);
  });
});