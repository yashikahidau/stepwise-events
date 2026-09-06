import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/_shell")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/admin/login" });
  },
  component: AdminShell,
  errorComponent: () => (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="max-w-sm text-center">
        <h1 className="font-display text-2xl">Something went wrong</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Please reload the page. If it keeps happening, sign in again.
        </p>
      </div>
    </main>
  ),
});

function AdminShell() {
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Signed out successfully.");
    await navigate({ to: "/admin/login", replace: true });
    router.invalidate();
  }

  return (
    <div className="min-h-screen bg-secondary/35">
      <header className="border-b border-border bg-primary text-primary-foreground">
        <div className="shell grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4">
          <Link to="/admin" className="min-w-0">
            <p className="text-[0.625rem] tracking-[0.22em] text-primary-foreground/60 uppercase">
              Stepwise Events
            </p>
            <h1 className="truncate font-display text-xl leading-tight">Booking Requests</h1>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-primary-foreground/80 hover:bg-white/10 hover:text-primary-foreground"
          >
            <LogOut className="size-4" /> <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
