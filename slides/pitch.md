---
marp: true
paginate: true
transition: fade
# PechaKucha: 6 slides, 20s auto-advance. Do not change the count.
auto-advance: 20
---

<!-- slide 1 -->
# Who's my person?

- **Travelers** in Myanmar searching for vacation homes on Facebook groups
- **Homeowners** with beautiful properties but no easy way to list them
- Both sides waste time with back-and-forth messaging, no pricing, no availability info

---

<!-- slide 2 -->
# Their problem

- No dedicated rental platform for Myanmar's local market
- Travelers scroll through scattered Facebook posts — half have no prices, some never reply
- Homeowners get double-booked across multiple groups
- No search, no filters, no booking flow — just chaos

---

<!-- slide 3 -->
# What I built

**Rent4U** — a full-stack vacation rental platform

- 🔐 **Auth & Roles** — JWT login/register with Admin, Host, Guest roles
- 🏠 **Property Listings** — Hosts create listings with photos, pricing, rooms, city
- 🔍 **Search & Filters** — Browse by city, price range, rooms; sort & paginate
- 📅 **Booking & Payments** — Guests book available homes with payment tracking
- 📊 **Dashboard** — Hosts manage listings; guests track bookings
- 🌐 **i18n** — English + Myanmar language support

---

<!-- slide 4 -->
# How I built it

- **MCP:** Chrome DevTools MCP for live frontend debugging & inspection
- **Skill:** `react-i18n-localization` — auto-extracted skill for adding multi-language support with i18next
- **Agent:** Claude + Qwen Code agents with custom skills for backend development, testing, and frontend UI

**Stack:** React 19 · Vite · Tailwind CSS · Express.js v5 · Prisma · SQLite · JWT · TypeScript

---

<!-- slide 5 -->
# Why it matters

- Replaces fragmented Facebook-group workflows with a single platform
- Homeowners get real listing pages — no more triple-posting
- Travelers see real prices and availability — booking in minutes, not days
- Double-booking eliminated at the database level
- Myanmar-language support means accessibility for local users
- A foundation that can scale to other regional markets

---

<!-- slide 6 -->
# Done checklist

- [x] repo public
- [x] MCP + skill + agent used
- [x] report.md in team repo
