"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Step2Location() {
  const router = useRouter();

  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const save = async () => {
    await fetch("/api/onboarding", {
      method: "POST",
      body: JSON.stringify({
        userId: "test-user-id",
        country,
        state,
        city,
      }),
    });

    router.push("/onboarding?step=3");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Location</h2>

      <input
        className="w-full border p-3 rounded"
        placeholder="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />

      <input
        className="w-full border p-3 rounded"
        placeholder="State"
        value={state}
        onChange={(e) => setState(e.target.value)}
      />

      <input
        className="w-full border p-3 rounded"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
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
