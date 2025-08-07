# ReservationApp

A modern, customizable restaurant reservation system template built with Next.js, React, and Tailwind CSS. Easily adaptable for any restaurant or hospitality business.

---

## Features

- **Beautiful Booking UI**: Calendar, people counter, and time picker
- **Admin Panel**: Manage reservation settings, custom days, and weekly schedule
- **Google Calendar Integration**: Bookings create events in your Google Calendar (via service account)
- **Fully Customizable Theme**: Centralized color and style system
- **TypeScript**: End-to-end type safety
- **Production-Ready Structure**: Easily migrate to PostgreSQL and real authentication

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ReservationApp.git
cd ReservationApp/restemplate
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the `restemplate` directory:

```env
# Google Calendar API Configuration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
```

- **GOOGLE_SERVICE_ACCOUNT_EMAIL**: From your Google Cloud service account JSON
- **GOOGLE_PRIVATE_KEY**: The private key from your JSON (keep the BEGIN/END lines, use `\n` for newlines if needed)
- **GOOGLE_CALENDAR_ID**: The calendar ID (from Google Calendar settings, can be your email or a group calendar ID)

> **Note:** For production, you can add PostgreSQL and real authentication. See the "Production Migration" section below.

### 4. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## Pages

- `/` — Home (landing page)
- `/book` — Booking form (calendar, people, time, customer info)
- `/admin` — Admin panel (settings, custom days, weekly schedule)

---

## Local Environment Variables Guide

- **.env.local** is required for Google Calendar integration.
- Never commit your `.env.local` to public repositories.
- For PostgreSQL, add:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/yourdb
```

---

## Customization Guide

### Theme & Colors
- Edit `lib/theme.ts` to change colors, spacing, and style tokens.
- All UI components use the theme system for consistency.

### Adding Components
- Place new components in `components/ui/` and export from `components/ui/index.ts`.

### Styling
- Use Tailwind CSS utility classes and theme variables.

---

## Production Migration (PostgreSQL Ready)

- Replace all `localStorage` usage with database queries (see `lib/adminSettings.ts` for logic to migrate)
- Add authentication (NextAuth.js, Clerk, or custom)
- Use `/api` routes for all admin and booking actions
- Example schema for PostgreSQL is provided in the project discussion

---

## Tech Stack

- **Next.js 15**
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Google Calendar API**

---

## License

MIT License — use this template for your restaurant or hospitality project!
