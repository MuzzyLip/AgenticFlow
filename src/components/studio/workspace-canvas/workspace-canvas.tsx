import { canvasNodes, canvasEdges } from "@/utils";
import { workflowNodeRegistry } from "@/utils/studio";
import type {
  WorkflowInputBinding,
  WorkflowNodeConfig,
  WorkflowNodeIcon,
  WorkflowNodeInputBindings,
  WorkflowNodeInputDefinition,
  WorkflowNodeOutputDefinition,
  WorkflowStartInputDefinitionDraft,
  WorkflowUserInputFieldType,
} from "@/types";
import { cn } from "@/utils/cn";
import { IconNode } from "./component/icon-node";
import { NodePalette } from "./component/node-palette";
import {
  addEdge,
  Background,
  ConnectionLineType,
  Connection,
  Controls,
  SelectionMode,
  type Node,
  type ReactFlowInstance,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { Bot, Cpu, Database, Globe, MessageSquare } from "lucide-react";
import {
  forwardRef,
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import type { IconNodeData } from "./component/icon-node";

const WORKFLOW_NODE_DND_MIME = "application/x-agentic-flow-node-type";
const FALLBACK_NODE_COLOR = "bg-slate-600";
const FALLBACK_NODE_ICON = "database";
const VARIABLE_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;
const PREVIEW_ICONS = {
  message: MessageSquare,
  bot: Bot,
  globe: Globe,
  database: Database,
  cpu: Cpu,
} as const satisfies Record<
  WorkflowNodeIcon,
  React.ComponentType<{ size?: number; className?: string }>
>;

const START_INPUT_FIELD_TO_VALUE_TYPE: Record<
  WorkflowUserInputFieldType,
  WorkflowNodeInputDefinition["valueType"]
> = {
  text: "text",
  paragraph: "text",
  select: "text",
  number: "number",
  checkbox: "boolean",
  single_file: "object",
  multi_file: "array",
  json: "json",
};

function toStartOutputDefinition(
  inputDefinition: WorkflowNodeInputDefinition,
): WorkflowNodeOutputDefinition {
  return {
    id: inputDefinition.id,
    label: inputDefinition.label,
    valueType: inputDefinition.valueType,
    description: inputDefinition.description,
    schema: inputDefinition.schema,
  };
}

function toStartOutputDefinitions(
  inputDefinitions: readonly WorkflowNodeInputDefinition[],
): WorkflowNodeOutputDefinition[] {
  return inputDefinitions.map(toStartOutputDefinition);
}

function buildStartInputDefinition({
  id,
  label,
  fieldType,
  required,
  maxLength,
  min,
  max,
  step,
  options,
  acceptedFileTypes,
  maxFileSizeMb,
  maxFiles,
  defaultValue,
}: {
  id: string;
  label: string;
  fieldType: WorkflowUserInputFieldType;
  required: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  options?: WorkflowStartInputDefinitionDraft["options"];
  acceptedFileTypes?: string[];
  maxFileSizeMb?: number;
  maxFiles?: number;
  defaultValue?: unknown;
}): WorkflowNodeInputDefinition {
  const valueType = START_INPUT_FIELD_TO_VALUE_TYPE[fieldType];
  const definition: WorkflowNodeInputDefinition = {
    id,
    label,
    valueType,
    fieldType,
    required,
  };

  if (fieldType === "select") {
    return {
      ...definition,
      options: options?.map((option) => ({ ...option })) ?? [],
      defaultValue: typeof defaultValue === "string" ? defaultValue : undefined,
      schema: {
        type: "string",
        ...(typeof defaultValue === "string" && defaultValue.length > 0
          ? { default: defaultValue }
          : {}),
      },
    };
  }

  if (fieldType === "number") {
    const parsedDefault =
      typeof defaultValue === "number" ? defaultValue : Number(defaultValue);
    const nextDefault = Number.isFinite(parsedDefault) ? parsedDefault : undefined;
    return {
      ...definition,
      min,
      max,
      step,
      defaultValue: nextDefault,
      schema: {
        type: "number",
        ...(min !== undefined ? { minimum: min } : {}),
        ...(max !== undefined ? { maximum: max } : {}),
        ...(nextDefault !== undefined ? { default: nextDefault } : {}),
      },
    };
  }

  if (fieldType === "checkbox") {
    const nextDefault =
      typeof defaultValue === "boolean" ? defaultValue : undefined;
    return {
      ...definition,
      defaultValue: nextDefault,
      schema: {
        type: "boolean",
        ...(nextDefault !== undefined ? { default: nextDefault } : {}),
      },
    };
  }

  if (fieldType === "single_file") {
    return {
      ...definition,
      acceptedFileTypes: acceptedFileTypes?.length ? [...acceptedFileTypes] : undefined,
      maxFileSizeMb,
      schema: {
        type: "object",
      },
    };
  }

  if (fieldType === "multi_file") {
    return {
      ...definition,
      acceptedFileTypes: acceptedFileTypes?.length ? [...acceptedFileTypes] : undefined,
      maxFileSizeMb,
      maxFiles,
      schema: {
        type: "array",
      },
    };
  }

  if (fieldType === "json") {
    const nextDefault = typeof defaultValue === "string" ? defaultValue : undefined;
    return {
      ...definition,
      defaultValue: nextDefault,
      schema: {
        type: "object",
        ...(nextDefault && nextDefault.length > 0 ? { default: nextDefault } : {}),
      },
    };
  }

  const nextDefault = typeof defaultValue === "string" ? defaultValue : undefined;
  const nextMaxLength = typeof maxLength === "number" && maxLength > 0 ? maxLength : undefined;
  return {
    ...definition,
    maxLength: nextMaxLength,
    defaultValue: nextDefault,
    schema: {
      type: "string",
      ...(nextMaxLength ? { maxLength: nextMaxLength } : {}),
      ...(nextDefault && nextDefault.length > 0 ? { default: nextDefault } : {}),
    },
  };
}

export interface SelectedWorkflowNode {
  id: string;
  type: string;
  label: string;
  displayName: string;
  description?: string;
  icon: WorkflowNodeIcon;
  color: string;
  category: string;
  config: WorkflowNodeConfig;
  inputBindings: WorkflowNodeInputBindings;
  inputDefinitions: readonly WorkflowNodeInputDefinition[];
  outputDefinitions: readonly WorkflowNodeOutputDefinition[];
  nextNodes: readonly {
    id: string;
    label: string;
    type: string;
    icon: WorkflowNodeIcon;
    color: string;
  }[];
}

interface WorkspaceCanvasProps {
  onSelectedNodeChange?: (node: SelectedWorkflowNode | null) => void;
}

export interface WorkspaceCanvasRef {
  updateNodeConfig: (nodeId: string, patch: Partial<WorkflowNodeConfig>) => void;
  updateNodeLabel: (nodeId: string, label: string) => void;
  updateNodeInputBinding: (
    nodeId: string,
    inputId: string,
    binding: WorkflowInputBinding | null,
  ) => void;
  updateNodeInputDefinition: (
    nodeId: string,
    inputId: string,
    nextDefinition: WorkflowNodeInputDefinition,
  ) => void;
  updateNodeOutputDefinition: (
    nodeId: string,
    outputId: string,
    nextDefinition: WorkflowNodeOutputDefinition,
  ) => void;
  addNodeInputDefinition: (
    nodeId: string,
    draft?: WorkflowStartInputDefinitionDraft,
  ) => void;
  removeNodeInputDefinition: (nodeId: string, inputId: string) => void;
  inspectNode: (nodeId: string) => void;
}

type CanvasInteractionMode = "pan" | "select";

export const WorkspaceCanvas = forwardRef<WorkspaceCanvasRef, WorkspaceCanvasProps>(
  function WorkspaceCanvas({ onSelectedNodeChange }, ref) {
    const [nodes, setNodes, onNodesChange] = useNodesState(canvasNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(canvasEdges);
    const [reactFlowInstance, setReactFlowInstance] =
      useState<ReactFlowInstance<Node<IconNodeData, "iconNode">> | null>(null);
    const [pendingPlacementType, setPendingPlacementType] = useState<string | null>(
      null,
    );
    const [interactionMode, setInteractionMode] = useState<CanvasInteractionMode>("pan");
    const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(
      null,
    );
    const canvasWrapperRef = useRef<HTMLDivElement | null>(null);

    const onConnect = useCallback(
      (connection: Connection) => {
        setEdges((prev) =>
          addEdge(
            {
              ...connection,
              animated: false,
              data: {
                branch: {
                  kind: "default",
                },
              },
            },
            prev,
          ),
        );
      },
      [setEdges],
    );

    const handleDragStart = useCallback(
      (event: React.DragEvent<HTMLButtonElement>, nodeType: string) => {
        event.dataTransfer.setData(WORKFLOW_NODE_DND_MIME, nodeType);
        event.dataTransfer.effectAllowed = "move";
      },
      [],
    );

    const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    }, []);

    const appendNodeToCanvas = useCallback(
      ({
        nodeType,
        screenX,
        screenY,
      }: {
        nodeType: string;
        screenX: number;
        screenY: number;
      }) => {
        if (!reactFlowInstance) {
          return false;
        }

        const definition = workflowNodeRegistry.get(nodeType);
        if (!definition) {
          return false;
        }

        const position = reactFlowInstance.screenToFlowPosition({
          x: screenX,
          y: screenY,
        });

        setNodes((previousNodes) => {
          const sequence =
            previousNodes.filter((node) => node.id.startsWith(`${nodeType}_`)).length + 1;
          const nodeId = `${nodeType}_${Date.now()}_${sequence}`;
          const nodeInstance = workflowNodeRegistry.createNodeInstance({
            id: nodeId,
            type: nodeType,
            label: `${definition.displayName} ${sequence}`,
            position,
          });
          const nodeColor = definition.uiMeta.color ?? FALLBACK_NODE_COLOR;
          const nodeIcon = definition.uiMeta.icon ?? FALLBACK_NODE_ICON;

          return [
            ...previousNodes,
            {
              id: nodeInstance.id,
              type: "iconNode" as const,
              position: nodeInstance.position,
              data: {
                label: nodeInstance.label,
                nodeType: nodeInstance.type,
                icon: nodeIcon,
                color: nodeColor,
                config: nodeInstance.config,
                inputBindings: nodeInstance.inputBindings ?? {},
                inputDefinitions: nodeInstance.inputs ?? definition.inputs ?? [],
                outputDefinitions: nodeInstance.outputs ?? definition.outputs ?? [],
              },
            },
          ];
        });

        return true;
      },
      [reactFlowInstance, setNodes],
    );

    const handleDrop = useCallback(
      (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedNodeType = event.dataTransfer.getData(WORKFLOW_NODE_DND_MIME);
        if (!droppedNodeType) {
          return;
        }

        const created = appendNodeToCanvas({
          nodeType: droppedNodeType,
          screenX: event.clientX,
          screenY: event.clientY,
        });

        if (created) {
          setPendingPlacementType(null);
          setCursorPosition(null);
        }
      },
      [appendNodeToCanvas],
    );

    const handleSelectNodeType = useCallback((nodeType: string) => {
      setPendingPlacementType(nodeType);
    }, []);

    const handlePaneMouseMove = useCallback(
      (event: ReactMouseEvent) => {
        if (!pendingPlacementType) {
          return;
        }

        const wrapper = canvasWrapperRef.current;
        if (!wrapper) {
          return;
        }

        const rect = wrapper.getBoundingClientRect();
        setCursorPosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      },
      [pendingPlacementType],
    );

    const handlePaneClick = useCallback(
      (event: ReactMouseEvent) => {
        if (!pendingPlacementType) {
          return;
        }

        const created = appendNodeToCanvas({
          nodeType: pendingPlacementType,
          screenX: event.clientX,
          screenY: event.clientY,
        });

        if (created) {
          setPendingPlacementType(null);
          setCursorPosition(null);
        }
      },
      [appendNodeToCanvas, pendingPlacementType],
    );

    const handlePaneMouseLeave = useCallback(() => {
      if (!pendingPlacementType) {
        return;
      }
      setCursorPosition(null);
    }, [pendingPlacementType]);

    const deleteSelectedElements = useCallback(() => {
      const selectedNodeIds = new Set(
        nodes.filter((node) => node.selected).map((node) => node.id),
      );
      const hasSelectedEdges = edges.some((edge) => edge.selected);
      if (selectedNodeIds.size === 0 && !hasSelectedEdges) {
        return;
      }

      setNodes((previousNodes) =>
        previousNodes.filter((node) => !selectedNodeIds.has(node.id)),
      );
      setEdges((previousEdges) =>
        previousEdges.filter(
          (edge) =>
            !selectedNodeIds.has(edge.source) &&
            !selectedNodeIds.has(edge.target) &&
            !edge.selected,
        ),
      );
    }, [edges, nodes, setEdges, setNodes]);

    const updateNodeConfig = useCallback(
      (nodeId: string, patch: Partial<WorkflowNodeConfig>) => {
        setNodes((previousNodes) =>
          previousNodes.map((node) => {
            if (node.id !== nodeId) {
              return node;
            }

            return {
              ...node,
              data: {
                ...node.data,
                config: {
                  ...(node.data.config ?? {}),
                  ...patch,
                },
              },
            };
          }),
        );
      },
      [setNodes],
    );

    const updateNodeLabel = useCallback(
      (nodeId: string, label: string) => {
        setNodes((previousNodes) =>
          previousNodes.map((node) => {
            if (node.id !== nodeId) {
              return node;
            }

            return {
              ...node,
              data: {
                ...node.data,
                label,
              },
            };
          }),
        );
      },
      [setNodes],
    );

    const updateNodeInputBinding = useCallback(
      (nodeId: string, inputId: string, binding: WorkflowInputBinding | null) => {
        setNodes((previousNodes) =>
          previousNodes.map((node) => {
            if (node.id !== nodeId) {
              return node;
            }

            const previousBindings = node.data.inputBindings ?? {};
            const nextBindings: WorkflowNodeInputBindings = {
              ...previousBindings,
            };

            if (!binding) {
              delete nextBindings[inputId];
            } else {
              nextBindings[inputId] = binding;
            }

            return {
              ...node,
              data: {
                ...node.data,
                inputBindings: nextBindings,
              },
            };
          }),
        );
      },
      [setNodes],
    );

    const updateNodeInputDefinition = useCallback(
      (
        nodeId: string,
        inputId: string,
        nextDefinition: WorkflowNodeInputDefinition,
      ) => {
        const nextId = nextDefinition.id.trim();
        if (!VARIABLE_NAME_PATTERN.test(nextId)) {
          return;
        }

        setNodes((previousNodes) => {
          const targetNode = previousNodes.find((node) => node.id === nodeId);
          if (!targetNode) {
            return previousNodes;
          }

          const previousDefinitions = [...(targetNode.data.inputDefinitions ?? [])];
          const definitionIndex = previousDefinitions.findIndex(
            (definition) => definition.id === inputId,
          );
          if (definitionIndex < 0) {
            return previousNodes;
          }

          const hasDuplicatedId = previousDefinitions.some(
            (definition, index) => index !== definitionIndex && definition.id === nextId,
          );
          if (hasDuplicatedId) {
            return previousNodes;
          }

          previousDefinitions[definitionIndex] = {
            ...nextDefinition,
            id: nextId,
            label: nextDefinition.label.trim() || nextId,
          };

          return previousNodes.map((node) => {
            if (node.id === nodeId) {
              const previousBindings = node.data.inputBindings ?? {};
              let nextBindings: WorkflowNodeInputBindings = previousBindings;

              if (inputId !== nextId && previousBindings[inputId]) {
                nextBindings = {
                  ...previousBindings,
                  [nextId]: previousBindings[inputId],
                };
                delete nextBindings[inputId];
              }

              const isStartNode = node.data.nodeType === "start";
              return {
                ...node,
                data: {
                  ...node.data,
                  inputDefinitions: previousDefinitions,
                  outputDefinitions: isStartNode
                    ? toStartOutputDefinitions(previousDefinitions)
                    : node.data.outputDefinitions,
                  inputBindings: nextBindings,
                },
              };
            }

            if (
              targetNode.data.nodeType !== "start" ||
              inputId === nextId
            ) {
              return node;
            }

            const previousBindings = node.data.inputBindings ?? {};
            let hasBindingChange = false;
            const nextBindings: WorkflowNodeInputBindings = {};

            for (const [bindingKey, bindingValue] of Object.entries(previousBindings)) {
              if (
                bindingValue?.source === "ref" &&
                bindingValue.value.nodeId === nodeId &&
                bindingValue.value.outputId === inputId
              ) {
                hasBindingChange = true;
                nextBindings[bindingKey] = {
                  ...bindingValue,
                  value: {
                    ...bindingValue.value,
                    outputId: nextId,
                  },
                };
                continue;
              }

              nextBindings[bindingKey] = bindingValue;
            }

            if (!hasBindingChange) {
              return node;
            }

            return {
              ...node,
              data: {
                ...node.data,
                inputBindings: nextBindings,
              },
            };
          });
        });
      },
      [setNodes],
    );

    const updateNodeOutputDefinition = useCallback(
      (
        nodeId: string,
        outputId: string,
        nextDefinition: WorkflowNodeOutputDefinition,
      ) => {
        const nextId = nextDefinition.id.trim();
        if (!VARIABLE_NAME_PATTERN.test(nextId)) {
          return;
        }

        setNodes((previousNodes) => {
          const targetNode = previousNodes.find((node) => node.id === nodeId);
          if (!targetNode) {
            return previousNodes;
          }

          const targetDefinitions = [...(targetNode.data.outputDefinitions ?? [])];
          const definitionIndex = targetDefinitions.findIndex(
            (definition) => definition.id === outputId,
          );
          if (definitionIndex < 0) {
            return previousNodes;
          }

          const hasDuplicatedId = targetDefinitions.some(
            (definition, index) => index !== definitionIndex && definition.id === nextId,
          );
          if (hasDuplicatedId) {
            return previousNodes;
          }

          targetDefinitions[definitionIndex] = {
            ...nextDefinition,
            id: nextId,
            label: nextDefinition.label.trim() || nextId,
          };

          return previousNodes.map((node) => {
            if (node.id === nodeId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  outputDefinitions: targetDefinitions,
                },
              };
            }

            if (outputId === nextId) {
              return node;
            }

            const previousBindings = node.data.inputBindings ?? {};
            let hasBindingChange = false;
            const nextBindings: WorkflowNodeInputBindings = {};

            for (const [bindingKey, bindingValue] of Object.entries(previousBindings)) {
              if (
                bindingValue?.source === "ref" &&
                bindingValue.value.nodeId === nodeId &&
                bindingValue.value.outputId === outputId
              ) {
                hasBindingChange = true;
                nextBindings[bindingKey] = {
                  ...bindingValue,
                  value: {
                    ...bindingValue.value,
                    outputId: nextId,
                  },
                };
                continue;
              }

              nextBindings[bindingKey] = bindingValue;
            }

            if (!hasBindingChange) {
              return node;
            }

            return {
              ...node,
              data: {
                ...node.data,
                inputBindings: nextBindings,
              },
            };
          });
        });
      },
      [setNodes],
    );

    const addNodeInputDefinition = useCallback(
      (nodeId: string, draft?: WorkflowStartInputDefinitionDraft) => {
        setNodes((previousNodes) =>
          previousNodes.map((node) => {
            if (node.id !== nodeId || node.data.nodeType !== "start") {
              return node;
            }

            const existingDefinitions = [...(node.data.inputDefinitions ?? [])];
            const existingIds = new Set(existingDefinitions.map((item) => item.id));
            const requestedId = draft?.id?.trim() ?? "";
            const canUseRequestedId =
              requestedId.length > 0 &&
              VARIABLE_NAME_PATTERN.test(requestedId) &&
              !existingIds.has(requestedId);

            let nextId = requestedId;
            if (!canUseRequestedId) {
              let sequence = existingDefinitions.length + 1;
              nextId = `sys_input_${sequence}`;
              while (existingIds.has(nextId)) {
                sequence += 1;
                nextId = `sys_input_${sequence}`;
              }
            }

            const fieldType = draft?.fieldType ?? "text";
            const nextLabel = draft?.label?.trim() || nextId;

            const nextDefinitions: WorkflowNodeInputDefinition[] = [
              ...existingDefinitions,
              buildStartInputDefinition({
                id: nextId,
                label: nextLabel,
                fieldType,
                required: Boolean(draft?.required),
                maxLength: draft?.maxLength,
                min: draft?.min,
                max: draft?.max,
                step: draft?.step,
                options: draft?.options,
                acceptedFileTypes: draft?.acceptedFileTypes,
                maxFileSizeMb: draft?.maxFileSizeMb,
                maxFiles: draft?.maxFiles,
                defaultValue: draft?.defaultValue,
              }),
            ];

            return {
              ...node,
              data: {
                ...node.data,
                inputDefinitions: nextDefinitions,
                outputDefinitions: toStartOutputDefinitions(nextDefinitions),
              },
            };
          }),
        );
      },
      [setNodes],
    );

    const removeNodeInputDefinition = useCallback(
      (nodeId: string, inputId: string) => {
        setNodes((previousNodes) => {
          const targetNode = previousNodes.find((node) => node.id === nodeId);
          if (!targetNode || targetNode.data.nodeType !== "start") {
            return previousNodes;
          }

          const existingDefinitions = [...(targetNode.data.inputDefinitions ?? [])];

          const nextDefinitions = existingDefinitions.filter(
            (definition) => definition.id !== inputId,
          );
          if (nextDefinitions.length === existingDefinitions.length) {
            return previousNodes;
          }

          return previousNodes.map((node) => {
            if (node.id === nodeId) {
              const nextBindings = { ...(node.data.inputBindings ?? {}) };
              delete nextBindings[inputId];

              return {
                ...node,
                data: {
                  ...node.data,
                  inputDefinitions: nextDefinitions,
                  outputDefinitions: toStartOutputDefinitions(nextDefinitions),
                  inputBindings: nextBindings,
                },
              };
            }

            const previousBindings = node.data.inputBindings ?? {};
            let hasBindingChange = false;
            const nextBindings: WorkflowNodeInputBindings = {};

            for (const [bindingKey, bindingValue] of Object.entries(previousBindings)) {
              if (
                bindingValue?.source === "ref" &&
                bindingValue.value.nodeId === nodeId &&
                bindingValue.value.outputId === inputId
              ) {
                hasBindingChange = true;
                continue;
              }

              nextBindings[bindingKey] = bindingValue;
            }

            if (!hasBindingChange) {
              return node;
            }

            return {
              ...node,
              data: {
                ...node.data,
                inputBindings: nextBindings,
              },
            };
          });
        });
      },
      [setNodes],
    );

    const inspectNode = useCallback(
      (nodeId: string) => {
        setNodes((previousNodes) => {
          let found = false;
          const nextNodes = previousNodes.map((node) => {
            const isSelected = node.id === nodeId;
            if (isSelected) {
              found = true;
            }

            if (node.selected === isSelected) {
              return node;
            }

            return {
              ...node,
              selected: isSelected,
            };
          });

          if (!found) {
            return previousNodes;
          }

          return nextNodes;
        });
      },
      [setNodes],
    );

    useImperativeHandle(
      ref,
      () => ({
        updateNodeConfig,
        updateNodeLabel,
        updateNodeInputBinding,
        updateNodeInputDefinition,
        updateNodeOutputDefinition,
        addNodeInputDefinition,
        removeNodeInputDefinition,
        inspectNode,
      }),
      [
        addNodeInputDefinition,
        inspectNode,
        removeNodeInputDefinition,
        updateNodeConfig,
        updateNodeInputBinding,
        updateNodeInputDefinition,
        updateNodeLabel,
        updateNodeOutputDefinition,
      ],
    );

    useEffect(() => {
      if (!onSelectedNodeChange) {
        return;
      }

      const selectedNode = nodes.find((node) => node.selected);
      if (!selectedNode) {
        onSelectedNodeChange(null);
        return;
      }

      const nodeType = selectedNode.data.nodeType;
      const definition = workflowNodeRegistry.get(nodeType);
      const nextNodes = edges
        .filter((edge) => edge.source === selectedNode.id)
        .map((edge) => nodes.find((node) => node.id === edge.target))
        .filter((node): node is Node<IconNodeData, "iconNode"> => Boolean(node))
        .map((node) => ({
          id: node.id,
          label: node.data.label,
          type: node.data.nodeType,
          icon: node.data.icon,
          color: node.data.color ?? FALLBACK_NODE_COLOR,
        }));

      onSelectedNodeChange({
        id: selectedNode.id,
        type: nodeType,
        label: selectedNode.data.label,
        displayName: definition?.displayName ?? nodeType,
        description: definition?.description,
        icon: selectedNode.data.icon,
        color: selectedNode.data.color ?? FALLBACK_NODE_COLOR,
        category: definition?.uiMeta.category ?? "unknown",
        config: selectedNode.data.config ?? {},
        inputBindings: selectedNode.data.inputBindings ?? {},
        inputDefinitions: selectedNode.data.inputDefinitions ?? definition?.inputs ?? [],
        outputDefinitions:
          selectedNode.data.outputDefinitions ?? definition?.outputs ?? [],
        nextNodes,
      });
    }, [edges, nodes, onSelectedNodeChange]);

    useEffect(() => {
      const onKeyDown = (event: KeyboardEvent) => {
        const target = event.target as HTMLElement | null;
        const tagName = target?.tagName;
        const isFormField =
          tagName === "INPUT" ||
          tagName === "TEXTAREA" ||
          tagName === "SELECT" ||
          target?.isContentEditable;

        if (isFormField) {
          return;
        }

        if (event.key === "Escape") {
          setPendingPlacementType(null);
          setCursorPosition(null);
          return;
        }

        const normalizedKey = event.key.toLowerCase();

        if (normalizedKey === "v") {
          setInteractionMode("pan");
          return;
        }

        if (normalizedKey === "b") {
          setInteractionMode("select");
          return;
        }

        if (event.key === "Delete" || event.key === "Backspace") {
          event.preventDefault();
          deleteSelectedElements();
        }
      };

      window.addEventListener("keydown", onKeyDown);
      return () => {
        window.removeEventListener("keydown", onKeyDown);
      };
    }, [deleteSelectedElements]);

    const defaultEdgeOptions = useMemo(
      () => ({
        animated: false,
      }),
      [],
    );
    const nodeTypes = useMemo(() => ({ iconNode: IconNode }), []);
    const nodeDefinitions = useMemo(() => workflowNodeRegistry.list(), []);
    const pendingPlacementDefinition = useMemo(() => {
      if (!pendingPlacementType) {
        return null;
      }

      return workflowNodeRegistry.get(pendingPlacementType) ?? null;
    }, [pendingPlacementType]);
    const PreviewIcon = pendingPlacementDefinition
      ? PREVIEW_ICONS[pendingPlacementDefinition.uiMeta.icon]
      : null;
    const previewColor = pendingPlacementDefinition?.uiMeta.color ?? FALLBACK_NODE_COLOR;
    const isPanMode = interactionMode === "pan";
    const flowClassName = cn(
      "h-full w-full",
      pendingPlacementType
        ? "rf-node-placement"
        : isPanMode
          ? "rf-mode-pan"
          : "rf-mode-select",
    );

    return (
      <div
        ref={canvasWrapperRef}
        className="relative min-w-0 flex flex-1"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {pendingPlacementDefinition && cursorPosition && PreviewIcon ? (
          <div
            className="pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-1/2 opacity-90"
            style={{ left: cursorPosition.x, top: cursorPosition.y }}
          >
            <div className="rounded-xl border bg-white px-3 py-2 shadow-sm">
              <div className="flex items-center gap-2">
                <div className={`rounded-xl p-3 text-white ${previewColor}`}>
                  <PreviewIcon size={16} />
                </div>
                <span className="text-sm font-medium text-slate-900">
                  {pendingPlacementDefinition.displayName}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        <ReactFlow
          className={flowClassName}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          fitView
          zoomOnScroll
          zoomOnPinch
          onPaneMouseMove={handlePaneMouseMove}
          onPaneMouseLeave={handlePaneMouseLeave}
          onPaneClick={handlePaneClick}
          connectionLineType={ConnectionLineType.Bezier}
          defaultEdgeOptions={defaultEdgeOptions}
          selectionOnDrag={!isPanMode}
          selectionMode={SelectionMode.Partial}
          elementsSelectable
          nodesDraggable
          nodesConnectable
          panOnDrag={isPanMode}
          deleteKeyCode={null}
          style={{ backgroundColor: "#F2F3F4" }}
        >
          <NodePalette
            definitions={nodeDefinitions}
            onDragStart={handleDragStart}
            onSelectNodeType={handleSelectNodeType}
            interactionMode={interactionMode}
            onInteractionModeChange={setInteractionMode}
          />
          <MiniMap />
          <Controls />
          <Background gap={50} size={2} />
        </ReactFlow>
      </div>
    );
  },
);
