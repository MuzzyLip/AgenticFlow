import { notFound } from "next/navigation";

import { StudioAgentEditor } from "@/components/studio/studio-agent-editor";
import { workspaceAgents } from "@/utils/studio";

interface StudioAgentPageProps {
  params: Promise<{ agentId: string }>;
}

export default async function StudioAgentPage({ params }: StudioAgentPageProps) {
  const { agentId } = await params;
  const hasAgent = workspaceAgents.some((agent) => agent.id === agentId);

  if (!hasAgent) {
    notFound();
  }

  return <StudioAgentEditor agentId={agentId} />;
}
