"use client";

import AddonsConsole from "./AddonsConsole";

export default function AddonsPage({ params }: { params: { workspaceId: string } }) {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Add‑Ons</h1>
      <AddonsConsole workspaceId={params.workspaceId} />
    </div>
  );
}
