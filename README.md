# AI Movie Insight Builder

AI Movie Insight Builder is a full-stack Next.js application that generates audience sentiment insights for movies using IMDb data.

Users enter an IMDb movie ID, and the application fetches movie details from the OMDb API and generates AI-style audience insights using a local sentiment heuristic model.

---

## Live Demo

👉 https://ai-movie-insight-pi.vercel.app/

---

## What This Project Does

- Accepts IMDb Movie ID (e.g., `tt0133093`)
- Fetches movie data from OMDb API
- Displays:
  - Poster
  - Title
  - Year
  - Cast
  - IMDb Rating
  - Plot
- Generates audience sentiment:
  - Positive / Neutral / Negative
- Produces AI-style insight summary

---

## Tech Stack

- **Next.js 16 (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **OMDb API**
- **Jest (Unit Testing)**
- **Vercel (Deployment)**

---

## Architecture Overview

Frontend (React UI)
↓
API Route (`/api/movie`)
↓
OMDb API Fetch
↓
Local Sentiment Logic
↓
Rendered AI Insight Component

---

## Sentiment Logic (Heuristic Model)

Instead of calling an external LLM API, this project uses:

- IMDb rating thresholds
- Basic sentiment keyword detection
- Plot + rating signal combination

This ensures:

- No billing dependency
- Fully functional deployment
- Faster performance
- Deterministic results

---

## Testing

Unit tests are implemented using Jest.

### Run tests:

```bash
npm test
```
