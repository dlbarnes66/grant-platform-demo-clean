"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function GrantDetailsPage() {
  const { id } = useParams();
  const [grant, setGrant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // Load grant details
  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/grants/${id}`);
      const data = await res.json();
      setGrant(data.grant || null);
      setLoading(false);
    };

    load();
  }, [id]);

  // Save grant
  const saveGrant = async () => {
    if (!grant) return;

    setSaving(true);

    await fetch("/api/saved-grants", {
      method: "POST",
      body: JSON.stringify({
        grantId: grant.id,
        title: grant.title,
        summary: grant.summary,
        amount: grant.amount,
        deadline: grant.deadline,
        category: grant.category,
        agency: grant.agency,
        url: grant.url,
      }),
    });

    setSaving(false);
    alert("Grant saved!");
  };

  // Run AI Fit Analysis
  const analyzeGrant = async () => {
    setAnalyzing(true);

    const res = await fetch("/api/grants/analyze", {
      method: "POST",
      body: JSON.stringify({ grantId: grant.id }),
    });

    if (res.ok) {
      const data = await res.json();
      setGrant(data.grant);
      alert("AI analysis complete!");
    }

    setAnalyzing(false);
  };

  if (loading) {
    return <div className="p-10 text-gray-600">Loading grant…</div>;
  }

  if (!grant) {
    return <div className="p-10 text-red-600">Grant not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-sm border">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
          {grant.title}
        </h1>

        {grant.agency && (
          <p className="text-gray-600 mt-1 text-lg">{grant.agency}</p>
        )}

        {/* Basic Info */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
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
          {grant.url && (
            <p>
              <a
                href={grant.url}
                target="_blank"
                className="text-blue-600 underline"
              >
                View Original Grant Page
              </a>
            </p>
          )}
        </div>

        {/* Summary */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900">Summary</h2>
          <p className="text-gray-700 mt-3 leading-relaxed whitespace-pre-line">
            {grant.summary || "No summary available."}
          </p>
        </div>

        {/* AI Analysis Section */}
        {grant.fitScore && (
          <div className="mt-12 bg-purple-50 p-6 rounded-xl border border-purple-200 shadow-sm">
            <h2 className="text-xl font-semibold text-purple-800">
              AI Fit Analysis
            </h2>

            <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-800">
              <p>
                <span className="font-semibold">Eligibility Score:</span>{" "}
                {grant.eligibilityScore}
              </p>
              <p>
                <span className="font-semibold">Fit Score:</span>{" "}
                {grant.fitScore}
              </p>
              <p>
                <span className="font-semibold">Risk Score:</span>{" "}
                {grant.riskScore}
              </p>
              <p>
                <span className="font-semibold">Competitiveness:</span>{" "}
                {grant.competitiveness}
              </p>
              <p>
                <span className="font-semibold">Funding Strength:</span>{" "}
                {grant.fundingStrength}
              </p>
              <p>
                <span className="font-semibold">Overall Score:</span>{" "}
                {grant.overallScore}
              </p>
            </div>

            <div className="mt-5 text-gray-800 space-y-4 leading-relaxed">
              {grant.fitExplanation && (
                <p>
                  <span className="font-semibold">Fit Explanation:</span>{" "}
                  {grant.fitExplanation}
                </p>
              )}
              {grant.risks && (
                <p>
                  <span className="font-semibold">Risks:</span> {grant.risks}
                </p>
              )}
              {grant.nextSteps && (
                <p>
                  <span className="font-semibold">Next Steps:</span>{" "}
                  {grant.nextSteps}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-12 flex flex-wrap gap-4">
          <button
            onClick={saveGrant}
            disabled={saving}
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg shadow-sm hover:bg-yellow-600 transition"
          >
            {saving ? "Saving…" : "Save Grant"}
          </button>

          <button
            onClick={analyzeGrant}
            disabled={analyzing}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-sm hover:bg-purple-700 transition"
          >
            {analyzing ? "Analyzing…" : "Run AI Fit Analysis"}
          </button>

          <button
            onClick={() => (window.location.href = `/grants/${id}/write`)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition"
          >
            Write with AI
          </button>
        </div>

        {/* Back Link */}
        <div className="mt-10">
          <a href="/search" className="text-gray-600 underline">
            ← Back to Search
          </a>
        </div>
      </div>
    </div>
  );
}
