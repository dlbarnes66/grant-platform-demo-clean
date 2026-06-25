"use client";

import { useState } from "react";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);

    const res = await fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="max-w-5xl mx-auto">

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900">Grant Search</h1>
        <p className="text-muted mt-2">
          Search for grants and explore opportunities that match your mission.
        </p>

        {/* Search Bar */}
        <div className="mt-8 flex gap-3">
          <input
            type="text"
            placeholder="Search grants…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input flex-1"
          />

          <button
            onClick={runSearch}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </div>

        {/* Results */}
        <div className="mt-10">
          {loading && (
            <p className="text-gray-600 text-lg">Searching for grants…</p>
          )}

          {!loading && results.length === 0 && (
            <p className="text-muted mt-4">No results yet. Try a search.</p>
          )}

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((grant) => (
              <div key={grant.id} className="card hover-card">

                {/* Title */}
                <h2 className="text-lg font-semibold text-gray-900 leading-tight">
                  {grant.title}
                </h2>

                {/* Agency */}
                {grant.agency && (
                  <p className="text-sm text-muted mt-1">{grant.agency}</p>
                )}

                {/* Metadata */}
                <div className="mt-4 space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Amount:</span>{" "}
                    {grant.amount || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Deadline:</span>{" "}
                    {grant.deadline || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Category:</span>{" "}
                    {grant.category || "N/A"}
                  </p>
                </div>

                {/* Summary */}
                <p className="mt-4 text-gray-700 text-sm leading-relaxed line-clamp-4">
                  {grant.summary || "No summary available."}
                </p>

                {/* View Details Button */}
                <Link
                  href={`/grants/${grant.id}`}
                  className="btn btn-success mt-6 w-full text-center"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-10">
          <Link href="/" className="text-muted underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
