/**
 * Shared booking types + validation. Imported by both the public form and the
 * server functions so the browser and the backend enforce identical rules.
 */
import { z } from "zod";

export const EVENT_TYPES = [
  "Wedding",
  "Sangeet",
  "Haldi & Mehndi",
  "Reception",
  "Engagement",
  "Milestone celebration",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const BUDGET_BANDS = [
  "₹10–25 lakh",
  "₹25–50 lakh",
  "₹50 lakh–1 crore",
  "Above ₹1 crore",
] as const;

export const PREFERRED_TIMES = ["Morning", "Afternoon", "Evening", "Night"] as const;
export type PreferredTime = (typeof PREFERRED_TIMES)[number];

export const BOOKING_STATUSES = ["PENDING", "CONTACTED", "CONFIRMED", "DECLINED"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Pending",
  CONTACTED: "Contacted",
  CONFIRMED: "Confirmed",
  DECLINED: "Declined",
};

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined));

export const bookingRequestSchema = z.object({
  clientName: z.string().trim().min(2, "Enter the name we should address you by.").max(100),
  partnerName: optionalText(100),
  email: z.string().trim().email("Enter a valid email address.").max(255),
  phone: z
    .string()
    .trim()
    .min(10, "Enter a valid phone number.")
    .max(20)
    .regex(/^[0-9+()\-\s]+$/, "Enter a valid phone number."),
  eventType: z.enum(EVENT_TYPES),
  eventDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Select a valid date.")
    .refine((value) => !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime()), "Select a valid date."),
  preferredTime: z.enum(PREFERRED_TIMES),
  guestCount: z
    .number({ invalid_type_error: "Enter an approximate guest count." })
    .int()
    .min(20, "Guest count must be at least 20.")
    .max(20000, "Guest count looks too high."),
  venue: z.string().trim().min(2, "Where is the celebration taking place?").max(160),
  budget: z.enum(BUDGET_BANDS),
  message: optionalText(1000),
});

export type BookingRequestInput = z.input<typeof bookingRequestSchema>;

export const bookingStatusSchema = z.enum(BOOKING_STATUSES);

export const bookingIdSchema = z.string().uuid();

export interface BookingSummary {
  id: string;
  reference: string;
  clientName: string;
  eventDate: string;
  eventType: string;
  guestCount: number;
  status: BookingStatus;
}

export interface BookingDetail extends BookingSummary {
  partnerName: string | null;
  email: string;
  phone: string;
  preferredTime: string | null;
  venue: string;
  budget: string | null;
  message: string | null;
  createdAt: string;
}
