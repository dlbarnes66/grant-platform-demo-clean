"use client";

import ProgressBar from "./ProgressBar";

export default function GradientHeader() {
  return (
    <header
      className="w-full py-10 px-6 text-white"
      style={{
        background: "linear-gradient(90deg, #0A1A3F, #1E3A8A, #FBBF24)"
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold">Let’s set up your organization</h1>
        <p className="text-white/90 mt-2">
          We’ll personalize your grant recommendations
        </p>
      </div>

      <ProgressBar />
    </header>
  );
}
