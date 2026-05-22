import type {
  WorkflowNodeConfig,
  WorkflowNodeDefinition,
  WorkflowNodeInstance,
  WorkflowPosition,
} from "@/types";

import { BASE_WORKFLOW_NODE_DEFINITIONS } from "./workflow-node-definitions";

export type WorkflowNodeDefinitionKey = `${string}@${string}`;

export interface CreateWorkflowNodeInstanceOptions<
  TConfig extends WorkflowNodeConfig = WorkflowNodeConfig,
> {
  id: string;
  type: string;
  label: string;
  position: WorkflowPosition;
  config?: Partial<TConfig>;
}

export function buildWorkflowNodeDefinitionKey(
  type: string,
  version: string,
): WorkflowNodeDefinitionKey {
  return `${type}@${version}`;
}

export class StaticWorkflowNodeRegistry {
  private readonly byType = new Map<string, WorkflowNodeDefinition>();
  private readonly byKey = new Map<
    WorkflowNodeDefinitionKey,
    WorkflowNodeDefinition
  >();

  constructor(definitions: readonly WorkflowNodeDefinition[]) {
    for (const definition of definitions) {
      this.register(definition);
    }
  }

  register(definition: WorkflowNodeDefinition): void {
    if (this.byType.has(definition.type)) {
      throw new Error(
        `Workflow node definition already registered for type "${definition.type}".`,
      );
    }

    const key = buildWorkflowNodeDefinitionKey(
      definition.type,
      definition.version,
    );
    if (this.byKey.has(key)) {
      throw new Error(
        `Workflow node definition already registered for key "${key}".`,
      );
    }

    this.byType.set(definition.type, definition);
    this.byKey.set(key, definition);
  }

  has(type: string): boolean {
    return this.byType.has(type);
  }

  get(type: string): WorkflowNodeDefinition | undefined {
    return this.byType.get(type);
  }

  getByKey(key: WorkflowNodeDefinitionKey): WorkflowNodeDefinition | undefined {
    return this.byKey.get(key);
  }

  getOrThrow(type: string): WorkflowNodeDefinition {
    const definition = this.get(type);
    if (!definition) {
      throw new Error(`Workflow node definition not found for type "${type}".`);
    }
    return definition;
  }

  list(): WorkflowNodeDefinition[] {
    return [...this.byType.values()];
  }

  createNodeInstance<TConfig extends WorkflowNodeConfig = WorkflowNodeConfig>(
    options: CreateWorkflowNodeInstanceOptions<TConfig>,
  ): WorkflowNodeInstance<TConfig> {
    const definition = this.getOrThrow(options.type);
    return {
      id: options.id,
      type: options.type,
      label: options.label,
      position: options.position,
      config: {
        ...(definition.defaultConfig as TConfig),
        ...(options.config ?? {}),
      },
      ports: definition.ports.map((port) => ({ ...port })),
    };
  }
}

export const workflowNodeRegistry = new StaticWorkflowNodeRegistry(
  BASE_WORKFLOW_NODE_DEFINITIONS,
);
