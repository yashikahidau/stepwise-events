import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ArrowRight, Inbox, RefreshCw, Search, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";
import { listBookings } from "@/lib/bookings.functions";
import { BOOKING_STATUSES, STATUS_LABELS, type BookingStatus } from "@/lib/booking-schema";

const TITLE = "Booking Requests — Stepwise Events";
const DESCRIPTION = "Review and update Stepwise Events booking requests.";

export const Route = createFileRoute("/admin/_shell/")({
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
  component: BookingListPage,
});

const FILTERS: Array<{ value: "ALL" | BookingStatus; label: string }> = [
  { value: "ALL", label: "All" },
  ...BOOKING_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] })),
];

function BookingListPage() {
  const fetchBookings = useServerFn(listBookings);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"ALL" | BookingStatus>("ALL");

  const bookingsQuery = useQuery({
    queryKey: ["admin", "bookings"],
    queryFn: () => fetchBookings(),
  });

  const rows = useMemo(() => {
    const list = bookingsQuery.data ?? [];
    const q = query.trim().toLowerCase();
    return list.filter(
      (b) =>
        (filter === "ALL" || b.status === filter) &&
        (!q || b.clientName.toLowerCase().includes(q) || b.reference.toLowerCase().includes(q)),
    );
  }, [bookingsQuery.data, query, filter]);

  const forbidden =
    bookingsQuery.error instanceof Error && bookingsQuery.error.message.includes("FORBIDDEN");

  return (
    <main className="shell py-8 lg:py-12">
      <div className="animate-in flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by client name"
            aria-label="Search booking requests by client name"
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
            aria-label="Refresh booking requests"
          >
            <RefreshCw className={cn("size-4", bookingsQuery.isFetching && "animate-spin")} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      <section aria-label="Booking requests" className="mt-6">
        {bookingsQuery.isPending ? (
          <ul className="space-y-3" aria-busy="true">
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className="h-24 animate-pulse rounded-lg border border-border bg-card" />
            ))}
          </ul>
        ) : bookingsQuery.isError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
            <TriangleAlert className="mx-auto size-6 text-destructive" />
            <h2 className="mt-4 text-xl">
              {forbidden ? "You don't have access" : "Couldn't load booking requests"}
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              {forbidden
                ? "This account isn't an administrator for Stepwise Events."
                : "The list didn't load. Please try again in a moment."}
            </p>
            {forbidden ? null : (
              <Button variant="accent" className="mt-6" onClick={() => bookingsQuery.refetch()}>
                Try again
              </Button>
            )}
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-10 text-center">
            <Inbox className="mx-auto size-6 text-accent" />
            <h2 className="mt-4 text-xl">
              {(bookingsQuery.data ?? []).length === 0
                ? "No booking requests yet."
                : "No requests match this view"}
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              {(bookingsQuery.data ?? []).length === 0
                ? "New event enquiries will appear here once a client submits a request."
                : "Clear the search or choose a different status."}
            </p>
            {(bookingsQuery.data ?? []).length > 0 ? (
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setQuery("");
                  setFilter("ALL");
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
                <caption className="sr-only">Booking requests</caption>
                <thead className="border-b border-border bg-secondary/60">
                  <tr className="text-[0.6875rem] tracking-[0.16em] text-muted-foreground uppercase">
                    <th scope="col" className="px-5 py-3.5 font-semibold">Client name</th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">Event date</th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">Event type</th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">Guests</th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">Status</th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b border-border/70 transition-colors duration-[--dur-fast] ease-[--ease-out] last:border-0 hover:bg-secondary/40"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium">{b.clientName}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{b.reference}</p>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {format(new Date(`${b.eventDate}T00:00:00`), "d MMM yyyy")}
                      </td>
                      <td className="px-5 py-4">{b.eventType}</td>
                      <td className="px-5 py-4">{b.guestCount}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="px-5 py-4">
                        <Button asChild variant="outline" size="sm">
                          <Link to="/admin/requests/$bookingId" params={{ bookingId: b.id }}>
                            View details
                          </Link>
                        </Button>
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
                      <p className="truncate font-medium">{b.clientName}</p>
                      <p className="truncate text-xs text-muted-foreground">{b.reference}</p>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
                    <div>
                      <dt className="text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase">
                        Event date
                      </dt>
                      <dd className="mt-1">
                        {format(new Date(`${b.eventDate}T00:00:00`), "d MMM yyyy")}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase">
                        Event type
                      </dt>
                      <dd className="mt-1">{b.eventType}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase">
                        Guests
                      </dt>
                      <dd className="mt-1">{b.guestCount}</dd>
                    </div>
                  </dl>
                  <Button asChild variant="outline" className="mt-4 w-full">
                    <Link to="/admin/requests/$bookingId" params={{ bookingId: b.id }}>
                      View details <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  );
}
