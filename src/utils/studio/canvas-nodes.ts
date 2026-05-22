import { type Edge, type Node } from "@xyflow/react";

import { type IconNodeData } from "@/components/studio/workspace-canvas/component/icon-node";

import { createMockWorkflowDocument } from "./workflow-dsl";
import { workflowNodeRegistry } from "./workflow-node-registry";

export const canvasWorkflowDocument = createMockWorkflowDocument();

export const canvasNodes: Node<IconNodeData, "iconNode">[] = [
  ...canvasWorkflowDocument.graph.nodes.map<Node<IconNodeData, "iconNode">>((node) => {
    const definition = workflowNodeRegistry.get(node.type);
    const visual = definition?.uiMeta ?? {
      icon: "database",
      color: "bg-slate-600",
    };

    return {
      id: node.id,
      type: "iconNode" as const,
      data: {
        icon: visual.icon,
        label: node.label,
        color: visual.color,
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
  })),
];
