"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Step4Capacity() {
  const router = useRouter();

  const [staffSize, setStaffSize] = useState("");
  const [grantExperience, setGrantExperience] = useState("");

  const save = async () => {
    await fetch("/api/onboarding", {
      method: "POST",
      body: JSON.stringify({
        userId: "test-user-id",
        staffSize: Number(staffSize),
        grantExperience,
      }),
    });

    router.push("/onboarding?step=5");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Capacity & Readiness</h2>

      <input
        className="w-full border p-3 rounded"
        placeholder="Staff Size"
        value={staffSize}
        onChange={(e) => setStaffSize(e.target.value)}
      />

      <textarea
        className="w-full border p-3 rounded"
        placeholder="Grant Experience"
        value={grantExperience}
        onChange={(e) => setGrantExperience(e.target.value)}
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
