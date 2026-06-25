"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [orgName, setOrgName] = useState("");
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [matches, setMatches] = useState([]);

  // Load profile basics
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        setOrgName(data?.name || "Your Organization");
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    loadProfile();
  }, []);

  // Load AI grant matches
  const loadMatches = async () => {
    setLoadingMatches(true);

    const res = await fetch("/api/match-grants", {
      method: "POST",
      body: JSON.stringify({ userId: "test-user-id" }), // Replace with real user ID later
    });

    const data = await res.json();
    setMatches(data.grants || []);
    setLoadingMatches(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900">
          Welcome, {orgName}
        </h1>
        <p className="text-gray-600 mt-2">
          Your personalized grant dashboard is ready.
        </p>
      </div>

      {/* Main CTA */}
      <div className="max-w-5xl mx-auto mt-10">
        <Link
          href="/search"
          className="block w-full bg-white border border-yellow-400 text-yellow-600 text-center py-4 rounded-xl shadow hover:bg-yellow-50 transition text-lg font-medium"
        >
          Start Your First Grant Search
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/profile"
          className="bg-white p-6 rounded-xl shadow border border-gray-200 hover:bg-gray-50 transition"
        >
          <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
          <p className="text-gray-600 mt-1 text-sm">
            Update your organization details
          </p>
        </Link>

        <Link
          href="/saved-searches"
          className="bg-white p-6 rounded-xl shadow border border-gray-200 hover:bg-gray-50 transition"
        >
          <h3 className="text-lg font-semibold text-gray-900">Saved Searches</h3>
          <p className="text-gray-600 mt-1 text-sm">
            View your saved grant searches
          </p>
        </Link>

        <Link
          href="/saved-grants"
          className="bg-white p-6 rounded-xl shadow border border-gray-200 hover:bg-gray-50 transition"
        >
          <h3 className="text-lg font-semibold text-gray-900">Saved Grants</h3>
          <p className="text-gray-600 mt-1 text-sm">
            Grants you’ve bookmarked
          </p>
        </Link>

        <Link
          href="/history"
          className="bg-white p-6 rounded-xl shadow border border-gray-200 hover:bg-gray-50 transition"
        >
          <h3 className="text-lg font-semibold text-gray-900">Search History</h3>
          <p className="text-gray-600 mt-1 text-sm">
            Review your past activity
          </p>
        </Link>
      </div>

      {/* AI Grant Matching */}
      <div className="max-w-5xl mx-auto mt-16">
        <h2 className="text-2xl font-semibold text-gray-900">
          AI‑Powered Grant Recommendations
        </h2>
        <p className="text-gray-600 mt-1">
          Based on your onboarding profile
        </p>

        <button
          onClick={loadMatches}
          disabled={loadingMatches}
          className="mt-6 px-6 py-3 bg-brandBlue text-white rounded-lg shadow hover:bg-brandBlue/90 transition"
        >
          {loadingMatches ? "Loading Recommendations..." : "Generate Recommendations"}
        </button>

        {/* Results */}
        <div className="mt-8 space-y-6">
          {matches.map((g: any, i: number) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900">{g.name}</h3>
              <p className="text-gray-600">{g.funder}</p>

              <p className="mt-2 text-sm text-gray-700">
                <strong>Amount:</strong> {g.amountRange}  
                <br />
                <strong>Deadline:</strong> {g.deadline}
              </p>

              <p className="mt-3 text-gray-800">
                <strong>Why it matches:</strong> {g.whyItMatches}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                <strong>Eligibility:</strong> {g.keyEligibilityPoints}
              </p>
            </div>
          ))}

          {matches.length === 0 && !loadingMatches && (
            <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6 shadow text-gray-500 text-center">
              No recommendations yet. Click the button above to generate AI‑powered matches.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
