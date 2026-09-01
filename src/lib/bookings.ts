/**
 * Mock booking store (no backend). Keeps an in-memory list with simulated
 * network latency so every loading / empty / error state is real UI behaviour.
 */

export type BookingStatus = "new" | "in-review" | "confirmed" | "declined";

export type EventType =
  | "Wedding"
  | "Sangeet"
  | "Haldi & Mehndi"
  | "Reception"
  | "Engagement"
  | "Milestone celebration";

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  eventType: EventType;
  eventDate: string; // ISO yyyy-mm-dd
  guests: number;
  budget: string;
  notes?: string;
  status: BookingStatus;
  submittedAt: string; // ISO
}

export const EVENT_TYPES: EventType[] = [
  "Wedding",
  "Sangeet",
  "Haldi & Mehndi",
  "Reception",
  "Engagement",
  "Milestone celebration",
];

export const BUDGET_BANDS = [
  "₹10–25 lakh",
  "₹25–50 lakh",
  "₹50 lakh–1 crore",
  "Above ₹1 crore",
] as const;

export const STATUS_LABELS: Record<BookingStatus, string> = {
  new: "New enquiry",
  "in-review": "In review",
  confirmed: "Confirmed",
  declined: "Declined",
};

function iso(daysFromNow: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

let bookings: Booking[] = [
  {
    id: "SW-2041",
    name: "Ananya Rao",
    email: "ananya.rao@example.com",
    phone: "+91 98450 21134",
    city: "Bengaluru",
    eventType: "Wedding",
    eventDate: iso(96),
    guests: 420,
    budget: "₹50 lakh–1 crore",
    notes: "Three-day celebration at a heritage property. Wants a muted floral palette.",
    status: "confirmed",
    submittedAt: new Date(Date.now() - 864e5 * 9).toISOString(),
  },
  {
    id: "SW-2042",
    name: "Kabir Malhotra",
    email: "kabir.m@example.com",
    phone: "+91 98110 77320",
    city: "New Delhi",
    eventType: "Sangeet",
    eventDate: iso(41),
    guests: 260,
    budget: "₹25–50 lakh",
    notes: "Live band plus choreographed family performances.",
    status: "in-review",
    submittedAt: new Date(Date.now() - 864e5 * 4).toISOString(),
  },
  {
    id: "SW-2043",
    name: "Meera Iyer",
    email: "meera.iyer@example.com",
    phone: "+91 90035 44810",
    city: "Chennai",
    eventType: "Haldi & Mehndi",
    eventDate: iso(23),
    guests: 120,
    budget: "₹10–25 lakh",
    notes: "Daytime courtyard function, marigold-led styling.",
    status: "new",
    submittedAt: new Date(Date.now() - 864e5 * 1).toISOString(),
  },
  {
    id: "SW-2044",
    name: "Rohit & Sneha Kapoor",
    email: "kapoor.celebrations@example.com",
    phone: "+91 99200 18874",
    city: "Mumbai",
    eventType: "Reception",
    eventDate: iso(63),
    guests: 550,
    budget: "Above ₹1 crore",
    status: "new",
    submittedAt: new Date(Date.now() - 3600e3 * 6).toISOString(),
  },
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Dates already committed to another event — shown as unavailable. */
export function getUnavailableDates(): string[] {
  return [iso(7), iso(8), iso(21), iso(22), iso(35), iso(58), iso(59), iso(90)];
}

export async function listBookings(): Promise<Booking[]> {
  await wait(650);
  return [...bookings].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export interface BookingDraft {
  name: string;
  email: string;
  phone: string;
  city: string;
  eventType: EventType;
  eventDate: string;
  guests: number;
  budget: string;
  notes?: string;
}

export async function createBooking(draft: BookingDraft): Promise<Booking> {
  await wait(1100);
  if (draft.email.trim().toLowerCase().endsWith("@fail.test")) {
    throw new Error("We couldn't reach the studio inbox. Please try again.");
  }
  const booking: Booking = {
    ...draft,
    id: `SW-${2045 + bookings.length}`,
    status: "new",
    submittedAt: new Date().toISOString(),
  };
  bookings = [booking, ...bookings];
  return booking;
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
  await wait(450);
  const next = bookings.map((b) => (b.id === id ? { ...b, status } : b));
  const updated = next.find((b) => b.id === id);
  if (!updated) throw new Error("That enquiry no longer exists.");
  bookings = next;
  return updated;
}
