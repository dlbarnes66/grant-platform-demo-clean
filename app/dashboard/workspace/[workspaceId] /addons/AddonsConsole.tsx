"use client";

import { useEffect, useState } from "react";
import AddonCard from "./AddonCard";
import { ADDON_CAPABILITIES } from "@/lib/addonCapabilities";

export default function AddonsConsole({ workspaceId }: { workspaceId: string }) {
  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/workspace/${workspaceId}`);
      const json = await res.json();
      setWorkspace(json.workspace);
      setLoading(false);
    }
    load();
  }, [workspaceId]);

  async function purchaseAddon(addonKey: string) {
    setSubmitting(true);

    const res = await fetch("/api/addons/purchase", {
      method: "POST",
      body: JSON.stringify({ addonKey, workspaceId })
    });

    const json = await res.json();

    if (json.checkoutUrl) {
      window.location.href = json.checkoutUrl;
      return;
    }

    setSubmitting(false);
    window.location.reload();
  }

  if (loading) return <p>Loading add‑ons...</p>;

  const activeAddons = workspace.addons || [];

  return (
    <div className="space-y-6">
      <p className="text-gray-600">
        Add‑ons let you customize your workspace with additional features.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.values(ADDON_CAPABILITIES).map((addon) => (
          <AddonCard
            key={addon.key}
            addon={addon}
            isActive={activeAddons.includes(addon.key)}
            onPurchase={() => purchaseAddon(addon.key)}
            disabled={submitting}
          />
        ))}
      </div>
    </div>
  );
}
