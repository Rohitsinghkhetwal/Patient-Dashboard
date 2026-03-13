# 🏥 Patient Dashboard

A full-stack patient management dashboard built with **Next.js 16**, featuring real-time search, sorting, pagination, and a responsive UI.

🔗 **Live Demo:** [patient-dashboard-omega-eight.vercel.app](https://patient-dashboard-omega-eight.vercel.app/)

----------

## 📋 Table of Contents

-   [Features](https://claude.ai/chat/5a628f05-b16c-41d9-97a7-1063689e2f3c#features)
-   [Tech Stack](https://claude.ai/chat/5a628f05-b16c-41d9-97a7-1063689e2f3c#tech-stack)
-   [Setup Instructions](https://claude.ai/chat/5a628f05-b16c-41d9-97a7-1063689e2f3c#setup-instructions)
-   [Project Structure](https://claude.ai/chat/5a628f05-b16c-41d9-97a7-1063689e2f3c#project-structure)
-   [Architectural Decisions](https://claude.ai/chat/5a628f05-b16c-41d9-97a7-1063689e2f3c#architectural-decisions)
-   [API Reference](https://claude.ai/chat/5a628f05-b16c-41d9-97a7-1063689e2f3c#api-reference)

----------

## ✨ Features

-   🔍 **Debounced Search** — search patients by name, medical issue, email, or address
-   🔃 **Sorting** — sort by name, age, or ID in ascending/descending order
-   📄 **Pagination** — server-side pagination with 12 patients per page
-   📱 **Responsive UI** — works on mobile, tablet, and desktop
-   🎨 **Color-coded Medical Issues** — visual pill badges per condition
-   ⚡ **Server Components** — data fetching happens on the server, no client-side loading states

----------

## 🛠 Tech Stack

Technology

Purpose

Next.js 15

Full-stack React framework

TypeScript

Type safety

Tailwind CSS

Styling

Lucide React

Icons

Vercel

Deployment

----------

## 🚀 Setup Instructions

### Prerequisites

-   Node.js 18+
-   npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/Rohitsinghkhetwal/Patient-Dashboard.gitt


```

### 2. Install dependencies

```bash
npm install

```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000

```

For production (Vercel), set:

```env
NEXT_PUBLIC_BASE_URL=https://your-app-name.vercel.app

```

### 4. Run the development server

```bash
npm run dev

```

Open [http://localhost:3000](http://localhost:3000/) in your browser.

### 5. Build for production

```bash
npm run build
npm start

```

----------

## 📁 Project Structure

```
├── app/
│   ├── page.tsx                  # Home page — reads searchParams, passes to components
│   └── api/
│       └── patients/
│           ├── route.ts          # GET /api/patients — list with search, sort, pagination
│           └── [id]/
│               └── route.ts     # GET /api/patients/:id — single patient
├── components/
│   ├── Navbar.tsx                # Top navigation bar
│   ├── Searchbar.tsx             # Search + sort controls (client component)
│   └── PatientPage.tsx           # Patient card grid (server component)
├── lib/
│   ├── getPatients.ts            # Data access functions
│   └── Types/
│       └── types.ts              # TypeScript interfaces
└── public/

```

----------

## 🏛 Architectural Decisions

### 1. URL-driven State (Search & Sort)

Search and sort state lives in the **URL query params** (`?search=john&sort_by=age&sort_dir=desc&page=1`) rather than React state or a global store.

**Why:**

-   Shareable and bookmarkable URLs
-   Browser back/forward navigation works naturally
-   Server components can read state directly without client-side hydration
-   No need for context or state management libraries

### 2. Server Components for Data Fetching

`PatientPage.tsx` is an **async server component** that fetches data directly on the server.

**Why:**

-   No loading spinners or client-side fetch waterfalls
-   Data is ready when the page renders
-   Better SEO — content is in the initial HTML
-   Reduced JavaScript bundle sent to the client

### 3. Client Component Only Where Needed

`Searchbar.tsx` is the only `"use client"` component because it needs:

-   `useRouter` to update the URL
-   `useSearchParams` to read current URL state
-   `useState` for controlled input and debouncing

Everything else is a server component.

### 4. Debounced Search

Search input uses a **500ms debounce** before updating the URL, preventing an API call on every single keystroke.

```ts
debounceRef.current = setTimeout(() => {
  router.replace(`/?search=${v}&page=1`);
}, 500);

```

### 5. API Route for Data

A dedicated `/api/patients` route handles all filtering, sorting, and pagination logic server-side. This keeps the data layer separate and makes the API reusable for future clients (mobile app, etc.).

### 6. Next.js 16 — Async `searchParams` and `params`

Next.js 15 made `searchParams` and dynamic route `params` asynchronous Promises. All page components and route handlers `await` them:

```ts
// page.tsx
const params = await searchParams;

// [id]/route.ts
const { id } = await params;

```

### 7. External Images

All external image hostnames are whitelisted via a wildcard in `next.config.js` to support dynamic patient photo URLs from any domain:

```js
images: {
  remotePatterns: [{ protocol: "https", hostname: "**" }]
}

```

----------

## 📡 API Reference

### `GET /api/patients`

Returns a paginated, filtered, and sorted list of patients.

Query Param

Type

Default

Description

`page`

number

`1`

Page number

`limit`

number

`12`

Results per page (max 100)

`search`

string

`""`

Search by name, issue, email, address

`medical_issue`

string

`""`

Filter by exact medical issue

`sort_by`

string

`patient_id`

Field to sort by

`sort_dir`

`asc` | `desc`

`asc`

Sort direction

**Response:**

```json
{
  "data": [...],
  "meta": {
    "total": 84,
    "page": 1,
    "limit": 12,
    "totalPages": 7
  }
}

```

### `GET /api/patients/:id`

Returns a single patient by ID.

Status

Description

`200`

Patient found

`400`

Invalid ID (not a positive number)

`404`

Patient not found

`500`

Internal server error

## Thank You !😉