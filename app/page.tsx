"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Result = {
  movie: {
    title: string;
    poster: string;
    year: string;
    rating: string;
    plot: string;
    cast: string;
  };
  ai: {
    summary?: string;
    sentiment?: "positive" | "mixed" | "negative";
    key_points?: string[];
    note?: string;
  };
};

function SentimentBadge({ sentiment }: { sentiment?: string }) {
  const s = (sentiment || "mixed").toLowerCase();
  const cls =
    s === "positive"
      ? "border-green-500/30 bg-green-500/15 text-green-200"
      : s === "negative"
      ? "border-red-500/30 bg-red-500/15 text-red-200"
      : "border-yellow-500/30 bg-yellow-500/15 text-yellow-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${cls}`}
    >
      {s.toUpperCase()}
    </span>
  );
}

export default function Home() {
  const [imdbId, setImdbId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const onAnalyze = async () => {
    setError("");
    setResult(null);

    const id = imdbId.trim();
    if (!id) return setError("Please enter an IMDb ID (example: tt0133093).");
    if (!/^tt\d{7,9}$/.test(id))
      return setError("Invalid IMDb ID format. Example: tt0133093");

    try {
      setLoading(true);
      const res = await fetch("/api/movie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imdbId: id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong");
      setResult(data);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white">
      <div className="mx-auto max-w-5xl px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            AI Movie Insight Builder
          </h1>
          <p className="mt-3 text-zinc-300">
            Enter an IMDb movie ID and get AI-style audience sentiment insights.
          </p>
        </motion.div>

        <div className="mt-10 flex flex-col md:flex-row gap-3 items-center justify-center">
          <input
            value={imdbId}
            onChange={(e) => setImdbId(e.target.value)}
            placeholder="IMDb ID (e.g., tt0133093)"
            className="w-full md:w-[420px] rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-white/20"
          />
          <button
            onClick={onAnalyze}
            disabled={loading}
            className="w-full md:w-auto rounded-2xl bg-white text-black px-6 py-3 font-medium hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {error && (
          <div className="mx-auto mt-4 max-w-2xl rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-8 flex justify-center text-zinc-300">
            <span className="animate-pulse">
              Fetching movie + generating insight...
            </span>
          </div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 grid gap-6"
          >
            {/* Movie Card */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={
                    result.movie.poster && result.movie.poster !== "N/A"
                      ? result.movie.poster
                      : "/next.svg"
                  }
                  alt={result.movie.title}
                  className="w-full md:w-56 rounded-2xl object-cover border border-white/10"
                />

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold">
                        {result.movie.title}
                      </h2>
                      <p className="text-zinc-300 mt-1">
                        {result.movie.year} • IMDb {result.movie.rating}
                      </p>
                    </div>
                    <SentimentBadge sentiment={result.ai?.sentiment} />
                  </div>

                  <p className="mt-4 text-zinc-200 leading-relaxed">
                    {result.movie.plot}
                  </p>

                  <p className="mt-4 text-zinc-300">
                    <span className="text-white font-medium">Cast: </span>
                    {result.movie.cast}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Insight */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">AI Audience Insight</h3>
                  <p className="mt-1 text-xs text-zinc-400">
                    Insight generated via local heuristic model (rating + plot).
                  </p>
                </div>
                <SentimentBadge sentiment={result.ai?.sentiment} />
              </div>

              <p className="mt-4 text-zinc-200 whitespace-pre-line leading-relaxed">
                {result.ai?.summary || "No AI summary received."}
              </p>

              {Array.isArray(result.ai?.key_points) &&
                result.ai.key_points.length > 0 && (
                  <div className="mt-5">
                    <p className="text-sm font-medium text-zinc-200">
                      Key Takeaways
                    </p>
                    <ul className="mt-2 list-disc pl-5 text-zinc-300 space-y-1">
                      {result.ai.key_points.slice(0, 6).map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {result.ai?.note && (
                <p className="mt-5 text-xs text-zinc-500">{result.ai.note}</p>
              )}
            </div>
          </motion.div>
        )}

        <p className="mt-12 text-center text-zinc-500 text-sm">
          Try: <span className="text-zinc-300">tt0133093</span> (The Matrix)
        </p>
      </div>
    </main>
  );
}