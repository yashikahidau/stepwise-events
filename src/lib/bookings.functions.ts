/**
 * Server functions for booking requests.
 *
 * - Public: submitBookingRequest, listUnavailableDates
 * - Admin only (session + ADMIN role verified server-side): listBookings,
 *   getBookingDetail, setBookingStatus, getAdminIdentity
 *
 * Every admin handler re-checks the role through the caller's own session, and
 * the database row-level policies enforce the same rule independently.
 */
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

import {
  bookingIdSchema,
  bookingRequestSchema,
  bookingStatusSchema,
  type BookingDetail,
  type BookingStatus,
  type BookingSummary,
} from "./booking-schema";

interface BookingRow {
  id: string;
  reference: string;
  client_name: string;
  partner_name: string | null;
  email: string;
  phone: string;
  event_type: string;
  event_date: string;
  preferred_time: string | null;
  guest_count: number;
  venue: string;
  budget: string | null;
  message: string | null;
  status: BookingStatus;
  created_at: string;
}

const SUMMARY_COLUMNS = "id, reference, client_name, event_date, event_type, guest_count, status";

function toSummary(row: Pick<BookingRow,
  "id" | "reference" | "client_name" | "event_date" | "event_type" | "guest_count" | "status"
>): BookingSummary {
  return {
    id: row.id,
    reference: row.reference,
    clientName: row.client_name,
    eventDate: row.event_date,
    eventType: row.event_type,
    guestCount: row.guest_count,
    status: row.status,
  };
}

function toDetail(row: BookingRow): BookingDetail {
  return {
    ...toSummary(row),
    partnerName: row.partner_name,
    email: row.email,
    phone: row.phone,
    preferredTime: row.preferred_time,
    venue: row.venue,
    budget: row.budget,
    message: row.message,
    createdAt: row.created_at,
  };
}

/** Throws a safe error unless the caller holds the ADMIN role. */
async function assertAdmin(supabase: { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }> }, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error || data !== true) {
    throw new Error("FORBIDDEN");
  }
}

/* ------------------------------- public ---------------------------------- */

export const submitBookingRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => bookingRequestSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        client_name: data.clientName,
        partner_name: data.partnerName ?? null,
        email: data.email,
        phone: data.phone,
        event_type: data.eventType,
        event_date: data.eventDate,
        preferred_time: data.preferredTime,
        guest_count: data.guestCount,
        venue: data.venue,
        budget: data.budget,
        message: data.message ?? null,
      })
      .select("reference")
      .single();

    if (error || !row) {
      console.error("submitBookingRequest failed", error);
      throw new Error("We couldn't save your request. Please try again.");
    }
    return { reference: row.reference as string };
  });

/** Dates already committed to a confirmed event. Returns dates only. */
export const listUnavailableDates = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("event_date")
    .eq("status", "CONFIRMED")
    .gte("event_date", new Date().toISOString().slice(0, 10));

  if (error) {
    console.error("listUnavailableDates failed", error);
    return [] as string[];
  }
  return (data ?? []).map((row) => row.event_date as string);
});

/* -------------------------------- admin ---------------------------------- */

export const getAdminIdentity = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    return {
      email: (context.claims as { email?: string }).email ?? "",
    };
  });

export const listBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("bookings")
      .select(SUMMARY_COLUMNS)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("listBookings failed", error);
      throw new Error("Unable to load booking requests.");
    }
    return (data ?? []).map((row) => toSummary(row as BookingRow));
  });

export const getBookingDetail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => bookingIdSchema.parse((input as { id: string }).id))
  .handler(async ({ data: id, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("getBookingDetail failed", error);
      throw new Error("Unable to load this booking request.");
    }
    if (!data) throw new Error("This booking request no longer exists.");
    return toDetail(data as BookingRow);
  });

export const setBookingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const parsed = input as { id: string; status: string };
    return {
      id: bookingIdSchema.parse(parsed.id),
      status: bookingStatusSchema.parse(parsed.status),
    };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: row, error } = await context.supabase
      .from("bookings")
      .update({ status: data.status })
      .eq("id", data.id)
      .select(SUMMARY_COLUMNS)
      .maybeSingle();

    if (error) {
      console.error("setBookingStatus failed", error);
      throw new Error("Unable to update this booking. Please try again.");
    }
    if (!row) throw new Error("This booking request no longer exists.");
    return toSummary(row as BookingRow);
  });
