import { canvasNodes, canvasEdges } from "@/utils";
import { workflowNodeRegistry } from "@/utils/studio";
import { IconNode } from "./component/icon-node";
import { NodePalette } from "./component/node-palette";
import type { WorkflowNodeIcon } from "@/types";
import {
  addEdge,
  Background,
  ConnectionLineType,
  Connection,
  Controls,
  type Node,
  type ReactFlowInstance,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { Bot, Cpu, Database, Globe, MessageSquare } from "lucide-react";
import {
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { IconNodeData } from "./component/icon-node";

const WORKFLOW_NODE_DND_MIME = "application/x-agentic-flow-node-type";
const FALLBACK_NODE_COLOR = "bg-slate-600";
const FALLBACK_NODE_ICON = "database";
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

export function WorkspaceCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(canvasNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(canvasEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<
    Node<IconNodeData, "iconNode">
  > | null>(null);
  const [pendingPlacementType, setPendingPlacementType] = useState<
    string | null
  >(null);
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((prev) =>
        addEdge(
          {
            ...connection,
            animated: false,
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

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    [],
  );

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
          previousNodes.filter((node) => node.id.startsWith(`${nodeType}_`))
            .length + 1;
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
              icon: nodeIcon,
              color: nodeColor,
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
      const droppedNodeType = event.dataTransfer.getData(
        WORKFLOW_NODE_DND_MIME,
      );
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
  const previewColor =
    pendingPlacementDefinition?.uiMeta.color ?? FALLBACK_NODE_COLOR;

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
        className="h-full w-full"
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        fitView
        panOnDrag
        zoomOnScroll
        zoomOnPinch
        onPaneMouseMove={handlePaneMouseMove}
        onPaneMouseLeave={handlePaneMouseLeave}
        onPaneClick={handlePaneClick}
        connectionLineType={ConnectionLineType.Bezier}
        defaultEdgeOptions={defaultEdgeOptions}
        elementsSelectable
        nodesDraggable
        nodesConnectable
        deleteKeyCode={null}
        style={{ backgroundColor: "#F2F3F4" }}
      >
        <NodePalette
          definitions={nodeDefinitions}
          onDragStart={handleDragStart}
          onSelectNodeType={handleSelectNodeType}
        />
        <MiniMap />
        <Controls />
        <Background gap={50} size={2} />
      </ReactFlow>
    </div>
  );
}
