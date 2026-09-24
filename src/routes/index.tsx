import { createFileRoute, redirect } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";
import { isGuestMode } from "@/lib/guest";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "SpendSmart — Sign in to track expenses, budgets and goals" },
      {
        name: "description",
        content:
          "Sign in to SpendSmart to track spending, plan monthly budgets and grow savings goals, or continue as a guest to look around.",
      },
      { property: "og:title", content: "SpendSmart — Sign in to track expenses, budgets and goals" },
      {
        property: "og:description",
        content:
          "Sign in to SpendSmart to track spending, plan monthly budgets and grow savings goals, or continue as a guest to look around.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session || isGuestMode()) throw redirect({ to: "/dashboard", replace: true });
    throw redirect({ to: "/auth", replace: true });
  },
  component: () => null,
});
