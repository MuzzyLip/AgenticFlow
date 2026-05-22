export const WORKFLOW_SCHEMA_VERSION = "1.0.0" as const;

export type WorkflowSchemaVersion = typeof WORKFLOW_SCHEMA_VERSION;

export type WorkflowId = string;
export type WorkflowNodeId = string;
export type WorkflowPortId = string;
export type WorkflowEdgeId = string;

export type WorkflowNodeType = "start" | "llm_call" | "condition" | "end";
export type WorkflowEdgeType = "control" | "data";
export type WorkflowNodeIcon = "message" | "bot" | "globe" | "database" | "cpu";
export type WorkflowNodeInputSourceType = "const" | "ref" | "context";
export type WorkflowControlBranchKind = "default" | "condition" | "error";
export type WorkflowUserInputFieldType =
  | "text"
  | "paragraph"
  | "select"
  | "number"
  | "checkbox"
  | "single_file"
  | "multi_file"
  | "json";

export type WorkflowPortValueType =
  | "control"
  | "text"
  | "number"
  | "boolean"
  | "json"
  | "array"
  | "object"
  | "any";

export type WorkflowPortDirection = "input" | "output";
export type WorkflowPortCardinality = "single" | "multiple";

export interface WorkflowPosition {
  x: number;
  y: number;
}

export interface WorkflowViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface WorkflowPortDefinition {
  id: WorkflowPortId;
  label: string;
  direction: WorkflowPortDirection;
  valueType: WorkflowPortValueType;
  cardinality: WorkflowPortCardinality;
  required?: boolean;
}

export type WorkflowNodeConfig = Record<string, unknown>;

export interface JsonSchemaDefinition {
  type?: string | readonly string[];
  title?: string;
  description?: string;
  const?: unknown;
  enum?: readonly unknown[];
  default?: unknown;
  properties?: Record<string, JsonSchemaDefinition>;
  required?: readonly string[];
  items?: JsonSchemaDefinition | readonly JsonSchemaDefinition[];
  additionalProperties?: boolean | JsonSchemaDefinition;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  format?: string;
  anyOf?: readonly JsonSchemaDefinition[];
  allOf?: readonly JsonSchemaDefinition[];
  oneOf?: readonly JsonSchemaDefinition[];
  $ref?: string;
  [keyword: string]: unknown;
}

export interface WorkflowNodeInputDefinition {
  id: string;
  label: string;
  valueType: WorkflowPortValueType;
  fieldType?: WorkflowUserInputFieldType;
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  options?: WorkflowUserInputOption[];
  acceptedFileTypes?: string[];
  maxFileSizeMb?: number;
  maxFiles?: number;
  defaultValue?: unknown;
  description?: string;
  schema?: JsonSchemaDefinition;
}

export interface WorkflowStartInputDefinitionDraft {
  id?: string;
  label?: string;
  fieldType?: WorkflowUserInputFieldType;
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  options?: WorkflowUserInputOption[];
  acceptedFileTypes?: string[];
  maxFileSizeMb?: number;
  maxFiles?: number;
  defaultValue?: unknown;
}

export interface WorkflowUserInputOption {
  label: string;
  value: string;
}

export interface WorkflowNodeOutputDefinition {
  id: string;
  label: string;
  valueType: WorkflowPortValueType;
  description?: string;
  schema?: JsonSchemaDefinition;
}

export interface WorkflowRefInputValue {
  nodeId: WorkflowNodeId;
  outputId: string;
  path?: string;
}

export interface WorkflowContextInputValue {
  key: string;
  path?: string;
}

export interface WorkflowConstInputBinding {
  source: "const";
  value: unknown;
}

export interface WorkflowRefInputBinding {
  source: "ref";
  value: WorkflowRefInputValue;
}

export interface WorkflowContextInputBinding {
  source: "context";
  value: WorkflowContextInputValue;
}

export type WorkflowInputBinding =
  | WorkflowConstInputBinding
  | WorkflowRefInputBinding
  | WorkflowContextInputBinding;

export type WorkflowNodeInputBindings = Partial<
  Record<string, WorkflowInputBinding>
>;

export interface WorkflowEdgeBranchCondition {
  expression?: string;
  expected?: string | number | boolean;
}

export interface WorkflowEdgeBranch {
  kind: WorkflowControlBranchKind;
  label?: string;
  isFallback?: boolean;
  condition?: WorkflowEdgeBranchCondition;
}

export interface WorkflowNodeUiMeta {
  icon: WorkflowNodeIcon;
  color: string;
  category: string;
}

export interface WorkflowNodeDefinition<
  TType extends string = string,
  TConfig extends WorkflowNodeConfig = WorkflowNodeConfig,
> {
  type: TType;
  version: string;
  displayName: string;
  description?: string;
  configSchema: JsonSchemaDefinition;
  defaultConfig: TConfig;
  ports: readonly WorkflowPortDefinition[];
  inputs?: readonly WorkflowNodeInputDefinition[];
  outputs?: readonly WorkflowNodeOutputDefinition[];
  uiMeta: WorkflowNodeUiMeta;
}

export interface WorkflowNodeInstance<TConfig extends WorkflowNodeConfig = WorkflowNodeConfig> {
  id: WorkflowNodeId;
  type: WorkflowNodeType | string;
  label: string;
  position: WorkflowPosition;
  config: TConfig;
  ports: WorkflowPortDefinition[];
  inputs?: WorkflowNodeInputDefinition[];
  outputs?: WorkflowNodeOutputDefinition[];
  inputBindings?: WorkflowNodeInputBindings;
}

export interface WorkflowEdgeEndpoint {
  nodeId: WorkflowNodeId;
  portId: WorkflowPortId;
}

export interface WorkflowEdgeInstance {
  id: WorkflowEdgeId;
  type: WorkflowEdgeType;
  source: WorkflowEdgeEndpoint;
  target: WorkflowEdgeEndpoint;
  branch?: WorkflowEdgeBranch;
}

export interface WorkflowGraph {
  nodes: WorkflowNodeInstance[];
  edges: WorkflowEdgeInstance[];
  viewport?: WorkflowViewport;
}

export interface WorkflowDocumentMeta {
  name: string;
  description?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkflowDocument {
  schemaVersion: WorkflowSchemaVersion;
  workflowId: WorkflowId;
  meta: WorkflowDocumentMeta;
  graph: WorkflowGraph;
}
