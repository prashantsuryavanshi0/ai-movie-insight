function buildFakeAI(movie: any) {
  const ratingNum = Number(movie?.imdbRating);
  const title = movie?.Title || "This movie";
  const year = movie?.Year || "";
  const plot = (movie?.Plot || "").trim();

  let sentiment: "positive" | "mixed" | "negative" = "mixed";
  if (!Number.isNaN(ratingNum)) {
    if (ratingNum >= 7.6) sentiment = "positive";
    else if (ratingNum <= 6.0) sentiment = "negative";
    else sentiment = "mixed";
  }

  const key_points: string[] = [];

  if (sentiment === "positive") {
    key_points.push("Strong overall reception based on rating signals");
    key_points.push("Story and entertainment value likely resonated with viewers");
    key_points.push("Recommend for fans of the genre / similar titles");
  } else if (sentiment === "negative") {
    key_points.push("Lower rating suggests mixed-to-poor audience reception");
    key_points.push("Some aspects (pacing/plot) may not work for many viewers");
    key_points.push("Better for niche audiences or completionists");
  } else {
    key_points.push("Moderate rating suggests a mixed audience response");
    key_points.push("Some viewers enjoy it, others may find flaws in execution");
    key_points.push("Worth trying if you like the cast/genre");
  }

  const summaryLines = [
    `${title} ${year ? `(${year})` : ""} shows an overall **${sentiment}** audience signal based on IMDb rating.`,
    plot
      ? `The plot suggests: ${plot}`
      : "Plot data is limited, so sentiment is inferred mostly from rating signals.",
    `Overall, this looks like a **${sentiment}** pick — expectations should match the rating.`,
  ];

  return {
    summary: summaryLines.join("\n\n"),
    sentiment,
    key_points,
    note: "AI insight simulated locally (no external LLM call).",
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const imdbId = (body?.imdbId || "").trim();

    if (!imdbId) {
      return Response.json(
        { error: "IMDb ID required (e.g., tt0133093)" },
        { status: 400 }
      );
    }

    if (!/^tt\d{7,9}$/.test(imdbId)) {
      return Response.json(
        { error: "Invalid IMDb ID format (e.g., tt0133093)" },
        { status: 400 }
      );
    }

    const url = `https://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.OMDB_API_KEY}`;
    const movieRes = await fetch(url, { cache: "no-store" });
    const movie = await movieRes.json();

    if (movie?.Response === "False") {
      return Response.json(
        { error: movie?.Error || "Movie not found" },
        { status: 404 }
      );
    }

    const ai = buildFakeAI(movie);

    return Response.json({
      movie: {
        title: movie?.Title,
        poster: movie?.Poster,
        year: movie?.Year,
        rating: movie?.imdbRating,
        plot: movie?.Plot,
        cast: movie?.Actors,
      },
      ai,
    });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}