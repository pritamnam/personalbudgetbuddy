import { createFileRoute, redirect } from "@tanstack/react-router";

// Existing bookmarks still reach the app; account access now lives in the main menu.
export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "SpendSmart — Personal Finance Tracker" },
      { name: "description", content: "Track your expenses, budgets, savings goals and reminders with SpendSmart." },
      { property: "og:title", content: "SpendSmart — Personal Finance Tracker" },
      { property: "og:description", content: "Track your expenses, budgets, savings goals and reminders with SpendSmart." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: () => { throw redirect({ to: "/dashboard", replace: true }); },
  component: () => null,
});