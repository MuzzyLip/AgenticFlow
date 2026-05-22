import type { WorkflowNodeDefinition, WorkflowPortDefinition } from "@/types";

const START_PORTS = [
  {
    id: "out",
    label: "Out",
    direction: "output",
    valueType: "control",
    cardinality: "multiple",
    required: true,
  },
] as const satisfies readonly WorkflowPortDefinition[];

const LLM_CALL_PORTS = [
  {
    id: "in",
    label: "In",
    direction: "input",
    valueType: "control",
    cardinality: "single",
    required: true,
  },
  {
    id: "out",
    label: "Out",
    direction: "output",
    valueType: "control",
    cardinality: "multiple",
    required: true,
  },
] as const satisfies readonly WorkflowPortDefinition[];

const CONDITION_PORTS = [
  {
    id: "in",
    label: "In",
    direction: "input",
    valueType: "control",
    cardinality: "single",
    required: true,
  },
  {
    id: "true",
    label: "True",
    direction: "output",
    valueType: "control",
    cardinality: "single",
    required: true,
  },
  {
    id: "false",
    label: "False",
    direction: "output",
    valueType: "control",
    cardinality: "single",
    required: true,
  },
] as const satisfies readonly WorkflowPortDefinition[];

const END_PORTS = [
  {
    id: "in",
    label: "In",
    direction: "input",
    valueType: "control",
    cardinality: "multiple",
    required: true,
  },
] as const satisfies readonly WorkflowPortDefinition[];

export const BASE_WORKFLOW_NODE_DEFINITIONS = [
  {
    type: "start",
    version: "1.0.0",
    displayName: "Start",
    description: "Entry point of workflow execution.",
    configSchema: {
      type: "object",
      additionalProperties: false,
      properties: {},
      required: [],
    },
    defaultConfig: {},
    ports: START_PORTS,
    uiMeta: {
      icon: "message",
      color: "bg-blue-500",
      category: "trigger",
    },
  },
  {
    type: "llm_call",
    version: "1.0.0",
    displayName: "LLM Call",
    description: "Invoke language model to produce response.",
    configSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        model: {
          type: "string",
          minLength: 1,
        },
      },
      required: ["model"],
    },
    defaultConfig: {
      model: "gpt-4.1-mini",
    },
    ports: LLM_CALL_PORTS,
    uiMeta: {
      icon: "bot",
      color: "bg-black",
      category: "model",
    },
  },
  {
    type: "condition",
    version: "1.0.0",
    displayName: "Condition",
    description: "Route execution according to expression result.",
    configSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expression: {
          type: "string",
          minLength: 1,
        },
      },
      required: ["expression"],
    },
    defaultConfig: {
      expression: "",
    },
    ports: CONDITION_PORTS,
    uiMeta: {
      icon: "globe",
      color: "bg-emerald-500",
      category: "logic",
    },
  },
  {
    type: "end",
    version: "1.0.0",
    displayName: "End",
    description: "Terminal node of workflow execution.",
    configSchema: {
      type: "object",
      additionalProperties: false,
      properties: {},
      required: [],
    },
    defaultConfig: {},
    ports: END_PORTS,
    uiMeta: {
      icon: "cpu",
      color: "bg-indigo-500",
      category: "terminator",
    },
  },
] as const satisfies readonly WorkflowNodeDefinition[];
