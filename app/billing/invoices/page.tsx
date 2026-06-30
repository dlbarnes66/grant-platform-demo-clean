"use client";

import { useEffect, useState } from "react";
import { InvoiceList } from "@/components/billing/InvoiceList";
import { InvoiceDrawer } from "@/components/billing/InvoiceDrawer";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const res = await fetch("/api/billing/invoices");
      const data = await res.json();

      setInvoices(data.invoices);
      setLoading(false);
    }

    load();
  }, []);

  if (loading)
    return <div className="text-slate-400">Loading invoices...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-slate-100">
        Invoices & Receipts
      </h1>

      <InvoiceList invoices={invoices} onSelect={setSelected} />

      {selected && (
        <InvoiceDrawer invoice={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
