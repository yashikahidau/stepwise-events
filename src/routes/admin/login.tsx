import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2, LogIn, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const TITLE = "Admin Portal — Stepwise Events";
const DESCRIPTION = "Secure sign-in for the Stepwise Events studio team.";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/admin" });
  },
  component: AdminLoginPage,
});

const schema = z.object({
  email: z.string().trim().min(1, "Enter your email address.").email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ email?: string | undefined; password?: string | undefined }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;

    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setErrors({ email: flat.email?.[0], password: flat.password?.[0] });
      return;
    }
    setErrors({});
    setFormError(null);
    setSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });
      if (error) {
        // Deliberately generic: never reveal whether an account exists.
        setFormError("Those details don't match our records.");
        return;
      }
      toast.success("Signed in successfully.");
      await navigate({ to: "/admin", replace: true });
    } catch {
      setFormError("We couldn't reach the server. Check your connection and try again.");
      toast.error("Unexpected sign-in error. Please try again.", {
        icon: <TriangleAlert className="size-4" />,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-secondary/35 px-5 py-12">
      <div className="animate-in w-full max-w-sm">
        <div className="text-center">
          <img
            src={logo.url}
            alt="Stepwise Events — Weddings and Celebrations"
            width={1586}
            height={782}
            className="mx-auto h-16 w-auto max-w-[220px] object-contain"
          />
          <h1 className="mt-4 font-display text-3xl">Admin Portal</h1>
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="mt-8 rounded-lg border border-border bg-card p-6 sm:p-7"
        >
          <fieldset disabled={submitting} className="grid gap-5">
            <div>
              <Label htmlFor="email" className="text-xs tracking-wide uppercase">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={cn(
                  "mt-2.5 h-11 transition-colors duration-[--dur-fast] ease-[--ease-out] hover:border-accent",
                  errors.email && "border-destructive",
                )}
              />
              {errors.email ? (
                <p id="email-error" className="mt-2 text-sm text-destructive">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div>
              <Label htmlFor="password" className="text-xs tracking-wide uppercase">
                Password
              </Label>
              <div className="relative mt-2.5">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  aria-invalid={errors.password ? true : undefined}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={cn(
                    "h-11 pr-11 transition-colors duration-[--dur-fast] ease-[--ease-out] hover:border-accent",
                    errors.password && "border-destructive",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-1 grid size-9 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors duration-[--dur-fast] ease-[--ease-out] hover:text-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password ? (
                <p id="password-error" className="mt-2 text-sm text-destructive">
                  {errors.password}
                </p>
              ) : null}
            </div>

            {formError ? (
              <p
                role="alert"
                className="flex items-start gap-2.5 rounded-md border border-destructive/30 bg-destructive/5 p-3.5 text-sm text-destructive"
              >
                <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                {formError}
              </p>
            ) : null}

            <Button type="submit" variant="accent" size="lg" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Signing in
                </>
              ) : (
                <>
                  <LogIn className="size-4" /> Sign In
                </>
              )}
            </Button>
          </fieldset>
        </form>
      </div>
    </main>
  );
}
