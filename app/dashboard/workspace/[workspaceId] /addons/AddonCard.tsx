"use client";

export default function AddonCard({
  addon,
  isActive,
  onPurchase,
  disabled
}: {
  addon: { key: string; name: string; description: string };
  isActive: boolean;
  onPurchase: () => void;
  disabled: boolean;
}) {
  return (
    <div className="p-6 border rounded-md bg-white shadow-sm space-y-3">
      <h3 className="text-lg font-bold">{addon.name}</h3>
      <p className="text-gray-600">{addon.description}</p>

      {isActive ? (
        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm">
          Active
        </span>
      ) : (
        <button
          onClick={onPurchase}
          disabled={disabled}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Purchase Add‑On
        </button>
      )}
    </div>
  );
}
