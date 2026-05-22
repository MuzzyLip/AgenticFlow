import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { Bot, Cpu, Database, Globe, MessageSquare } from "lucide-react";
import type { WorkflowNodeIcon } from "@/types";

const ICONS = {
  message: MessageSquare,
  bot: Bot,
  globe: Globe,
  database: Database,
  cpu: Cpu,
} as const satisfies Record<WorkflowNodeIcon, React.ComponentType<{ size?: number; color?: string }>>;

export type IconKey = WorkflowNodeIcon;

export type IconNodeData = {
  label: string;
  icon: IconKey;
  color?: string;
};

export type IconFlowNode = Node<IconNodeData, "iconNode">;

export function IconNode({ data, selected }: NodeProps<IconFlowNode>) {
  const Icon = ICONS[data.icon];

  return (
    <div
      className={`w-fit min-h-10 min-w-10 rounded-xl border bg-white px-3 py-2 pr-4 shadow-sm transition-colors ${
        selected ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-200"
      }`}
    >
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-2">
        <div className={`p-3 rounded-xl ${data.color ?? "bg-white"}`}>
          <Icon size={16} color="white" />
        </div>
        <span className="text-sm font-medium">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
