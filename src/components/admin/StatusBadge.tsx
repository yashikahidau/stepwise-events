import { cn } from "@/lib/utils";
import { STATUS_LABELS, type BookingStatus } from "@/lib/booking-schema";

const STYLES: Record<BookingStatus, string> = {
  PENDING: "border-border bg-secondary text-foreground",
  CONTACTED: "border-accent/40 bg-accent/10 text-accent",
  CONFIRMED: "border-success/40 bg-success/10 text-success",
  DECLINED: "border-destructive/30 bg-destructive/5 text-destructive",
};

const DOTS: Record<BookingStatus, string> = {
  PENDING: "bg-muted-foreground",
  CONTACTED: "bg-accent",
  CONFIRMED: "bg-success",
  DECLINED: "bg-destructive",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide whitespace-nowrap",
        STYLES[status],
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", DOTS[status])} />
      {STATUS_LABELS[status]}
    </span>
  );
}
