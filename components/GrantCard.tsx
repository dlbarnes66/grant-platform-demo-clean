"use client";

import Link from "next/link";
import Card, { CardHeader, CardFooter } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { BookmarkIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

interface GrantCardProps {
  id: string;
  title: string;
  summary: string;
  amount?: string;
  deadline?: string;
  category?: string;
  url?: string;
  whyItMatches?: string; // ⭐ NEW FIELD
  onSave?: () => void;
  onCompare?: () => void;
  saved?: boolean;
  comparing?: boolean;
}

export default function GrantCard({
  id,
  title,
  summary,
  amount,
  deadline,
  category,
  url,
  whyItMatches,
  onSave,
  onCompare,
  saved = false,
  comparing = false,
}: GrantCardProps) {
  return (
    <Card className="hover:shadow-md transition">
      <CardHeader>
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold text-brandBlue">{title}</h2>

          {/* Category Badge */}
          {category && <Badge variant="info">{category}</Badge>}
        </div>
      </CardHeader>

      {/* Summary */}
      <p className="text-gray-700 line-clamp-3">{summary}</p>

      {/* ⭐ WHY IT MATCHES (AI SEARCH ONLY) */}
      {whyItMatches && (
        <p className="mt-3 text-sm text-purple-700 bg-purple-50 p-3 rounded-md border border-purple-200">
          <span className="font-semibold">Why it matches:</span> {whyItMatches}
        </p>
      )}

      {/* Details */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
        {amount && (
          <div>
            <span className="font-medium text-gray-800">Amount:</span> {amount}
          </div>
        )}

        {deadline && (
          <div>
            <span className="font-medium text-gray-800">Deadline:</span>{" "}
            {deadline}
          </div>
        )}
      </div>

      <CardFooter className="flex items-center justify-between mt-6">
        {/* View Button */}
        <Link
          href={`/grants/${id}`} // ⭐ FIXED: Always use your new details page
          className="text-brandBlue font-medium hover:underline"
        >
          View Grant →
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Save Button */}
          <Button
            variant={saved ? "secondary" : "outline"}
            size="sm"
            onClick={onSave}
          >
            <BookmarkIcon className="w-4 h-4 mr-1" />
            {saved ? "Saved" : "Save"}
          </Button>

          {/* Compare Button */}
          <Button
            variant={comparing ? "primary" : "outline"}
            size="sm"
            onClick={onCompare}
          >
            <Squares2X2Icon className="w-4 h-4 mr-1" />
            {comparing ? "Added" : "Compare"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
