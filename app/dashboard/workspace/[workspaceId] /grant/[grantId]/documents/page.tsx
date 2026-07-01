"use client";

import GrantDocuments from "./GrantDocuments";

export default function GrantDocumentsPage({
  params
}: {
  params: { workspaceId: string; grantId: string };
}) {
  const { workspaceId, grantId } = params;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Grant Document Vault</h1>
      <GrantDocuments workspaceId={workspaceId} grantId={grantId} />
    </div>
  );
}
