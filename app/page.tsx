"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-16">
      <div className="max-w-4xl mx-auto text-center">

        {/* Hero Section */}
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          Discover Grants. Write Faster. Win More.
        </h1>

        <p className="text-lg text-muted mt-4 max-w-2xl mx-auto">
          GrantScout Pro helps you find the right grants, analyze eligibility,
          compare opportunities, and generate polished proposals with AI.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/search" className="btn btn-primary">
            Search Grants
          </Link>

          <Link href="/writer" className="btn btn-success">
            Write with AI
          </Link>

          <Link href="/compare" className="btn btn-secondary">
            Compare Grants
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="card hover-card">
            <h2 className="text-xl font-semibold">AI Grant Matching</h2>
            <p className="text-gray-700 mt-2">
              Instantly find grants that match your mission, location, and
              organizational profile.
            </p>
          </div>

          <div className="card hover-card">
            <h2 className="text-xl font-semibold">AI Proposal Writer</h2>
            <p className="text-gray-700 mt-2">
              Generate full grant proposals, narratives, and responses using
              your organization’s data.
            </p>
          </div>

          <div className="card hover-card">
            <h2 className="text-xl font-semibold">Grant Comparison</h2>
            <p className="text-gray-700 mt-2">
              Compare multiple grants side‑by‑side to see which opportunities
              offer the best fit.
            </p>
          </div>

          <div className="card hover-card">
            <h2 className="text-xl font-semibold">Save & Track Grants</h2>
            <p className="text-gray-700 mt-2">
              Save grants, track deadlines, and revisit opportunities anytime.
            </p>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-16">
          <Link href="/start" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
