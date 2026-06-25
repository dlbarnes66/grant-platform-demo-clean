import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-brandLight">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 space-y-8 shadow-sm">
        <h2 className="text-2xl font-bold text-brandBlue">Dashboard</h2>

        <nav className="space-y-4">
          <Link
            href="/dashboard"
            className="block text-gray-700 hover:text-brandBlue font-medium"
          >
            Home
          </Link>

          <Link
            href="/dashboard/search"
            className="block text-gray-700 hover:text-brandBlue font-medium"
          >
            Search Grants
          </Link>

          <Link
            href="/dashboard/search-history"
            className="block text-gray-700 hover:text-brandBlue font-medium"
          >
            Search History
          </Link>

          <Link
            href="/dashboard/saved-searches"
            className="block text-gray-700 hover:text-brandBlue font-medium"
          >
            Saved Searches
          </Link>

          <Link
            href="/dashboard/saved-grants"
            className="block text-gray-700 hover:text-brandBlue font-medium"
          >
            Saved Grants
          </Link>

          <Link
            href="/dashboard/compare"
            className="block text-gray-700 hover:text-brandBlue font-medium"
          >
            Compare Grants
          </Link>

          <Link
            href="/dashboard/jobs"
            className="block text-gray-700 hover:text-brandBlue font-medium"
          >
            Jobs
          </Link>

          {/* ⭐ Billing Link */}
          <Link
            href="/billing"
            className="block text-gray-700 hover:text-brandBlue font-medium"
          >
            Billing
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
