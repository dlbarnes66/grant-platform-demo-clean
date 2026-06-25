"use client";

import { useEffect, useState } from "react";

export default function ComparePage() {
  const [savedGrants, setSavedGrants] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [comparison, setComparison] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);

  // Load saved grants
  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/saved-grants");
      const data = await res.json();
      setSavedGrants(data.grants || []);
      setLoading(false);
    };

    load();
  }, []);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const runComparison = async () => {
    if (selected.length < 2) {
      alert("Select at least two grants to compare.");
      return;
    }

    setComparing(true);

    const res = await fetch("/api/grant-comparisons", {
      method: "POST",
      body: JSON.stringify({ grantIds: selected }),
    });

    const data = await res.json();

    const comparisonRes = await fetch(
      `/api/grant-comparisons/${data.comparison.id}`
    );
    const comparisonData = await comparisonRes.json();

    setComparison(comparisonData.grants || []);
    setComparing(false);
  };

  if (loading) {
    return <div className="p-10 text-gray-600">Loading saved grants…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto bg-white p-10 rounded-xl shadow-sm border">
        <h1 className="text-3xl font-bold text-gray-900">Compare Grants</h1>
        <p className="text-gray-600 mt-2">
          Select multiple grants to compare them side-by-side.
        </p>

        {/* Saved Grants List */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900">
            Your Saved Grants
          </h2>

          {savedGrants.length === 0 && (
            <p className="text-gray-500 mt-4">You have no saved grants.</p>
          )}

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedGrants.map((g) => (
              <div
                key={g.id}
                className={`p-5 border rounded-xl shadow-sm bg-gray-50 hover:bg-gray-100 transition cursor-pointer ${
                  selected.includes(g.id) ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => toggleSelect(g.id)}
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {g.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{g.agency}</p>
                <p className="text-sm text-gray-700 mt-2">
                  <span className="font-semibold">Amount:</span>{" "}
                  {g.amount || "N/A"}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Deadline:</span>{" "}
                  {g.deadline || "N/A"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Compare Button */}
        <div className="mt-8">
          <button
            onClick={runComparison}
            disabled={comparing}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition"
          >
            {comparing ? "Comparing…" : "Compare Selected Grants"}
          </button>
        </div>

        {/* Comparison Table */}
        {comparison.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">
              Comparison Results
            </h2>

            <div className="overflow-x-auto mt-6">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-gray-800 text-left">
                    <th className="p-4 border">Field</th>
                    {comparison.map((g) => (
                      <th key={g.id} className="p-4 border">
                        {g.title}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="text-gray-800">
                  <tr>
                    <td className="p-4 border font-semibold">Agency</td>
                    {comparison.map((g) => (
                      <td key={g.id} className="p-4 border">
                        {g.agency}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 border font-semibold">Amount</td>
                    {comparison.map((g) => (
                      <td key={g.id} className="p-4 border">
                        {g.amount}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 border font-semibold">Deadline</td>
                    {comparison.map((g) => (
                      <td key={g.id} className="p-4 border">
                        {g.deadline}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 border font-semibold">Category</td>
                    {comparison.map((g) => (
                      <td key={g.id} className="p-4 border">
                        {g.category}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 border font-semibold">Summary</td>
                    {comparison.map((g) => (
                      <td key={g.id} className="p-4 border whitespace-pre-line">
                        {g.summary}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

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
