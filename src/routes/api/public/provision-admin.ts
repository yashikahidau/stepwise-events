/**
 * One-time administrator provisioning.
 *
 * Reads ADMIN_EMAIL / ADMIN_PASSWORD from the server environment, creates the
 * account (password hashed by the auth service) and grants the ADMIN role.
 * Refuses once an administrator already exists, so it cannot be replayed.
 * No credentials are ever accepted from, or returned to, the caller.
 */
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/provision-admin")({
  server: {
    handlers: {
      POST: async () => {
        const email = process.env["ADMIN_EMAIL"];
        const password = process.env["ADMIN_PASSWORD"];
        if (!email || !password) {
          return Response.json({ error: "Admin credentials are not configured." }, { status: 500 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: existing, error: existingError } = await supabaseAdmin
          .from("user_roles")
          .select("id")
          .eq("role", "admin")
          .limit(1);

        if (existingError) {
          console.error("provision-admin: role lookup failed", existingError);
          return Response.json({ error: "Provisioning failed." }, { status: 500 });
        }
        if (existing && existing.length > 0) {
          return Response.json({ status: "already_provisioned" });
        }

        const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });

        if (createError || !created.user) {
          console.error("provision-admin: user creation failed", createError);
          return Response.json({ error: "Provisioning failed." }, { status: 500 });
        }

        const { error: roleError } = await supabaseAdmin
          .from("user_roles")
          .insert({ user_id: created.user.id, role: "admin" });

        if (roleError) {
          console.error("provision-admin: role grant failed", roleError);
          return Response.json({ error: "Provisioning failed." }, { status: 500 });
        }

        return Response.json({ status: "provisioned" });
      },
    },
  },
});
