"use client";

export function NotificationItem({
  notification,
  notifications,
  onUpdate
}: {
  notification: any;
  notifications: any[];
  onUpdate: (n: any[]) => void;
}) {
  function markRead() {
    onUpdate(
      notifications.map((n) =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );
  }

  const typeColor = {
    deadline: "text-yellow-400",
    ai: "text-blue-400",
    collaboration: "text-purple-400",
    system: "text-slate-400"
  };

  return (
    <li
      className={[
        "rounded-lg p-4 border border-slate-700 bg-slate-800 space-y-1",
        notification.read ? "opacity-70" : "opacity-100"
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold ${typeColor[notification.type]}`}>
          {notification.type.toUpperCase()}
        </span>

        {!notification.read && (
          <button
            onClick={markRead}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            Mark Read
          </button>
        )}
      </div>

      <div className="text-sm font-semibold text-slate-100">
        {notification.title}
      </div>

      <div className="text-sm text-slate-300">{notification.message}</div>

      <div className="text-xs text-slate-500">{notification.timestamp}</div>
    </li>
  );
}
