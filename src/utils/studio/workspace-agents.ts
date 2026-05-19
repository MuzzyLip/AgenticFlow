import type { WorkspaceAgent } from "@/types/studio";

export const workspaceAgents: WorkspaceAgent[] = [
  {
    id: "1",
    name: "Customer Support Swarm",
    desc: "Main support routing and information retrieval swarm.",
    status: "live",
    updated: "2m ago",
    apps: 3,
    executions: "1.2k",
    type: "swarm",
  },
  {
    id: "2",
    name: "GitHub Review Bot",
    desc: "Analyzes pull requests for architectural patterns and errors.",
    status: "paused",
    updated: "15h ago",
    apps: 1,
    executions: "456",
    type: "agent",
  },
  {
    id: "3",
    name: "Market Intelligence",
    desc: "Daily scraping and synthesis of industry news.",
    status: "live",
    updated: "1d ago",
    apps: 0,
    executions: "89",
    type: "workflow",
  },
  {
    id: "4",
    name: "SQL Query Assistant",
    desc: "Internal tool for generating BI reports from text.",
    status: "live",
    updated: "3d ago",
    apps: 5,
    executions: "2.5k",
    type: "agent",
  },
];
