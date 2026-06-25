"use client";

import { useEffect, useState } from "react";
import GrantCard from "@/components/GrantCard";

export default function SavedGrantsPage() {
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadSaved() {
    const res = await fetch("/api/saved-grants");
    const data = await res.json();
    setGrants(data.grants || []);
    setLoading(false);
  }

  async function removeGrant(id: string) {
    await fetch("/api/saved-grants/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    setGrants((prev) => prev.filter((g) => g.id !== id));
  }

  useEffect(() => {
    loadSaved();
  }, []);

  if (loading) {
    return <div className="p-10 text-gray-600">Loading saved grants…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Saved Grants</h1>

      {grants.length === 0 ? (
        <p className="text-gray-600">You haven’t saved any grants yet.</p>
      ) : (
        <div className="grid gap-6">
          {grants.map((grant) => (
            <GrantCard
              key={grant.id}
              id={grant.id}
              title={grant.title}
              summary={grant.summary}
              amount={grant.amount}
              deadline={grant.deadline}
              category={grant.category}
              url={grant.url}
              saved={true}
              onSave={() => removeGrant(grant.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
