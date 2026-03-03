# AI Movie Insight Builder

A full-stack Next.js app where users enter an IMDb movie ID (e.g., `tt0133093`) and the app fetches real movie details (title, poster, cast, year, rating, plot) and generates an AI-style audience sentiment insight (summary + sentiment label + key takeaways).

> Note: The “AI insight” is simulated locally using a heuristic model (IMDb rating + plot) to demonstrate the end-to-end workflow without external LLM billing dependencies.

---

## Features

- IMDb ID input with validation (e.g., `tt0133093`)
- Fetches real movie data from OMDb:
  - Title, Poster, Cast, Year, IMDb rating, Plot
- “AI-style” audience insight generation:
  - Summary (multi-line)
  - Sentiment classification: Positive / Mixed / Negative
  - Key takeaways
- Responsive UI (mobile + desktop)
- Loading + error states
- Clean Next.js App Router + API Route structure

---

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- Framer Motion (small animations)
- OMDb API (movie details)

---

## Project Structure

- `app/page.tsx` → UI (input, cards, insight display)
- `app/api/movie/route.ts` → Backend API route (fetch OMDb + build insight)
- `.env.local` → environment variables (NOT committed)

---

## Setup (Local)

### 1) Install dependencies

```bash
npm install
npm run dev
```
