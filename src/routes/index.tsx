import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, Compass, Quote, Sparkles, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import heroVenue from "@/assets/hero-venue.png.asset.json";
import galleryTablescape from "@/assets/gallery-tablescape.jpg";
import galleryHaldi from "@/assets/gallery-haldi.jpg";
import galleryVenue from "@/assets/gallery-venue.jpg";
import gallerySangeet from "@/assets/gallery-sangeet.jpg";
import aboutStudio from "@/assets/about-studio.jpg";

const TITLE = "Stepwise Events — Indian Wedding & Celebration Planners";
const DESCRIPTION =
  "Planning and design studio for Indian weddings, sangeets and family celebrations. Full production, one team from first brief to final guest departure.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Home,
});

const SERVICES = [
  {
    icon: Compass,
    title: "Planning & logistics",
    body: "Budget structure, vendor contracts, run-of-show and on-ground coordination for every function.",
  },
  {
    icon: Sparkles,
    title: "Design & styling",
    body: "Palette, florals, stage and tablescape design drawn up as full elevations before anything is booked.",
  },
  {
    icon: Users,
    title: "Guest experience",
    body: "Travel, stays, hospitality desks and welcome gifting handled for outstation and overseas families.",
  },
  {
    icon: CalendarCheck,
    title: "Production",
    body: "Fabrication, lighting, sound and technical rehearsals supervised by our own production leads.",
  },
];

const CELEBRATIONS = [
  {
    name: "Weddings",
    detail: "Three to five functions, 150–800 guests, single or multi-venue.",
  },
  { name: "Sangeet & Mehndi", detail: "Performance-led evenings with staging and choreography support." },
  { name: "Receptions", detail: "Formal seated dinners and large-format cocktail receptions." },
  { name: "Engagements", detail: "Intimate ceremonies for close family, often at home." },
  { name: "Milestones", detail: "Anniversaries, naming ceremonies and landmark birthdays." },
  { name: "Destination", detail: "Rajasthan, Goa, Kerala and select venues in Southeast Asia." },
];

const PROCESS = [
  {
    step: "01",
    title: "Enquiry & date hold",
    body: "Share your dates and scale. We confirm availability within two working days.",
  },
  {
    step: "02",
    title: "Design direction",
    body: "A written brief, palette and layout studies for each function before costs are locked.",
  },
  {
    step: "03",
    title: "Vendor curation",
    body: "Shortlists with transparent quotes. You approve every contract we place.",
  },
  {
    step: "04",
    title: "Production week",
    body: "Setup supervision, rehearsals and a printed run-of-show for both families.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "They ran a 400-guest wedding across two venues without a single question reaching us. The design studies were accurate down to the linen.",
    name: "Ananya & Vikram",
    place: "Bengaluru, 2025",
  },
  {
    quote:
      "Costs stayed within the band we agreed in month one. Every vendor quote came to us before it was signed.",
    name: "The Malhotra family",
    place: "New Delhi, 2025",
  },
  {
    quote:
      "Our sangeet had eleven performances and forty outstation guests. Both were handled better than we planned ourselves.",
    name: "Meera & Arjun",
    place: "Chennai, 2024",
  },
];

function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-44">
          <div className="shell grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
            <Reveal>
              <p className="eyebrow">Weddings · Events · Celebrations</p>
              <h1 className="mt-6 text-[clamp(1.95rem,7.6vw,2.9rem)] sm:text-[clamp(2.6rem,5.8vw,3.6rem)] lg:text-[clamp(3rem,4.1vw,4.35rem)]">
                Indian weddings,
                <br />
                planned in
                <br />
                deliberate steps.
              </h1>
              <p className="measure mt-7 text-base leading-relaxed text-muted-foreground sm:text-lg">
                A planning and design studio for weddings, sangeets and family functions — one
                team with you from the first budget conversation to the last guest departure.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" variant="accent">
                  <Link to="/booking">
                    Request a date <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#gallery">See recent work</a>
                </Button>
              </div>
              <dl className="mt-12 grid max-w-lg gap-6 border-t border-border pt-7 sm:grid-cols-3">
                {[
                  ["Planning", "Budgets, vendors, run-of-show"],
                  ["Design", "Palette, florals, staging"],
                  ["Production", "Setup, lighting, rehearsals"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="font-display text-xl sm:text-2xl">{value}</dt>
                    <dd className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      {label}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>


            <Reveal delay={120} className="media-frame rounded-lg">
              <img
                src={heroVenue.url}
                width={1536}
                height={1024}
                alt="Candlelit outdoor wedding reception venue set with florals and warm lighting"
                className="aspect-4/3 lg:aspect-3/4 xl:aspect-4/5"
              />
            </Reveal>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="section-y scroll-mt-20 border-t border-border">
          <div className="shell">
            <Reveal className="measure rule-accent">
              <p className="eyebrow">What we do</p>
              <h2 className="mt-4 text-3xl sm:text-4xl">
                Four disciplines, handled by the same team
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Nothing is subcontracted to a coordinator you haven't met. The people who design
                your event are on site running it.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
              {SERVICES.map((service, i) => (
                <Reveal
                  key={service.title}
                  delay={i * 70}
                  className="hover-lift rounded-lg border border-border bg-card p-6 lg:p-7"
                >
                  <service.icon className="size-6 text-accent" aria-hidden="true" />
                  <h3 className="mt-5 text-xl">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {service.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Celebrations */}
        <section id="celebrations" className="section-y scroll-mt-20 bg-secondary/45">
          <div className="shell grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <Reveal className="rule-accent">
              <p className="eyebrow">Celebrations</p>
              <h2 className="mt-4 text-3xl sm:text-4xl">Events we take on</h2>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                Tell us the functions you're planning and we'll say honestly whether we're the right
                studio for them.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <ul className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
                {CELEBRATIONS.map((item) => (
                  <li
                    key={item.name}
                    className="bg-card p-6 transition-colors duration-[--dur-base] ease-[--ease-out] hover:bg-background"
                  >
                    <h3 className="text-lg">{item.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery" className="section-y scroll-mt-20">
          <div className="shell">
            <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="measure rule-accent">
                <p className="eyebrow">Gallery</p>
                <h2 className="mt-4 text-3xl sm:text-4xl">Recent celebrations</h2>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                A short selection from weddings and functions produced over the last two seasons.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-12 lg:gap-5">
              <Reveal className="media-frame rounded-lg lg:col-span-7">
                <img
                  src={galleryVenue}
                  loading="lazy"
                  width={1408}
                  height={1008}
                  alt="Heritage sandstone palace courtyard set for a wedding reception with floral canopies and string lights at golden hour"
                  className="aspect-4/3"
                />
              </Reveal>
              <Reveal delay={80} className="media-frame rounded-lg lg:col-span-5">
                <img
                  src={gallerySangeet}
                  loading="lazy"
                  width={1200}
                  height={1504}
                  alt="Guests dancing at a sangeet beneath emerald drapes and warm festoon lighting"
                  className="aspect-3/4 sm:aspect-4/3 lg:aspect-4/5"
                />
              </Reveal>
              <Reveal delay={60} className="media-frame rounded-lg lg:col-span-5">
                <img
                  src={galleryTablescape}
                  loading="lazy"
                  width={912}
                  height={1200}
                  alt="Reception place setting with terracotta charger, brass candlesticks and jasmine and rose centrepieces"
                  className="aspect-3/4 sm:aspect-square lg:aspect-4/5"
                />
              </Reveal>
              <Reveal delay={120} className="media-frame rounded-lg lg:col-span-7">
                <img
                  src={galleryHaldi}
                  loading="lazy"
                  width={1408}
                  height={912}
                  alt="Family applying haldi to a smiling bride in a courtyard hung with marigold garlands"
                  className="aspect-4/3"
                />
              </Reveal>
            </div>
          </div>
        </section>

        {/* Process */}
        <section id="process" className="section-y scroll-mt-20 border-t border-border">
          <div className="shell">
            <Reveal className="measure rule-accent">
              <p className="eyebrow">Process</p>
              <h2 className="mt-4 text-3xl sm:text-4xl">How a booking moves forward</h2>
            </Reveal>
            <ol className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border lg:mt-16 lg:grid-cols-4">
              {PROCESS.map((item, i) => (
                <Reveal
                  as="li"
                  key={item.step}
                  delay={i * 70}
                  className="bg-card p-6 lg:p-7"
                >
                  <span className="font-display text-3xl text-accent">{item.step}</span>
                  <h3 className="mt-4 text-lg">{item.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* Studio */}
        <section id="studio" className="section-y scroll-mt-20 bg-secondary/45">
          <div className="shell grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal className="media-frame order-last rounded-lg lg:order-first">
              <img
                src={aboutStudio}
                loading="lazy"
                width={1312}
                height={1008}
                alt="Two Stepwise Events planners reviewing a floor plan with fabric swatches and brass details on a studio table"
                className="aspect-4/3"
              />
            </Reveal>
            <Reveal delay={100} className="rule-accent">
              <p className="eyebrow">The studio</p>
              <h2 className="mt-4 text-3xl sm:text-4xl">
                A small team, deliberately kept that way
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                <p>
                  Stepwise Events is a planning and design studio built around a small core team,
                  with backgrounds in banqueting and production design.
                </p>
                <p>
                  We work with a fixed roster of florists, fabricators and caterers, which is how
                  we can quote accurately and hold to it.
                </p>
                <p>Every enquiry is answered by a planner, not a sales desk.</p>

              </div>
            </Reveal>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section-y">
          <div className="shell">
            <Reveal className="measure rule-accent">
              <p className="eyebrow">Clients</p>
              <h2 className="mt-4 text-3xl sm:text-4xl">In their words</h2>
            </Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-3 lg:mt-16">
              {TESTIMONIALS.map((t, i) => (
                <Reveal
                  key={t.name}
                  delay={i * 70}
                  className="hover-lift flex flex-col rounded-lg border border-border bg-card p-6 lg:p-7"
                >
                  <Quote className="size-5 text-accent" aria-hidden="true" />
                  <blockquote className="mt-5 flex-1 text-sm leading-relaxed sm:text-[0.9375rem]">
                    {t.quote}
                  </blockquote>
                  <footer className="mt-6 border-t border-border pt-4">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="mt-0.5 text-xs tracking-wide text-muted-foreground uppercase">
                      {t.place}
                    </p>
                  </footer>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Booking CTA */}
        <section className="pb-20 lg:pb-28">
          <div className="shell">
            <Reveal className="rounded-lg bg-primary px-6 py-14 text-center text-primary-foreground sm:px-10 lg:px-16 lg:py-20">
              <p className="text-[0.6875rem] font-semibold tracking-[0.22em] text-primary-foreground/70 uppercase">
                Dates for 2026–27
              </p>
              <h2 className="mx-auto mt-5 max-w-2xl text-3xl sm:text-4xl lg:text-5xl">
                Check whether your dates are still open
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-primary-foreground/75 sm:text-base">
                Send us your functions and guest count. You'll hear back from a planner within two
                working days.
              </p>
              <div className="mt-9 flex justify-center">
                <Button asChild size="lg" variant="accent">
                  <Link to="/booking">
                    Request a date <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
