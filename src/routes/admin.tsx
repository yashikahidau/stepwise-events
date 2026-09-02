import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ArrowLeft, Inbox, Loader2, RefreshCw, Search, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  STATUS_LABELS,
  listBookings,
  updateBookingStatus,
  type Booking,
  type BookingStatus,
} from "@/lib/bookings";

const TITLE = "Studio Dashboard — Stepwise Events";
const DESCRIPTION =
  "Internal Stepwise Events dashboard for reviewing incoming booking enquiries and updating their status.";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: AdminPage,
});

const FILTERS: Array<{ value: "all" | BookingStatus; label: string }> = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "in-review", label: "In review" },
  { value: "confirmed", label: "Confirmed" },
  { value: "declined", label: "Declined" },
];

const STATUS_STYLES: Record<BookingStatus, string> = {
  new: "border-accent/40 bg-accent/10 text-accent",
  "in-review": "border-border bg-secondary text-muted-foreground",
  confirmed: "border-success/40 bg-success/10 text-success",
  declined: "border-destructive/30 bg-destructive/5 text-destructive",
};

function AdminPage() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");

  const bookingsQuery = useQuery({
    queryKey: ["bookings"],
    queryFn: listBookings,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      updateBookingStatus(id, status),
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Status updated", {
        description: `${booking.id} · ${booking.name} marked ${STATUS_LABELS[booking.status].toLowerCase()}.`,
      });
    },
    onError: (error) => {
      toast.error("Status not updated", {
        description: error instanceof Error ? error.message : "Please try again.",
        icon: <TriangleAlert className="size-4" />,
      });
    },
  });

  const rows = useMemo(() => {
    const list = bookingsQuery.data ?? [];
    const q = query.trim().toLowerCase();
    return list.filter((b) => {
      const matchesFilter = filter === "all" || b.status === filter;
      const matchesQuery =
        !q ||
        [b.id, b.name, b.email, b.city, b.eventType].some((v) => v.toLowerCase().includes(q));
      return matchesFilter && matchesQuery;
    });
  }, [bookingsQuery.data, query, filter]);

  const counts = useMemo(() => {
    const list = bookingsQuery.data ?? [];
    return {
      total: list.length,
      new: list.filter((b) => b.status === "new").length,
      confirmed: list.filter((b) => b.status === "confirmed").length,
    };
  }, [bookingsQuery.data]);

  return (
    <div className="min-h-screen bg-secondary/35">
      <header className="border-b border-border bg-primary text-primary-foreground">
        <div className="shell grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4">
          <div className="min-w-0">
            <p className="text-[0.625rem] tracking-[0.22em] text-primary-foreground/60 uppercase">
              Stepwise Events
            </p>
            <h1 className="truncate font-display text-xl leading-tight">Studio dashboard</h1>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-primary-foreground/80 hover:bg-white/10 hover:text-primary-foreground">
            <Link to="/">
              <ArrowLeft className="size-4" /> <span className="hidden sm:inline">Website</span>
            </Link>
          </Button>
        </div>
      </header>

      <main className="shell py-8 lg:py-12">
        <section aria-label="Summary" className="grid gap-4 sm:grid-cols-3">
          {[
            ["Total enquiries", counts.total],
            ["Awaiting review", counts.new],
            ["Confirmed", counts.confirmed],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-border bg-card p-5">
              <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">{label}</p>
              <p className="mt-2 font-display text-3xl">
                {bookingsQuery.isPending ? "—" : value}
              </p>
            </div>
          ))}
        </section>

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, city, reference…"
              aria-label="Search enquiries"
              className="h-11 pl-9 transition-colors duration-[--dur-fast] ease-[--ease-out] hover:border-accent"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                aria-pressed={filter === f.value}
                className={cn(
                  "min-h-9 rounded-md border px-3.5 text-[0.8125rem] transition-colors duration-[--dur-fast] ease-[--ease-out]",
                  filter === f.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-accent hover:text-accent",
                )}
              >
                {f.label}
              </button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => bookingsQuery.refetch()}
              disabled={bookingsQuery.isFetching}
              aria-label="Refresh enquiries"
            >
              <RefreshCw className={cn("size-4", bookingsQuery.isFetching && "animate-spin")} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>

        <section aria-label="Booking enquiries" className="mt-6">
          {bookingsQuery.isPending ? (
            <ul className="space-y-3" aria-busy="true">
              {[0, 1, 2, 3].map((i) => (
                <li
                  key={i}
                  className="h-24 animate-pulse rounded-lg border border-border bg-card"
                />
              ))}
            </ul>
          ) : bookingsQuery.isError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
              <TriangleAlert className="mx-auto size-6 text-destructive" />
              <h2 className="mt-4 text-xl">Couldn't load enquiries</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                The enquiry list didn't load. Try again in a moment.
              </p>
              <Button variant="accent" className="mt-6" onClick={() => bookingsQuery.refetch()}>
                Try again
              </Button>
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-10 text-center">
              <Inbox className="mx-auto size-6 text-accent" />
              <h2 className="mt-4 text-xl">
                {(bookingsQuery.data ?? []).length === 0
                  ? "No enquiries yet"
                  : "No enquiries match this view"}
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                {(bookingsQuery.data ?? []).length === 0
                  ? "New booking requests from the website will appear here."
                  : "Clear the search or choose a different status filter."}
              </p>
              {(bookingsQuery.data ?? []).length > 0 ? (
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => {
                    setQuery("");
                    setFilter("all");
                  }}
                >
                  Reset filters
                </Button>
              ) : null}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-hidden rounded-lg border border-border bg-card lg:block">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-secondary/60">
                    <tr className="text-[0.6875rem] tracking-[0.16em] text-muted-foreground uppercase">
                      <th scope="col" className="px-5 py-3.5 font-semibold">Client</th>
                      <th scope="col" className="px-5 py-3.5 font-semibold">Event</th>
                      <th scope="col" className="px-5 py-3.5 font-semibold">Date</th>
                      <th scope="col" className="px-5 py-3.5 font-semibold">Guests</th>
                      <th scope="col" className="px-5 py-3.5 font-semibold">Status</th>
                      <th scope="col" className="px-5 py-3.5 font-semibold">Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((b) => (
                      <tr
                        key={b.id}
                        className="border-b border-border/70 transition-colors duration-[--dur-fast] ease-[--ease-out] last:border-0 hover:bg-secondary/40"
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium">{b.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{b.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {b.id} · {b.city}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p>{b.eventType}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{b.budget}</p>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          {format(new Date(`${b.eventDate}T00:00:00`), "d MMM yyyy")}
                        </td>
                        <td className="px-5 py-4">{b.guests}</td>
                        <td className="px-5 py-4">
                          <StatusPill status={b.status} />
                        </td>
                        <td className="px-5 py-4">
                          <StatusSelect booking={b} mutation={statusMutation} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile / tablet cards */}
              <ul className="grid gap-4 sm:grid-cols-2 lg:hidden">
                {rows.map((b) => (
                  <li key={b.id} className="rounded-lg border border-border bg-card p-5">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{b.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{b.email}</p>
                      </div>
                      <StatusPill status={b.status} />
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
                      <div>
                        <dt className="text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase">
                          Event
                        </dt>
                        <dd className="mt-1">{b.eventType}</dd>
                      </div>
                      <div>
                        <dt className="text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase">
                          Date
                        </dt>
                        <dd className="mt-1">
                          {format(new Date(`${b.eventDate}T00:00:00`), "d MMM yyyy")}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase">
                          Guests
                        </dt>
                        <dd className="mt-1">{b.guests}</dd>
                      </div>
                      <div>
                        <dt className="text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase">
                          Budget
                        </dt>
                        <dd className="mt-1">{b.budget}</dd>
                      </div>
                    </dl>
                    <div className="mt-4 border-t border-border pt-4">
                      <StatusSelect booking={b} mutation={statusMutation} />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

function StatusPill({ status }: { status: BookingStatus }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide whitespace-nowrap",
        STATUS_STYLES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function StatusSelect({
  booking,
  mutation,
}: {
  booking: Booking;
  mutation: ReturnType<
    typeof useMutation<Booking, Error, { id: string; status: BookingStatus }>
  >;
}) {
  const pending = mutation.isPending && mutation.variables?.id === booking.id;
  return (
    <div className="flex items-center gap-2">
      <label className="sr-only" htmlFor={`status-${booking.id}`}>
        Update status for {booking.name}
      </label>
      <select
        id={`status-${booking.id}`}
        value={booking.status}
        disabled={pending}
        onChange={(e) =>
          mutation.mutate({ id: booking.id, status: e.target.value as BookingStatus })
        }
        className="h-10 w-full rounded-md border border-input bg-background px-2.5 text-sm transition-colors duration-[--dur-fast] ease-[--ease-out] hover:border-accent disabled:opacity-60 lg:w-auto"
      >
        {(Object.keys(STATUS_LABELS) as BookingStatus[]).map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {pending ? <Loader2 className="size-4 shrink-0 animate-spin text-accent" /> : null}
    </div>
  );
}
