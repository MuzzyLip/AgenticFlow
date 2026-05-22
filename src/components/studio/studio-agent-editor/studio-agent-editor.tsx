"use client";

import { AnimatePresence } from "motion/react";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

import { SimulatorChatPanel } from "@/components/studio/simulator-chat-panel";
import { WorkspaceCanvas } from "@/components/studio/workspace-canvas";
import type {
  SelectedWorkflowNode,
  WorkspaceCanvasRef,
} from "@/components/studio/workspace-canvas";
import { WorkspaceHeader } from "@/components/studio/workspace-header";
import { WorkspaceInspector } from "@/components/studio/workspace-inspector";
import { useI18n } from "@/hooks";
import type {
  WorkflowInputBinding,
  WorkflowNodeConfig,
  WorkflowNodeInputDefinition,
  WorkflowNodeOutputDefinition,
  WorkflowStartInputDefinitionDraft,
} from "@/types";
import { studioRoutes } from "@/utils/studio";

interface StudioAgentEditorProps {
  agentId: string;
}

export function StudioAgentEditor({ agentId }: StudioAgentEditorProps) {
  const { t, lp } = useI18n();
  const router = useRouter();
  const editor = t.studio.editor;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<SelectedWorkflowNode | null>(
    null,
  );
  const canvasRef = useRef<WorkspaceCanvasRef | null>(null);

  const handleNodeConfigChange = useCallback(
    (nodeId: string, patch: Partial<WorkflowNodeConfig>) => {
      canvasRef.current?.updateNodeConfig(nodeId, patch);
    },
    [],
  );

  const handleNodeLabelChange = useCallback((nodeId: string, label: string) => {
    canvasRef.current?.updateNodeLabel(nodeId, label);
  }, []);

  const handleNodeInputBindingChange = useCallback(
    (nodeId: string, inputId: string, binding: WorkflowInputBinding | null) => {
      canvasRef.current?.updateNodeInputBinding(nodeId, inputId, binding);
    },
    [],
  );

  const handleNodeInputDefinitionChange = useCallback(
    (
      nodeId: string,
      inputId: string,
      nextDefinition: WorkflowNodeInputDefinition,
    ) => {
      canvasRef.current?.updateNodeInputDefinition(nodeId, inputId, nextDefinition);
    },
    [],
  );

  const handleNodeOutputDefinitionChange = useCallback(
    (
      nodeId: string,
      outputId: string,
      nextDefinition: WorkflowNodeOutputDefinition,
    ) => {
      canvasRef.current?.updateNodeOutputDefinition(nodeId, outputId, nextDefinition);
    },
    [],
  );

  const handleNodeInputDefinitionAdd = useCallback(
    (nodeId: string, draft?: WorkflowStartInputDefinitionDraft) => {
      canvasRef.current?.addNodeInputDefinition(nodeId, draft);
    },
    [],
  );

  const handleNodeInputDefinitionRemove = useCallback(
    (nodeId: string, inputId: string) => {
      canvasRef.current?.removeNodeInputDefinition(nodeId, inputId);
    },
    [],
  );

  const handleInspectNode = useCallback((nodeId: string) => {
    canvasRef.current?.inspectNode(nodeId);
  }, []);

  return (
    <div
      className="relative flex min-h-0 min-w-0 flex-1 flex-col"
      data-agent-id={agentId}
    >
      <WorkspaceHeader onBack={() => router.push(lp(studioRoutes.workspace))} />
      <div className="relative flex min-h-0 flex-1">
        <WorkspaceCanvas
          ref={canvasRef}
          onSelectedNodeChange={setSelectedNode}
        />
        <WorkspaceInspector
          selectedNode={selectedNode}
          onInspectNode={handleInspectNode}
          onNodeConfigChange={handleNodeConfigChange}
          onNodeLabelChange={handleNodeLabelChange}
          onNodeInputBindingChange={handleNodeInputBindingChange}
          onNodeInputDefinitionChange={handleNodeInputDefinitionChange}
          onNodeOutputDefinitionChange={handleNodeOutputDefinitionChange}
          onNodeInputDefinitionAdd={handleNodeInputDefinitionAdd}
          onNodeInputDefinitionRemove={handleNodeInputDefinitionRemove}
        />

        <div className="absolute right-80 bottom-6 z-20 mr-6">
          <button
            type="button"
            onClick={() => setIsChatOpen(true)}
            className="group flex items-center gap-2 rounded-full bg-black px-6 py-3 text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-sm font-bold tracking-tight">
              {editor.testSwarm}
            </span>
            <div className="ml-1 h-2 w-2 animate-pulse rounded-full bg-green-500 shadow-sm shadow-green-500" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isChatOpen && (
          <SimulatorChatPanel onClose={() => setIsChatOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
