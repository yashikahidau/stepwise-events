# Stepwise Events

DESIGN CONSISTENCY & MICRO-INTERACTIONS:

Treat the entire website as one cohesive design system.

Every interaction must use a consistent motion language:

- Same easing principles

- Consistent animation durations

- Consistent hover behavior

- Consistent entrance/reveal behavior

- Consistent button interactions

- Consistent focus states

- Consistent image hover/reveal treatment

Micro-animations should exist where they improve usability or visual quality, not simply because animation is possible.

Examples:

- Navbar links: subtle underline/opacity/position transition

- CTA buttons: restrained scale/color transition

- Images: subtle scale or reveal on hover

- Cards: controlled lift/shadow transition

- Gallery: image movement/reveal without excessive zoom

- Calendar: clear hover, focus, selected and unavailable states

- Form fields: smooth focus transitions and clear validation feedback

- Mobile menu: smooth open/close transition

- Sections: subtle viewport-based reveal

- Page transitions: only if they genuinely improve the experience

Avoid:

- excessive parallax

- bouncing elements

- unnecessary floating animations

- animation on every element

- long or slow transitions

- animations that interfere with accessibility or usability

Use performant CSS transforms and opacity wherever possible.

MOTION TOKENS:

Establish consistent motion values instead of inventing different durations for every component.

For example:

- Fast interaction: ~150–200ms

- Standard interaction: ~250–350ms

- Larger reveal: ~500–700ms

Use appropriate easing consistently.

TOASTERS & FEEDBACK:

Use themed toast notifications only where they are actually useful.

They must visually belong to the Stepwise Events design system:

- Alabaster background

- Deep Emerald typography

- Terracotta used as an accent

- Subtle border/shadow

- Appropriate icon

- Clear concise message

- Consistent positioning

- Responsive sizing

Use toasters for meaningful asynchronous feedback such as:

- Booking request successfully submitted

- Booking submission failed

- Admin status successfully updated

- Authentication-related actions where required

Do NOT use toasters for every interaction.

For validation errors, prefer inline field-level feedback where appropriate.

CONTENT QUALITY:

Do not use generic filler copy such as:

"Lorem ipsum"

"Your dream wedding starts here"

"Making memories that last forever"

unless it genuinely fits the brand.

Write concise, believable copy for a premium Indian wedding/event planning business.

Every heading, subtitle, CTA, label and supporting sentence should have a clear purpose.

CTA wording should be action-oriented and consistent throughout the website.

Avoid excessive marketing language and exaggerated claims.

SPACING & VISUAL RHYTHM:

Maintain a deliberate spacing system throughout the entire application.

Sections should have:

- consistent vertical rhythm

- controlled content widths

- intentional whitespace

- clear visual hierarchy

- responsive spacing

Do not independently choose arbitrary padding/margins for every section.

Spacing must adapt between:

- mobile

- tablet

- desktop

- large desktop

IMAGE DIRECTION:

Use high-quality realistic placeholder imagery appropriate for:

- Indian weddings

- elegant ceremonies

- receptions

- floral/stage styling

- intimate celebrations

- luxury event details

- couples and guests

- event venues

Images should support the content rather than simply fill empty space.

Use varied image compositions and aspect ratios where appropriate.

Avoid repetitive stock-photo-looking compositions.

All images must:

- have meaningful alt text

- use responsive sizing

- use Next.js image optimization where applicable

- avoid causing layout shift

RESPONSIVE DESIGN:

Responsiveness is part of the initial implementation, not a final polishing step.

Every route and every component must be tested conceptually across:

320px, 375px, 390px, 430px, tablet, laptop and large desktop.

Do not simply collapse desktop layouts.

For mobile, deliberately reconsider:

- typography scale

- section spacing

- image ratios

- navigation

- gallery composition

- buttons

- forms

- calendar

- tables

- admin controls

No horizontal overflow.

No text clipping.

No elements extending outside their containers.

No unusably small touch targets.

ROUTE COMPLETENESS:

Every generated route must feel finished.

HOME:

/

- Complete marketing experience

- Navigation

- Hero

- Services

- Event types

- Gallery

- Process

- About

- Testimonials

- Booking CTA

- Footer

BOOKING:

/booking

- Clear introduction

- Date selection

- Event details

- Client information

- Validation

- Loading state

- Success state

- Error state

- Mobile-friendly layout

ADMIN:

/admin

- Separate dashboard visual language

- Booking list/table

- Search/filter where useful

- Status indicators

- Responsive mobile representation

- Empty state

- Loading state

- Error state

Do not leave routes as incomplete demonstrations.

LOADING / EMPTY / ERROR STATES:

Design appropriate states for dynamic interfaces.

For example:

Booking:

- Loading availability

- No available dates

- Date selected

- Form submitting

- Successful submission

- Submission error

Admin:

- Loading bookings

- No bookings yet

- Booking list

- Error loading bookings

These states should use the same Stepwise Events visual language.

FINAL QUALITY BAR:

Before considering the design complete, check the entire application as a user would experience it from beginning to end.

Verify:

- visual consistency

- typography

- spacing

- imagery

- content

- animations

- hover states

- focus states

- form states

- toasters

- loading states

- empty states

- error states

- mobile layouts

- tablet layouts

- desktop layouts

- accessibility

- SEO structure

- performance considerations

The result should feel intentionally designed, not like multiple AI-generated sections assembled together.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d5f7b55e-3972-4950-af3d-91716c81f8f6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
