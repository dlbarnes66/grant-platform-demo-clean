"use client";

import { useState } from "react";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { OrgSettings } from "@/components/settings/OrgSettings";
import { NotificationPreferences } from "@/components/settings/NotificationPreferences";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { APIKeysPanel } from "@/components/settings/APIKeysPanel";
import { ThemePreferences } from "@/components/settings/ThemePreferences";

export default function SettingsPage() {
  const [active, setActive] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "organization", label: "Organization" },
    { id: "notifications", label: "Notifications" },
    { id: "security", label: "Security" },
    { id: "api", label: "API Keys" },
    { id: "theme", label: "Theme" }
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-slate-100">
        Settings & Preferences
      </h1>

      <div className="flex gap-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={[
              "px-3 py-2 rounded-md text-sm transition",
              active === t.id
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active === "profile" && <ProfileSettings />}
      {active === "organization" && <OrgSettings />}
      {active === "notifications" && <NotificationPreferences />}
      {active === "security" && <SecuritySettings />}
      {active === "api" && <APIKeysPanel />}
      {active === "theme" && <ThemePreferences />}
    </div>
  );
}
