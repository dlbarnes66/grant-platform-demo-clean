"use client";

import { useEffect, useState } from "react";
import { NotificationFilters } from "@/components/notifications/NotificationFilters";
import { NotificationList } from "@/components/notifications/NotificationList";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      // Placeholder — real backend integration comes later
      await new Promise((r) => setTimeout(r, 600));

      setNotifications([
        {
          id: "1",
          type: "deadline",
          title: "Grant Deadline Approaching",
          message: "Youth Empowerment Grant deadline is in 5 days.",
          timestamp: "2026-06-30 10:15",
          read: false
        },
        {
          id: "2",
          type: "ai",
          title: "AI Insight Available",
          message: "New risk analysis insights are ready.",
          timestamp: "2026-06-30 10:20",
          read: false
        },
        {
          id: "3",
          type: "collaboration",
          title: "Mention from Alex",
          message: "Alex mentioned you in the narrative section.",
          timestamp: "2026-06-30 10:25",
          read: true
        },
        {
          id: "4",
          type: "system",
          title: "System Update",
          message: "Your workspace has been synced.",
          timestamp: "2026-06-30 10:30",
          read: true
        }
      ]);

      setLoading(false);
    }

    load();
  }, []);

  if (loading)
    return <div className="text-slate-400">Loading notifications...</div>;

  const filtered =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-slate-100">
        Notifications
      </h1>

      <NotificationFilters filter={filter} onChange={setFilter} />

      <NotificationList
        notifications={filtered}
        onUpdate={setNotifications}
      />
    </div>
  );
}
