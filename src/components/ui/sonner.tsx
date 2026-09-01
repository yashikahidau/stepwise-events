import { Toaster as Sonner } from "sonner";
import type { ComponentProps } from "react";

type ToasterProps = ComponentProps<typeof Sonner>;

const Toaster = (props: ToasterProps) => {
  return (
    <Sonner
      position="top-center"
      duration={4200}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast w-full sm:w-[380px] gap-3 rounded-md border border-border bg-card p-4 text-card-foreground shadow-lift font-sans",
          title: "text-sm font-semibold tracking-wide text-foreground",
          description: "text-[0.8125rem] leading-relaxed text-muted-foreground",
          icon: "text-accent",
          actionButton: "bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-xs",
          cancelButton: "bg-secondary text-secondary-foreground rounded-md px-3 py-1.5 text-xs",
          error: "[&_[data-icon]]:text-destructive",
          success: "[&_[data-icon]]:text-success",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
