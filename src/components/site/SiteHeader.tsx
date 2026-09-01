import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const SECTIONS = [
  { label: "Services", href: "/#services" },
  { label: "Celebrations", href: "/#celebrations" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Process", href: "/#process" },
  { label: "Studio", href: "/#studio" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      data-scrolled={scrolled}
      className="fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-[--dur-base] ease-[--ease-out] data-[scrolled=true]:border-b data-[scrolled=true]:border-border data-[scrolled=true]:bg-background/90 data-[scrolled=true]:backdrop-blur-md"
    >
      <div className="shell grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4 lg:py-5">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="group flex min-w-0 items-center gap-3"
          aria-label="Stepwise Events home"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm bg-primary font-display text-base leading-none text-primary-foreground">
            SE
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-lg leading-none">
              Stepwise Events
            </span>
            <span className="mt-1 block text-[0.625rem] tracking-[0.2em] text-muted-foreground uppercase">
              Weddings &amp; Celebrations
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {SECTIONS.map((item) => (
            <a key={item.href} href={item.href} className="nav-link text-sm">
              {item.label}
            </a>
          ))}
          <Link to="/booking" className="nav-link text-sm">
            Booking
          </Link>
          <Button asChild size="sm" variant="accent">
            <Link to="/booking">Request a date</Link>
          </Button>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid h-11 w-11 place-items-center rounded-md border border-border text-foreground transition-colors duration-[--dur-fast] ease-[--ease-out] hover:border-accent hover:text-accent lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        id="mobile-nav"
        data-open={open}
        className="grid overflow-hidden border-border bg-background/98 backdrop-blur-md transition-[grid-template-rows,opacity] duration-[--dur-base] ease-[--ease-out] data-[open=false]:grid-rows-[0fr] data-[open=false]:opacity-0 data-[open=true]:grid-rows-[1fr] data-[open=true]:border-b data-[open=true]:opacity-100 lg:hidden"
      >
        <nav aria-label="Mobile" className="shell overflow-hidden">
          <ul className="flex flex-col gap-1 py-4">
            {SECTIONS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center border-b border-border/60 text-[0.9375rem] transition-colors duration-[--dur-fast] ease-[--ease-out] hover:text-accent"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-4">
              <Button asChild variant="accent" className="w-full">
                <Link to="/booking" onClick={() => setOpen(false)}>
                  Request a date
                </Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
