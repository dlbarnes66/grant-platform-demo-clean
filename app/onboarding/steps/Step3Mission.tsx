"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Step3Mission() {
  const router = useRouter();

  const [strategicGoals, setStrategicGoals] = useState("");
  const [priorityAreas, setPriorityAreas] = useState("");

  const save = async () => {
    await fetch("/api/onboarding", {
      method: "POST",
      body: JSON.stringify({
        userId: "test-user-id",
        strategicGoals,
        priorityAreas,
      }),
    });

    router.push("/onboarding?step=4");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Mission & Strategy</h2>

      <textarea
        className="w-full border p-3 rounded"
        placeholder="Strategic Goals"
        value={strategicGoals}
        onChange={(e) => setStrategicGoals(e.target.value)}
      />

      <textarea
        className="w-full border p-3 rounded"
        placeholder="Priority Areas"
        value={priorityAreas}
        onChange={(e) => setPriorityAreas(e.target.value)}
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
