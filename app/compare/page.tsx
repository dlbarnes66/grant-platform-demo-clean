"use client";

import { useState } from "react";
import Link from "next/link";

export default function ComparePage() {
  const [ids, setIds] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runCompare = async () => {
    if (!ids.trim()) return;

    setLoading(true);

    const res = await fetch("/api/compare", {
      method: "POST",
      body: JSON.stringify({ ids }),
    });

    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900">Compare Grants</h1>
        <p className="text-muted mt-2">
          Enter multiple grant IDs to compare them side‑by‑side.
        </p>

        {/* Input */}
        <div className="mt-8 flex gap-3">
          <input
            type="text"
            placeholder="Enter grant IDs separated by commas"
            value={ids}
            onChange={(e) => setIds(e.target.value)}
            className="input flex-1"
          />

          <button
            onClick={runCompare}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? "Comparing…" : "Compare"}
          </button>
        </div>

        {/* Results */}
        <div className="mt-12">
          {loading && (
            <p className="text-muted text-lg">Comparing grants…</p>
          )}

          {!loading && results.length === 0 && (
            <p className="text-muted mt-4">
              No comparison results yet. Enter IDs to begin.
            </p>
          )}

          {results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((grant) => (
                <div key={grant.id} className="card hover-card">

                  {/* Title */}
                  <h2 className="text-xl font-semibold text-gray-900">
                    {grant.title}
                  </h2>

                  {/* Agency */}
                  {grant.agency && (
                    <p className="text-muted mt-1">{grant.agency}</p>
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

                  {/* Buttons */}
                  <div className="mt-6 flex flex-col gap-3">
                    <Link
                      href={`/grants/${grant.id}`}
                      className="btn btn-success w-full text-center"
                    >
                      View Details
                    </Link>

                    <Link
                      href={`/grants/${grant.id}/write`}
                      className="btn btn-primary w-full text-center"
                    >
                      Write with AI
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-12">
          <Link href="/search" className="text-muted underline">
            ← Back to Search
          </Link>
        </div>
      </div>
    </div>
  );
}
