"use client";

import { ChevronLeft, History, MoreHorizontal, Play, Save, Share2 } from "lucide-react";

import { useI18n } from "@/hooks";

interface WorkspaceHeaderProps {
  onBack: () => void;
}

export function WorkspaceHeader({ onBack }: WorkspaceHeaderProps) {
  const { t } = useI18n();
  const editor = t.studio.editor;

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md p-1.5 transition-colors hover:bg-gray-100"
          aria-label="Back to workspace list"
        >
          <ChevronLeft className="h-5 w-5 text-gray-500" />
        </button>
        <div className="h-4 w-px bg-gray-200" />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{editor.agentName}</span>
            <span className="rounded border border-green-100 bg-green-50 px-1.5 py-0.5 text-[10px] font-bold text-green-600 uppercase">
              {editor.live}
            </span>
          </div>
          <span className="text-[10px] text-gray-400">{editor.editedAgo}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5">
          <button
            type="button"
            className="flex items-center gap-2 rounded-md border border-transparent px-3 py-1.5 text-xs font-semibold text-gray-600 transition-all hover:border-gray-100 hover:bg-white hover:shadow-sm"
          >
            <History className="h-3.5 w-3.5" />
            {editor.history}
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md border border-transparent px-3 py-1.5 text-xs font-semibold text-gray-600 transition-all hover:border-gray-100 hover:bg-white hover:shadow-sm"
          >
            <Share2 className="h-3.5 w-3.5" />
            {editor.collaborate}
          </button>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-1.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
        >
          <Save className="h-4 w-4" />
          {editor.saveDraft}
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-black px-5 py-1.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gray-800"
        >
          <Play className="h-4 w-4 fill-current" />
          {editor.runFlow}
        </button>

        <div className="mx-1 h-4 w-px bg-gray-200" />

        <button
          type="button"
          className="rounded-md p-1.5 transition-colors hover:bg-gray-100"
          aria-label="More options"
        >
          <MoreHorizontal className="h-5 w-5 text-gray-500" />
        </button>
      </div>
    </header>
  );
}
