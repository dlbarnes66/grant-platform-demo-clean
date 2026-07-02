"use client";

import { useEffect, useState } from "react";

export default function BillingConsole({ workspaceId }: { workspaceId: string }) {
  const [loading, setLoading] = useState(true);
  const [workspace, setWorkspace] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/workspace/${workspaceId}`);
      const json = await res.json();
      setWorkspace(json.workspace);
      setLoading(false);
    }
    load();
  }, [workspaceId]);

  async function subscribe(plan: string) {
    setSubmitting(true);

    const res = await fetch("/api/billing", {
      method: "POST",
      body: JSON.stringify({ plan, workspaceId })
    });

    const json = await res.json();

    if (json.checkoutUrl) {
      window.location.href = json.checkoutUrl;
      return;
    }

    setSubmitting(false);
    window.location.reload();
  }

  if (loading) return <p>Loading billing...</p>;

  if (workspace.isLocked) {
    return (
      <div className="p-6 border rounded-md bg-red-50">
        <h2 className="text-xl font-bold text-red-700">Trial Expired</h2>
        <p className="text-red-600">
          Your trial has ended. Subscribe now to regain access.
        </p>
        <button
          onClick={() => subscribe("basic")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Subscribe Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Choose a Plan</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PlanCard
          title="Basic"
          price="$29/mo"
          description="Single user. Core features."
          onSelect={() => subscribe("basic")}
          disabled={submitting}
        />

        <PlanCard
          title="Pro"
          price="$50/mo"
          description="Up to 5 users. Team features."
          onSelect={() => subscribe("pro")}
          disabled={submitting}
        />

        <PlanCard
          title="Advanced"
          price="$99/mo"
          description="Up to 10 users. AI automation. Scoring engine."
          onSelect={() => subscribe("advanced")}
          disabled={submitting}
        />

        <PlanCard
          title="Enterprise"
          price="Custom"
          description="Unlimited users. Custom workflows."
          onSelect={() => subscribe("enterprise")}
          disabled={submitting}
        />
      </div>
    </div>
  );
}

function PlanCard({
  title,
  price,
  description,
  onSelect,
  disabled
}: {
  title: string;
  price: string;
  description: string;
  onSelect: () => void;
  disabled: boolean;
}) {
  return (
    <div className="p-6 border rounded-md bg-white shadow-sm space-y-3">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-gray-600">{price}</p>
      <p className="text-gray-500">{description}</p>
      <button
        onClick={onSelect}
        disabled={disabled}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Select Plan
      </button>
    </div>
  );
}
