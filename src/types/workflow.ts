export const WORKFLOW_SCHEMA_VERSION = "1.0.0" as const;

export type WorkflowSchemaVersion = typeof WORKFLOW_SCHEMA_VERSION;

export type WorkflowId = string;
export type WorkflowNodeId = string;
export type WorkflowPortId = string;
export type WorkflowEdgeId = string;

export type WorkflowNodeType = "start" | "llm_call" | "condition" | "end";
export type WorkflowEdgeType = "control" | "data";
export type WorkflowNodeIcon = "message" | "bot" | "globe" | "database" | "cpu";

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
  uiMeta: WorkflowNodeUiMeta;
}

export interface WorkflowNodeInstance<TConfig extends WorkflowNodeConfig = WorkflowNodeConfig> {
  id: WorkflowNodeId;
  type: WorkflowNodeType | string;
  label: string;
  position: WorkflowPosition;
  config: TConfig;
  ports: WorkflowPortDefinition[];
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
