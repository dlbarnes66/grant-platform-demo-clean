"use client";

import { useSearchParams } from "next/navigation";

export default function ProgressBar() {
  const searchParams = useSearchParams();
  const step = Number(searchParams.get("step") || 1);

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="w-full h-1 bg-white/30 mt-6">
      <div
        className="h-full bg-yellow-400 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
