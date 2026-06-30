"use client";

import { useEffect, useState } from "react";
import { GrantHeader } from "@/components/grants/GrantHeader";
import { GrantMeta } from "@/components/grants/GrantMeta";
import { GrantRequirements } from "@/components/grants/GrantRequirements";
import { AIInsights } from "@/components/grants/AIInsights";
import { EligibilitySummary } from "@/components/grants/EligibilitySummary";

export default function GrantDetailPage({ params }: { params: { id: string } }) {
  const [grant, setGrant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      // Placeholder — real API integration comes later
      await new Promise((r) => setTimeout(r, 600));

      setGrant({
        id: params.id,
        title: "Youth Empowerment Grant",
        funder: "Community Impact Foundation",
        amount: 50000,
        deadline: "2026-09-15",
        category: "Community Development",
        description:
          "Supports youth leadership, empowerment, and community engagement programs.",
        requirements: [
          "501(c)(3) status",
          "Program impact summary",
          "Budget justification",
          "Letters of support"
        ],
        matchScore: 87,
        eligibility: {
          eligible: true,
          reasons: ["Strong alignment with youth programs", "Nonprofit status confirmed"],
          issues: []
        }
      });

      setLoading(false);
    }

    load();
  }, [params.id]);

  if (loading)
    return (
      <div className="text-slate-400">Loading grant details...</div>
    );

  return (
    <div className="space-y-8">
      <GrantHeader grant={grant} />
      <GrantMeta grant={grant} />
      <EligibilitySummary eligibility={grant.eligibility} />
      <GrantRequirements requirements={grant.requirements} />
      <AIInsights grant={grant} />
    </div>
  );
}
