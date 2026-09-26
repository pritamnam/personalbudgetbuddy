import { createFileRoute, Outlet } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";
import { startGuestMode } from "@/lib/guest";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      startGuestMode();
      return { user: null };
    }
    return { user: data.user };
  },
  component: () => <Outlet />,
});
