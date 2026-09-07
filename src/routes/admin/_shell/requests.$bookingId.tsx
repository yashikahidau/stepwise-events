import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, Loader2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getBookingDetail, setBookingStatus } from "@/lib/bookings.functions";
import {
  BOOKING_STATUSES,
  STATUS_LABELS,
  type BookingDetail,
  type BookingStatus,
} from "@/lib/booking-schema";

const TITLE = "Booking Detail — Stepwise Events";
const DESCRIPTION = "Full details of a Stepwise Events booking request.";

export const Route = createFileRoute("/admin/_shell/requests/$bookingId")({
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
  component: BookingDetailPage,
});

function BookingDetailPage() {
  const { bookingId } = Route.useParams();
  const queryClient = useQueryClient();
  const fetchDetail = useServerFn(getBookingDetail);
  const updateStatus = useServerFn(setBookingStatus);

  const detailQuery = useQuery({
    queryKey: ["admin", "booking", bookingId],
    queryFn: () => fetchDetail({ data: { id: bookingId } }),
  });

  const statusMutation = useMutation({
    mutationFn: (status: BookingStatus) => updateStatus({ data: { id: bookingId, status } }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["admin", "booking", bookingId], (prev: BookingDetail | undefined) =>
        prev ? { ...prev, status: updated.status } : prev,
      );
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      toast.success("Booking status updated.");
    },
    onError: () => {
      toast.error("Unable to update booking. Please try again.", {
        icon: <TriangleAlert className="size-4" />,
      });
    },
  });

  const booking = detailQuery.data;

  return (
    <main className="shell py-8 lg:py-12">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/admin">
          <ArrowLeft className="size-4" /> Back to booking requests
        </Link>
      </Button>

      {detailQuery.isPending ? (
        <div className="mt-6 space-y-3" aria-busy="true">
          <div className="h-28 animate-pulse rounded-lg border border-border bg-card" />
          <div className="h-64 animate-pulse rounded-lg border border-border bg-card" />
        </div>
      ) : detailQuery.isError || !booking ? (
        <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
          <TriangleAlert className="mx-auto size-6 text-destructive" />
          <h1 className="mt-4 text-xl">Couldn't load this request</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            It may have been removed, or the connection failed. Please try again.
          </p>
          <Button variant="accent" className="mt-6" onClick={() => detailQuery.refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <div className="animate-in mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <section className="rounded-lg border border-border bg-card p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
              <div>
                <p className="eyebrow">{booking.reference}</p>
                <h1 className="mt-2 font-display text-2xl sm:text-3xl">{booking.clientName}</h1>
              </div>
              <StatusBadge status={booking.status} />
            </div>
            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              <Detail label="Client name" value={booking.clientName} />
              <Detail label="Partner name" value={booking.partnerName ?? "—"} />
              <Detail label="Email" value={booking.email} />
              <Detail label="Phone" value={booking.phone} />
              <Detail
                label="Event date"
                value={format(new Date(`${booking.eventDate}T00:00:00`), "EEEE, d MMMM yyyy")}
              />
              <Detail label="Event type" value={booking.eventType} />
              <Detail label="Preferred time" value={booking.preferredTime ?? "—"} />
              <Detail label="Expected guests" value={String(booking.guestCount)} />
              <Detail label="Venue / location" value={booking.venue} />
              <Detail label="Budget" value={booking.budget ?? "—"} />
              <Detail
                label="Request submitted"
                value={format(new Date(booking.createdAt), "d MMM yyyy, h:mm a")}
              />
            </dl>
            <div className="mt-6 border-t border-border pt-5">
              <p className="text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase">
                Additional requirements
              </p>
              <p className="mt-2 text-sm leading-relaxed whitespace-pre-line">
                {booking.message ?? "None shared."}
              </p>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-5 sm:p-6">
            <h2 className="text-lg">Update status</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose where this request stands. The client isn't notified automatically.
            </p>
            <div className="mt-5 grid gap-2.5">
              {BOOKING_STATUSES.map((status) => {
                const active = booking.status === status;
                const pending = statusMutation.isPending && statusMutation.variables === status;
                return (
                  <Button
                    key={status}
                    variant={active ? "accent" : "outline"}
                    aria-pressed={active}
                    disabled={statusMutation.isPending || active}
                    onClick={() => statusMutation.mutate(status)}
                    className="justify-between"
                  >
                    {STATUS_LABELS[status]}
                    {pending ? <Loader2 className="size-4 animate-spin" /> : null}
                  </Button>
                );
              })}
            </div>
            <p aria-live="polite" className="sr-only">
              {statusMutation.isPending ? "Updating status" : `Status is ${STATUS_LABELS[booking.status]}`}
            </p>
          </section>
        </div>
      )}
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm break-words">{value}</dd>
    </div>
  );
}
