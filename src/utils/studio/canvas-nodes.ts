import { Bot, Cpu, Database, Globe, MessageSquare } from "lucide-react";

import type { CanvasNode } from "@/types/studio";

export const canvasNodes: CanvasNode[] = [
  {
    id: "1",
    type: "trigger",
    icon: MessageSquare,
    label: "On Chat Message",
    color: "bg-blue-500",
    x: 80,
    y: 150,
  },
  {
    id: "2",
    type: "agent",
    icon: Bot,
    label: "Router Agent",
    color: "bg-black",
    x: 300,
    y: 150,
  },
  {
    id: "3",
    type: "tool",
    icon: Globe,
    label: "Search Plugin",
    color: "bg-emerald-500",
    x: 520,
    y: 60,
  },
  {
    id: "4",
    type: "tool",
    icon: Database,
    label: "CRM Knowledge",
    color: "bg-purple-500",
    x: 520,
    y: 240,
  },
  {
    id: "5",
    type: "agent",
    icon: Cpu,
    label: "Support Agent",
    color: "bg-indigo-500",
    x: 740,
    y: 150,
  },
];
