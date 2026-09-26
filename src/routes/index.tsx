import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "SpendSmart — Personal Finance Tracker" },
      {
        name: "description",
        content:
          "Track spending, plan monthly budgets and grow savings goals with SpendSmart, even as a guest.",
      },
      { property: "og:title", content: "SpendSmart — Personal Finance Tracker" },
      {
        property: "og:description",
        content:
          "Track spending, plan monthly budgets and grow savings goals with SpendSmart, even as a guest.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: () => { throw redirect({ to: "/dashboard", replace: true }); },
  component: () => null,
});
