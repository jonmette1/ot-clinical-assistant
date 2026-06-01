import { CaseWorkspaceClient } from "./CaseWorkspaceClient";

export default function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <CaseWorkspaceClient params={params} workspaceMode="command" />;
}
