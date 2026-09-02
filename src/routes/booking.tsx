import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ArrowRight, CalendarDays, Check, Loader2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/site/Reveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { cn } from "@/lib/utils";
import {
  BUDGET_BANDS,
  EVENT_TYPES,
  createBooking,
  getUnavailableDates,
  type EventType,
} from "@/lib/bookings";

const TITLE = "Request a Date — Stepwise Events";
const DESCRIPTION =
  "Check date availability with Stepwise Events. Share your functions, guest count and budget band; a founder replies within two working days.";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: BookingPage;
});

type Errors = Partial<Record<"date" | "name" | "email" | "phone" | "city" | "guests", string>>;

function BookingPage() {
  const unavailable = useMemo(() => getUnavailableDates().map((d) => new Date(`${d}T00:00:00`)), []);
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [date, setDate] = useState<Date | undefined>();
  const [eventType, setEventType] = useState<EventType>("Wedding");
  const [budget, setBudget] = useState<string>(BUDGET_BANDS[1]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    guests: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const set = (key: keyof typeof form) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  function validate(): Errors {
    const next: Errors = {};
    if (!date) next.date = "Select a preferred date for your first function.";
    if (form.name.trim().length < 2) next.name = "Enter the name we should address you by.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Enter a valid email address.";
    if (form.phone.replace(/\D/g, "").length < 10) next.phone = "Enter a 10-digit phone number.";
    if (form.city.trim().length < 2) next.city = "Where is the celebration taking place?";
    const guests = Number(form.guests);
    if (!form.guests || Number.isNaN(guests) || guests < 20 || guests > 2000)
      next.guests = "Enter an approximate guest count between 20 and 2000.";
    return next;
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.querySelector<HTMLElement>("[data-invalid='true']")?.focus();
      return;
    }
    setStatus("submitting");
    setFailure(null);
    try {
      const booking = await createBooking({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        eventType,
        eventDate: format(date!, "yyyy-MM-dd"),
        guests: Number(form.guests),
        budget,
        notes: form.notes.trim() || undefined,
      });
      setReference(booking.id);
      setStatus("success");
      toast.success("Booking request sent", {
        description: `Reference ${booking.id}. A founder replies within two working days.`,
        icon: <Check className="size-4" />,
      });
    } catch (err) {
      setStatus("error");
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setFailure(message);
      toast.error("We couldn't send your request", {
        description: message,
        icon: <TriangleAlert className="size-4" />,
      });
    }
  }

  const submitting = status === "submitting";

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="section-y pt-28 md:pt-36">
          <div className="shell">
            {status === "success" ? (
              <Reveal className="mx-auto max-w-xl rounded-lg border border-border bg-card p-8 text-center sm:p-12">
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-success/10 text-success">
                  <Check className="size-6" />
                </span>
                <h1 className="mt-6 text-3xl sm:text-4xl">Request received</h1>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Your reference is{" "}
                  <span className="font-semibold text-foreground">{reference}</span> for{" "}
                  {date ? format(date, "d MMMM yyyy") : "your selected date"}. Nandita or Farhan
                  will confirm availability within two working days.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button asChild variant="accent">
                    <Link to="/">Back to home</Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStatus("idle");
                      setReference(null);
                      setDate(undefined);
                      setForm({ name: "", email: "", phone: "", city: "", guests: "", notes: "" });
                    }}
                  >
                    Submit another date
                  </Button>
                </div>
              </Reveal>
            ) : (
              <>
                <Reveal className="measure rule-accent">
                  <p className="eyebrow">Booking</p>
                  <h1 className="mt-4 text-4xl sm:text-5xl">Request a date</h1>
                  <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                    Pick your preferred date, tell us about the celebration, and we'll confirm
                    whether the studio is free. Dates marked unavailable are already committed to
                    another event.
                  </p>
                </Reveal>

                <form
                  onSubmit={onSubmit}
                  noValidate
                  className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-[minmax(0,auto)_minmax(0,1fr)] lg:gap-8"
                >
                  {/* Date selection */}
                  <Reveal className="rounded-lg border border-border bg-card p-5 sm:p-6">
                    <h2 className="flex items-center gap-2 text-lg">
                      <CalendarDays className="size-4 text-accent" />
                      Preferred date
                    </h2>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(value) => {
                        setDate(value);
                        setErrors((prev) => ({ ...prev, date: undefined }));
                      }}
                      disabled={[{ before: today }, ...unavailable]}
                      className="mt-4 p-0"
                    />
                    <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <span className="size-2.5 rounded-full bg-primary" /> Selected
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="size-2.5 rounded-full bg-muted-foreground/30" /> Unavailable
                      </span>
                    </p>
                    <p
                      className="mt-4 text-sm"
                      aria-live="polite"
                      data-invalid={errors.date ? "true" : undefined}
                    >
                      {errors.date ? (
                        <span className="text-destructive">{errors.date}</span>
                      ) : date ? (
                        <span className="text-foreground">
                          Selected: <strong>{format(date, "EEEE, d MMMM yyyy")}</strong>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">No date selected yet.</span>
                      )}
                    </p>
                  </Reveal>

                  {/* Details */}
                  <Reveal delay={90} className="grid gap-6">
                    <fieldset
                      disabled={submitting}
                      className="rounded-lg border border-border bg-card p-5 sm:p-6"
                    >
                      <legend className="px-1 text-xs font-semibold tracking-[0.18em] uppercase">
                        Event details
                      </legend>
                      <div className="mt-4 grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <Label className="text-xs tracking-wide uppercase">Type of event</Label>
                          <div className="mt-2.5 flex flex-wrap gap-2">
                            {EVENT_TYPES.map((type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => setEventType(type)}
                                aria-pressed={eventType === type}
                                className={cn(
                                  "min-h-9 rounded-md border px-3.5 text-[0.8125rem] transition-colors duration-[--dur-fast] ease-[--ease-out]",
                                  eventType === type
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border text-muted-foreground hover:border-accent hover:text-accent",
                                )}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>

                        <Field
                          id="guests"
                          label="Approximate guests"
                          error={errors.guests}
                          inputMode="numeric"
                          placeholder="250"
                          value={form.guests}
                          onChange={set("guests")}
                        />

                        <div>
                          <Label htmlFor="budget" className="text-xs tracking-wide uppercase">
                            Budget band
                          </Label>
                          <select
                            id="budget"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="mt-2.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm transition-colors duration-[--dur-fast] ease-[--ease-out] hover:border-accent focus-visible:border-accent"
                          >
                            {BUDGET_BANDS.map((band) => (
                              <option key={band} value={band}>
                                {band}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <Label htmlFor="notes" className="text-xs tracking-wide uppercase">
                            Anything we should know (optional)
                          </Label>
                          <Textarea
                            id="notes"
                            rows={4}
                            value={form.notes}
                            onChange={(e) => set("notes")(e.target.value)}
                            placeholder="Functions planned, venue if booked, outstation guests…"
                            className="mt-2.5 resize-y transition-colors duration-[--dur-fast] ease-[--ease-out] hover:border-accent"
                          />
                        </div>
                      </div>
                    </fieldset>

                    <fieldset
                      disabled={submitting}
                      className="rounded-lg border border-border bg-card p-5 sm:p-6"
                    >
                      <legend className="px-1 text-xs font-semibold tracking-[0.18em] uppercase">
                        Your details
                      </legend>
                      <div className="mt-4 grid gap-5 sm:grid-cols-2">
                        <Field
                          id="name"
                          label="Full name"
                          error={errors.name}
                          placeholder="Ananya Rao"
                          value={form.name}
                          onChange={set("name")}
                        />
                        <Field
                          id="city"
                          label="City of celebration"
                          error={errors.city}
                          placeholder="Bengaluru"
                          value={form.city}
                          onChange={set("city")}
                        />
                        <Field
                          id="email"
                          label="Email"
                          type="email"
                          error={errors.email}
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={set("email")}
                        />
                        <Field
                          id="phone"
                          label="Phone"
                          type="tel"
                          error={errors.phone}
                          placeholder="+91 98450 00000"
                          value={form.phone}
                          onChange={set("phone")}
                        />
                      </div>
                    </fieldset>

                    {status === "error" && failure ? (
                      <p
                        role="alert"
                        className="flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
                      >
                        <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                        {failure} You can also email studio@stepwiseevents.in directly.
                      </p>
                    ) : null}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <Button type="submit" size="lg" variant="accent" disabled={submitting}>
                        {submitting ? (
                          <>
                            <Loader2 className="size-4 animate-spin" /> Sending request
                          </>
                        ) : (
                          <>
                            Send booking request <ArrowRight className="size-4" />
                          </>
                        )}
                      </Button>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        No payment is taken at this stage. We reply within two working days.
                      </p>
                    </div>
                  </Reveal>
                </form>
              </>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  inputMode,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  inputMode?: "numeric" | "text" | "tel" | "email";
}) {
  return (
    <div>
      <Label htmlFor={id} className="text-xs tracking-wide uppercase">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        data-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "mt-2.5 h-11 transition-colors duration-[--dur-fast] ease-[--ease-out] hover:border-accent",
          error && "border-destructive",
        )}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
