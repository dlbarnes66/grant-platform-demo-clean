"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Step5Funding() {
  const router = useRouter();

  const [fundingNeed, setFundingNeed] = useState("");
  const [annualBudget, setAnnualBudget] = useState("");

  const save = async () => {
    await fetch("/api/onboarding", {
      method: "POST",
      body: JSON.stringify({
        userId: "test-user-id",
        fundingNeed,
        annualBudget: Number(annualBudget),
      }),
    });

    router.push("/onboarding?step=6");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Funding Needs</h2>

      <input
        className="w-full border p-3 rounded"
        placeholder="Primary Funding Need"
        value={fundingNeed}
        onChange={(e) => setFundingNeed(e.target.value)}
      />

      <input
        className="w-full border p-3 rounded"
        placeholder="Annual Budget"
        value={annualBudget}
        onChange={(e) => setAnnualBudget(e.target.value)}
      />

      <button
        onClick={save}
        className="px-6 py-3 bg-brandBlue text-white rounded"
      >
        Next
      </button>
    </div>
  );
}
