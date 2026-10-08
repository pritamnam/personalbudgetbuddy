import { Link } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SettingsMenu() {
  return (
    <Button variant="ghost" size="icon" asChild>
      <Link to="/settings" aria-label="Settings" title="Settings" activeProps={{ className: "bg-secondary text-secondary-foreground" }}><Settings /></Link>
    </Button>
  );
}
