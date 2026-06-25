"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Step1Basics() {
  const router = useRouter();

  const [organizationName, setOrganizationName] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [mission, setMission] = useState("");

  const save = async () => {
    await fetch("/api/onboarding", {
      method: "POST",
      body: JSON.stringify({
        userId: "test-user-id",
        organizationName,
        organizationType,
        mission,
      }),
    });

    router.push("/onboarding?step=2");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Organization Basics</h2>

      <input
        className="w-full border p-3 rounded"
        placeholder="Organization Name"
        value={organizationName}
        onChange={(e) => setOrganizationName(e.target.value)}
      />

      <select
        className="w-full border p-3 rounded"
        value={organizationType}
        onChange={(e) => setOrganizationType(e.target.value)}
      >
        <option value="">Select Type</option>
        <option value="nonprofit">Nonprofit</option>
        <option value="school">School</option>
        <option value="business">Small Business</option>
        <option value="government">Government Agency</option>
      </select>

      <textarea
        className="w-full border p-3 rounded"
        placeholder="Mission Statement"
        value={mission}
        onChange={(e) => setMission(e.target.value)}
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
