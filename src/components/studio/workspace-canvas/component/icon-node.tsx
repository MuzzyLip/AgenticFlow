import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { Bot, Cpu, Database, Globe, MessageSquare } from "lucide-react";
import type {
  WorkflowNodeConfig,
  WorkflowNodeIcon,
  WorkflowNodeInputBindings,
  WorkflowNodeInputDefinition,
  WorkflowNodeOutputDefinition,
} from "@/types";

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
  nodeType: string;
  icon: IconKey;
  color?: string;
  config: WorkflowNodeConfig;
  inputBindings: WorkflowNodeInputBindings;
  inputDefinitions: readonly WorkflowNodeInputDefinition[];
  outputDefinitions: readonly WorkflowNodeOutputDefinition[];
};

export type IconFlowNode = Node<IconNodeData, "iconNode">;

function dedupeAndFilter(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const normalized = value.trim();
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    result.push(normalized);
  }

  return result;
}

function resolveNodeMetaChips(data: IconNodeData): string[] {
  if (data.nodeType === "llm_call") {
    const model =
      typeof data.config.model === "string" ? data.config.model.trim() : "";
    return model ? [model] : [];
  }

  if (data.nodeType === "start") {
    return dedupeAndFilter(data.outputDefinitions.map((item) => item.label));
  }

  if (data.nodeType === "end") {
    return dedupeAndFilter(data.inputDefinitions.map((item) => item.label));
  }

  return [];
}

export function IconNode({ data, selected }: NodeProps<IconFlowNode>) {
  const Icon = ICONS[data.icon];
  const showTargetHandle = data.nodeType !== "start";
  const showSourceHandle = data.nodeType !== "end";
  const metaChips = resolveNodeMetaChips(data);

  return (
    <div
      className={`w-fit min-h-10 min-w-10 rounded-xl border bg-white px-3 py-2 pr-4 shadow-sm transition-colors ${
        selected ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-200"
      }`}
    >
      {showTargetHandle ? <Handle type="target" position={Position.Left} /> : null}
      <div className="flex items-center gap-2">
        <div className={`p-3 rounded-xl ${data.color ?? "bg-white"}`}>
          <Icon size={16} color="white" />
        </div>
        <span className="text-sm font-medium">{data.label}</span>
      </div>
      {metaChips.length > 0 ? (
        <div className="mt-2 flex max-w-64 flex-wrap items-center gap-1">
          {metaChips.map((chip) => (
            <span
              key={chip}
              className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
              title={chip}
            >
              {chip}
            </span>
          ))}
        </div>
      ) : null}
      {showSourceHandle ? <Handle type="source" position={Position.Right} /> : null}
    </div>
  );
}
