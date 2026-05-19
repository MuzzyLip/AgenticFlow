import { Bot, Cpu, Database, MessageSquare, Zap } from "lucide-react";

import type { WorkflowPath } from "@/types";

export const workflowNodeVisuals = [
  {
    id: "1",
    icon: MessageSquare,
    color: "bg-blue-500",
    x: "10%",
    y: "40%",
    labelKey: "userIntent" as const,
  },
  {
    id: "2",
    icon: Bot,
    color: "bg-black",
    x: "30%",
    y: "40%",
    labelKey: "router" as const,
  },
  {
    id: "3",
    icon: Cpu,
    color: "bg-purple-500",
    x: "53%",
    y: "20%",
    labelKey: "researchAgent" as const,
  },
  {
    id: "4",
    icon: Database,
    color: "bg-emerald-500",
    x: "55%",
    y: "60%",
    labelKey: "sqlAnalyst" as const,
  },
  {
    id: "5",
    icon: Zap,
    color: "bg-amber-500",
    x: "75%",
    y: "40%",
    labelKey: "executionEngine" as const,
  },
] as const;

export const workflowPaths: WorkflowPath[] = [
  { fromId: "1", toId: "2" },
  { fromId: "2", toId: "3" },
  { fromId: "2", toId: "4" },
  { fromId: "3", toId: "5" },
  { fromId: "4", toId: "5" },
];
