"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function GrantDetailsPage() {
  const { id } = useParams();
  const [grant, setGrant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrant = async () => {
      const res = await fetch(`/api/grants/${id}`);
      const data = await res.json();
      setGrant(data);
      setLoading(false);
    };

    fetchGrant();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-muted">
        Loading grant details…
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
      <div className="max-w-4xl mx-auto">

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
          {grant.title}
        </h1>

        {/* Agency */}
        {grant.agency && (
          <p className="text-muted mt-1">{grant.agency}</p>
        )}

        {/* Metadata Card */}
        <div className="card mt-8">
          <h2 className="section-title">Grant Details</h2>

          <div className="mt-4 space-y-2 text-gray-700">
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
            <p>
              <span className="font-semibold">Eligibility:</span>{" "}
              {grant.eligibility || "N/A"}
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="card mt-8">
          <h2 className="section-title">Summary</h2>
          <p className="text-gray-700 leading-relaxed mt-2">
            {grant.summary || "No summary available."}
          </p>
        </div>

        {/* Description */}
        {grant.description && (
          <div className="card mt-8">
            <h2 className="section-title">Full Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line mt-2">
              {grant.description}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href={`/grants/${id}/write`} className="btn btn-success">
            Write Proposal with AI
          </Link>

          <Link href="/compare" className="btn btn-secondary">
            Compare Grants
          </Link>

          <Link href="/search" className="btn btn-primary">
            Back to Search
          </Link>
        </div>
      </div>
    </div>
  );
}
