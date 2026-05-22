import { type Edge, type Node } from "@xyflow/react";

import { type IconNodeData } from "@/components/studio/workspace-canvas/component/icon-node";

import { createEmptyWorkflowDocument } from "./workflow-dsl";
import { workflowNodeRegistry } from "./workflow-node-registry";

export const canvasWorkflowDocument = createEmptyWorkflowDocument(
  "workflow-new",
  "Untitled Workflow",
);

export const canvasNodes: Node<IconNodeData, "iconNode">[] = [
  ...canvasWorkflowDocument.graph.nodes.map<Node<IconNodeData, "iconNode">>((node) => {
    const definition = workflowNodeRegistry.get(node.type);
    const visual = definition?.uiMeta ?? {
      icon: "database",
      color: "bg-slate-600",
    };
    const inputDefinitions = node.inputs ?? definition?.inputs ?? [];
    const outputDefinitions = node.outputs ?? definition?.outputs ?? [];

    return {
      id: node.id,
      type: "iconNode" as const,
      data: {
        nodeType: node.type,
        icon: visual.icon,
        label: node.label,
        color: visual.color,
        config: node.config,
        inputBindings: node.inputBindings ?? {},
        inputDefinitions,
        outputDefinitions,
      },
      position: node.position,
    };
  }),
];

export const canvasEdges: Edge[] = [
  ...canvasWorkflowDocument.graph.edges.map((edge) => ({
    id: edge.id,
    source: edge.source.nodeId,
    target: edge.target.nodeId,
    label: edge.branch?.label,
    data: {
      branch: edge.branch,
    },
    style:
      edge.branch?.kind === "condition"
        ? { stroke: "#0f766e", strokeWidth: 2 }
        : edge.branch?.kind === "error"
          ? { stroke: "#dc2626", strokeWidth: 2 }
          : undefined,
  })),
];
