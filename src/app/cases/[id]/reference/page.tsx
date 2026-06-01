import { CaseWorkspaceClient } from "../CaseWorkspaceClient";

export default function CaseReferenceWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <CaseWorkspaceClient params={params} workspaceMode="reference" />;
}
