import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import logo from "@/assets/stepwise-logo.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div className="lg:col-span-2">
          <img
            src={logo.url}
            alt="Stepwise Events — Weddings and Celebrations"
            width={1586}
            height={782}
            className="h-14 w-auto max-w-[240px] object-contain object-left sm:h-16 sm:max-w-[280px]"
          />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            A planning and design studio for Indian weddings and family celebrations. Based in
            Bengaluru, working across India and select destinations.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold tracking-[0.18em] uppercase">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href="/#services" className="nav-link inline-block">
                Services
              </a>
            </li>
            <li>
              <a href="/#gallery" className="nav-link inline-block">
                Gallery
              </a>
            </li>
            <li>
              <Link to="/booking" className="nav-link inline-block">
                Request a date
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold tracking-[0.18em] uppercase">Contact</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
              <span>Indiranagar, Bengaluru 560038</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-accent" />
              <a
                href="tel:+918040112233"
                className="transition-colors duration-[--dur-fast] ease-[--ease-out] hover:text-foreground"
              >
                +91 80 4011 2233
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
              <a
                href="mailto:studio@stepwiseevents.in"
                className="break-all transition-colors duration-[--dur-fast] ease-[--ease-out] hover:text-foreground"
              >
                studio@stepwiseevents.in
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="shell flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Stepwise Events. All rights reserved.</p>
          <p>Planning · Design · Production</p>
        </div>
      </div>
    </footer>
  );
}
