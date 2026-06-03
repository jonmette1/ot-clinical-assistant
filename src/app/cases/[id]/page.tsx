import { CaseWorkspaceClient } from "./CaseWorkspaceClient";

const readSnapshotGenerationId = (
  value: string | string[] | undefined,
): string | null => {
  if (Array.isArray(value)) return value[0] || null;
  return value || null;
};

export default async function CaseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ snapshot?: string | string[] }>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <CaseWorkspaceClient
      params={params}
      workspaceMode="command"
      snapshotGenerationId={readSnapshotGenerationId(resolvedSearchParams?.snapshot)}
    />
  );
}
