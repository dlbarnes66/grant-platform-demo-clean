"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function GrantWriterPage() {
  const { id } = useParams();
  const [grant, setGrant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [writing, setWriting] = useState(false);
  const [output, setOutput] = useState("");

  useEffect(() => {
    const fetchGrant = async () => {
      const res = await fetch(`/api/grants/${id}`);
      const data = await res.json();
      setGrant(data);
      setLoading(false);
    };

    fetchGrant();
  }, [id]);

  const generateProposal = async () =>  
  {
    setWriting(true);
    setOutput("");

    const res = await fetch("/api/grants/write", {
      method: "POST",
      body: JSON.stringify({ grantId: id }),
    });

    const data = await res.json();
    setOutput(data.output || "No content generated.");
    setWriting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-muted">
        Loading writer…
      </div>
    );
  }

  if (!grant) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-red-600">
        Grant not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900">
          AI Proposal Writer
        </h1>
        <p className="text-muted mt-2">
          Generate a polished proposal for:
        </p>

        <div className="card mt-6">
          <h2 className="text-xl font-semibold">{grant.title}</h2>
          {grant.agency && (
            <p className="text-muted mt-1">{grant.agency}</p>
          )}
        </div>

        {/* Writer Controls */}
        <div className="mt-10 flex flex-wrap gap-4">
          <button
            onClick={generateProposal}
            disabled={writing}
            className="btn btn-primary"
          >
            {writing ? "Generating…" : "Generate Proposal"}
          </button>

          <Link href={`/grants/${id}`} className="btn btn-secondary">
            Back to Grant
          </Link>
        </div>

        {/* Output */}
        <div className="card mt-10">
          <h2 className="section-title">Generated Proposal</h2>

          {writing && (
            <p className="text-muted mt-2">AI is writing your proposal…</p>
          )}

          {!writing && !output && (
            <p className="text-muted mt-2">
              No proposal generated yet. Click “Generate Proposal” to begin.
            </p>
          )}

          {output && (
            <textarea
              className="textarea mt-4 w-full h-96"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
            />
          )}
        </div>

        {/* Footer */}
        <div className="mt-10">
          <Link href="/search" className="text-muted underline">
            ← Back to Search
          </Link>
        </div>
      </div>
    </div>
  );
}
