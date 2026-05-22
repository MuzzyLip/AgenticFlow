import {
  WORKFLOW_SCHEMA_VERSION,
  type WorkflowDocument,
  type WorkflowEdgeInstance,
} from "@/types";
import workflowDocumentDslSchemaJson from "../../../schemas/workflow/workflow-document-1.0.0.schema.json";
import { workflowNodeRegistry } from "./workflow-node-registry";

export type WorkflowDocumentDslSchema = typeof workflowDocumentDslSchemaJson;
export const workflowDocumentDslSchema: WorkflowDocumentDslSchema =
  workflowDocumentDslSchemaJson;

export function createEmptyWorkflowDocument(
  workflowId: string,
  name: string,
): WorkflowDocument {
  return {
    schemaVersion: WORKFLOW_SCHEMA_VERSION,
    workflowId,
    meta: {
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    graph: {
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  };
}

export function createMockWorkflowDocument(): WorkflowDocument {
  const nodes = [
    workflowNodeRegistry.createNodeInstance({
      id: "node_start",
      type: "start",
      label: "On Chat Message",
      position: { x: 80, y: 150 },
    }),
    workflowNodeRegistry.createNodeInstance({
      id: "node_llm",
      type: "llm_call",
      label: "Router Agent",
      position: { x: 300, y: 150 },
      config: { model: "gpt-4.1-mini" },
      inputBindings: {
        user_message: {
          source: "const",
          value: "Hello from mock data",
        },
      },
    }),
    workflowNodeRegistry.createNodeInstance({
      id: "node_condition",
      type: "condition",
      label: "Need External Search?",
      position: { x: 500, y: 150 },
      config: { expression: "intent in ['faq', 'realtime']" },
      inputBindings: {
        subject: {
          source: "ref",
          value: {
            nodeId: "node_llm",
            outputId: "response_text",
          },
        },
      },
    }),
    workflowNodeRegistry.createNodeInstance({
      id: "node_end_search",
      type: "end",
      label: "Search Branch",
      position: { x: 800, y: 100 },
      inputBindings: {
        result: {
          source: "ref",
          value: {
            nodeId: "node_llm",
            outputId: "response_text",
          },
        },
      },
    }),
    workflowNodeRegistry.createNodeInstance({
      id: "node_end_reply",
      type: "end",
      label: "Reply Directly",
      position: { x: 800, y: 200 },
      inputBindings: {
        result: {
          source: "ref",
          value: {
            nodeId: "node_llm",
            outputId: "response_text",
          },
        },
      },
    }),
  ];

  const edges: WorkflowEdgeInstance[] = [
    {
      id: "edge_start_llm",
      type: "control",
      source: { nodeId: "node_start", portId: "out" },
      target: { nodeId: "node_llm", portId: "in" },
      branch: {
        kind: "default",
      },
    },
    {
      id: "edge_llm_condition",
      type: "control",
      source: { nodeId: "node_llm", portId: "out" },
      target: { nodeId: "node_condition", portId: "in" },
      branch: {
        kind: "default",
      },
    },
    {
      id: "edge_condition_true",
      type: "control",
      source: { nodeId: "node_condition", portId: "true" },
      target: { nodeId: "node_end_search", portId: "in" },
      branch: {
        kind: "condition",
        label: "Matched",
        condition: {
          expression: "conditionResult === true",
          expected: true,
        },
      },
    },
    {
      id: "edge_condition_false",
      type: "control",
      source: { nodeId: "node_condition", portId: "false" },
      target: { nodeId: "node_end_reply", portId: "in" },
      branch: {
        kind: "default",
        label: "Fallback",
        isFallback: true,
      },
    },
  ];

  return {
    schemaVersion: WORKFLOW_SCHEMA_VERSION,
    workflowId: "workflow-demo",
    meta: {
      name: "Support Routing Workflow",
      description: "Demo workflow document for React Flow integration.",
      tags: ["demo", "routing"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    graph: {
      nodes,
      edges,
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  };
}
