"use client";

import { AnimatePresence } from "motion/react";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { SimulatorChatPanel } from "@/components/studio/simulator-chat-panel";
import { WorkspaceCanvas } from "@/components/studio/workspace-canvas";
import { WorkspaceHeader } from "@/components/studio/workspace-header";
import { WorkspaceInspector } from "@/components/studio/workspace-inspector";
import { useI18n } from "@/hooks";
import { studioRoutes } from "@/utils/studio";

interface StudioAgentEditorProps {
  agentId: string;
}

export function StudioAgentEditor({ agentId }: StudioAgentEditorProps) {
  const { t, lp } = useI18n();
  const router = useRouter();
  const editor = t.studio.editor;
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div
      className="relative flex min-h-0 min-w-0 flex-1 flex-col"
      data-agent-id={agentId}
    >
      <WorkspaceHeader
        onBack={() => router.push(lp(studioRoutes.workspace))}
      />
      <div className="relative flex min-h-0 flex-1">
        <WorkspaceCanvas />
        <WorkspaceInspector />

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
