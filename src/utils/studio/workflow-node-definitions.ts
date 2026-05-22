import type {
  WorkflowNodeDefinition,
  WorkflowNodeInputDefinition,
  WorkflowNodeOutputDefinition,
  WorkflowPortDefinition,
} from "@/types";

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

function deriveStartOutputsFromInputs(
  inputs: readonly WorkflowNodeInputDefinition[],
): readonly WorkflowNodeOutputDefinition[] {
  return inputs.map((input) => ({
    id: input.id,
    label: input.label,
    valueType: input.valueType,
    description: input.description,
    schema: input.schema,
  }));
}

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

const START_INPUTS = [] as const satisfies readonly WorkflowNodeInputDefinition[];

const START_OUTPUTS = deriveStartOutputsFromInputs(START_INPUTS);

const LLM_CALL_INPUTS = [
  {
    id: "user_message",
    label: "User Message",
    valueType: "text",
    required: true,
    description: "Message content passed into the LLM prompt.",
  },
  {
    id: "system_prompt",
    label: "System Prompt",
    valueType: "text",
    required: false,
    description: "Optional runtime system prompt override.",
  },
] as const satisfies readonly WorkflowNodeInputDefinition[];

const LLM_CALL_OUTPUTS = [
  {
    id: "response_text",
    label: "Response Text",
    valueType: "text",
    description: "Model response text.",
  },
] as const satisfies readonly WorkflowNodeOutputDefinition[];

const CONDITION_INPUTS = [
  {
    id: "subject",
    label: "Subject",
    valueType: "any",
    required: true,
    description: "Input value used in expression evaluation.",
  },
] as const satisfies readonly WorkflowNodeInputDefinition[];

const CONDITION_OUTPUTS = [
  {
    id: "matched",
    label: "Matched",
    valueType: "boolean",
    description: "Expression evaluation result.",
  },
] as const satisfies readonly WorkflowNodeOutputDefinition[];

const END_INPUTS = [
  {
    id: "result",
    label: "Result",
    valueType: "any",
    required: false,
    description: "Optional final payload for terminal node.",
  },
] as const satisfies readonly WorkflowNodeInputDefinition[];

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
    inputs: START_INPUTS,
    outputs: START_OUTPUTS,
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
    inputs: LLM_CALL_INPUTS,
    outputs: LLM_CALL_OUTPUTS,
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
    inputs: CONDITION_INPUTS,
    outputs: CONDITION_OUTPUTS,
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
    inputs: END_INPUTS,
    uiMeta: {
      icon: "cpu",
      color: "bg-indigo-500",
      category: "terminator",
    },
  },
] as const satisfies readonly WorkflowNodeDefinition[];
