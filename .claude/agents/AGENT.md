# Rent4U — Vacation Home Rental Service — Proposal by @pyaephyo11979

## Gist

A web platform where homeowners list their properties as vacation rentals and travelers browse, book, and pay for stays — a simpler, self-built alternative to Airbnb for local and regional markets.

## Story

A family planning a weekend trip to Ngapali Beach spends an evening scrolling through Facebook groups and messaging random property owners. Half the listings have no prices, some don't reply for days, and there's no way to know if the place is even available. Meanwhile, a homeowner with a beautiful beachfront villa has no easy way to reach these travelers — they post in three different groups and still get double-booked. Rent4U connects both sides: travelers see real availability and prices, homeowners manage their calendar in one place, and booking happens in minutes instead of days of back-and-forth messaging.

## Why

Vacation rental discovery in Myanmar (and similar markets) is still stuck in Facebook groups and word-of-mouth. There's no dedicated platform that handles listings, availability, and booking in one flow. Homeowners lose revenue from poor visibility and double-bookings; travelers waste time and lose trust. Rent4U removes that friction by giving homeowners a real listing page with a booking calendar and giving travelers a searchable, filterable directory with upfront pricing and instant booking.

## Why Not

- We are not building a payment processing system. At MVP, booking is confirmed and payment is handled offline (bank transfer, mobile pay) — no Stripe or card integration.
- We are not building a review/rating system. Guests can leave a text review after their stay, but no star ratings, no aggregation, no ranking algorithm.
- We are not building a messaging/chat system. Communication happens via phone number or email displayed on the booking confirmation — no in-app chat.
- We are not building a host verification or background check system. Host accounts are approved manually at MVP.

## Tech Spec

**Stack:** Express.js (Node.js) for the backend REST API, React.js for the frontend, PostgreSQL for the database, Cloudinary for image uploads.

**Five main pieces:**

1. **Property Listings Engine** — Hosts create listings with title, description, location, amenities, pricing (per night), and photo gallery. Listings are searchable and filterable by location, price range, guest count, and amenities.
2. **Availability & Booking System** — Calendar-based availability management. Hosts block dates; guests select check-in/check-out dates to see total price and submit a booking request. Double-booking prevented at the database level with date range overlap checks.
3. **User Accounts & Roles** — Two roles: Host and Guest. Auth via email + password (JWT). Hosts manage their listings and bookings; guests manage their bookings and profile.
4. **Search & Discovery** — Homepage with featured listings, location-based search, filters (price, guests, amenities). Results paginated with sorting options.
5. **Booking Dashboard** — Hosts see incoming booking requests with guest details and dates, can confirm or decline. Guests see their booking history and status (pending, confirmed, completed, cancelled).

## Definition of Done

- [ ] Host can register, create a listing with photos, description, pricing, and amenities
- [ ] Listing appears in search results and can be filtered by location, price, and guest count
- [ ] Guest can select dates, see total price, and submit a booking request
- [ ] Double-booking is prevented — overlapping dates cannot be confirmed for the same property
- [ ] Host can confirm or decline booking requests from their dashboard
- [ ] Guest can view booking status and history in their dashboard
- [ ] Contact details (phone/email) are shown on booking confirmation for both parties
- [ ] Image upload works via Cloudinary with reasonable file size limits
- [ ] App is fully responsive on mobile and desktop
- [ ] Auth (register, login, logout) works with JWT and persists session