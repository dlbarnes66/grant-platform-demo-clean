"use client";

import { useState } from "react";

export default function BillingPage() {
  const [loading, setLoading] = useState(false);

  const subscribe = async () => {
    setLoading(true);

    const res = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      body: JSON.stringify({
        priceId: process.env.NEXT_PUBLIC_PRICE_BASIC,
        userId: "test-user-id",
      }),
    });

    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900">Billing</h1>
        <p className="text-gray-600 mt-2">
          Choose a plan to get started.
        </p>

        <div className="mt-10 bg-white p-6 rounded-xl shadow border border-gray-200">
          <h3 className="text-xl font-semibold">Basic Plan</h3>
          <p className="text-gray-600 mt-2">$19/month</p>

          <button
            onClick={subscribe}
            disabled={loading}
            className="mt-6 px-6 py-3 rounded-lg border border-yellow-400 text-yellow-600 bg-white hover:bg-yellow-50 transition"
          >
            {loading ? "Redirecting..." : "Subscribe"}
          </button>
        </div>
      </div>
    </div>
  );
}
