# Specification

## Summary
**Goal:** Build the LawConnect SaaS MVP enabling users to find lawyers, view profiles, book consultations, message within booked relationships, manage subscriptions/payments, and use role-based client/lawyer dashboards, with a consistent non-blue/purple visual theme and marketing homepage.

**Planned changes:**
- Add Internet Identity authentication plus first-login onboarding to choose exactly one role (Client or Lawyer), with role-gated routing and permissions.
- Build public marketing homepage with: hero + CTAs (“Find a Lawyer”, “Join as a Lawyer”), How It Works (3 steps), subscription plans preview (client + lawyer), static testimonials, For Businesses section, and final CTA.
- Apply a consistent visual theme across marketing, directory, profiles, and dashboards (avoid blue/purple dominant palette).
- Implement “Find a Lawyer” directory with filters (practice area, location, experience level, language, rating, availability Today/This Week) and lawyer cards (photo, experience, specialization, fee, availability indicator/button, “Subscribe & Book” CTA).
- Implement verified lawyer profile pages with bio, credentials, expertise, reviews, consultation fee, and selectable available time slots; include CTAs to book and subscribe.
- Build booking system: lawyers manage availability slots; clients book slots; prevent double-booking; show upcoming consultations in client dashboard and upcoming bookings in lawyer dashboard (calendar/list).
- Implement 1:1 in-app messaging scoped to a booking/connection, accessible from both dashboards, persisted and loaded chronologically (poll/refetch approach).
- Add subscription plans and management:
  - Client plans: Starter (GHC 99/mo), Professional (GHC 299/mo), Business (GHC 899/mo) with enforcement of consultation entitlements/usage display.
  - Lawyer plans: Basic (GHC 199/mo), Pro (GHC 499/mo) with featured/priority placement and basic analytics (views/bookings/messages).
- Track payments as in-app records (pending/paid/refunded) for subscriptions and paid consultations; show client payment history and lawyer earnings summary.
- Support optional commission model (configurable 10%–20%) on paid consultations and reflect gross/commission/net in earnings summary (at least current month).
- Implement client dashboard sections: upcoming consultations, chat access, payment history, subscription management, document vault (small persisted items), and saved lawyers (persisted).
- Implement lawyer dashboard sections: booking calendar, client messages, earnings summary, availability settings, reviews view, and subscription upgrade controls.
- Add reviews system: only clients with completed consultations can submit rating + written review; display average rating and reviews; rating filter uses stored average rating.
- Seed backend with example lawyers (varied attributes + sample availability) and provide a minimal “Join as a Lawyer” flow to create/manage a lawyer profile (including profile photo upload or default).
- Add generated brand assets (logo + simple UI illustrations) as static files under `frontend/public/assets/generated` and reference them from marketing/auth pages.

**User-visible outcome:** Users can sign in with Internet Identity, choose Client or Lawyer role, browse a seeded lawyer directory with filters, view lawyer profiles and availability, subscribe to plans, book consultations without double-booking, message within booked relationships, leave reviews after completed consultations, and manage payments/earnings and documents/saved items via role-specific dashboards.
