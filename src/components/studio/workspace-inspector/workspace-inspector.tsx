"use client";

import {
  Bot,
  ChevronDown,
  Code2,
  Info,
  Plus,
  Settings2,
  Sliders,
  X,
} from "lucide-react";

import { useI18n } from "@/hooks";

export function WorkspaceInspector() {
  const { t } = useI18n();
  const inspector = t.studio.editor.inspector;

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col overflow-y-auto border-l border-gray-200 bg-white">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 px-4">
        <div className="flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-bold">{inspector.title}</span>
        </div>
        <button
          type="button"
          className="rounded-md p-1 hover:bg-gray-100"
          aria-label="Close inspector"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      <div className="space-y-6 p-5">
        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
          <div className="rounded-lg bg-black p-2">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold">{inspector.nodeName}</h4>
            <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
              {inspector.nodeId}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
            {inspector.model}
            <Info className="h-3 w-3" />
          </label>
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm transition-colors hover:border-gray-400"
          >
            <span>{inspector.modelValue}</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-500 uppercase">
              {inspector.systemPrompt}
            </label>
            <button
              type="button"
              className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:underline"
            >
              <Sliders className="h-3 w-3" />
              {inspector.variableEditor}
            </button>
          </div>
          <textarea
            className="h-32 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm leading-relaxed focus:ring-1 focus:ring-black/5 focus:outline-none"
            placeholder={inspector.promptPlaceholder}
            defaultValue={inspector.promptDefault}
          />
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold text-gray-500 uppercase">
            {inspector.parameters}
          </label>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">
                {inspector.temperature}
              </span>
              <span className="text-xs font-bold text-gray-400">0.7</span>
            </div>
            <div className="relative h-1 rounded-full bg-gray-100">
              <div className="absolute inset-y-0 left-0 w-[70%] rounded-full bg-black" />
              <div className="absolute top-1/2 left-[70%] h-3 w-3 -translate-y-1/2 rounded-full border-2 border-black bg-white shadow-sm" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 py-2 text-xs font-bold text-gray-400 transition-all hover:border-gray-400 hover:text-gray-600"
            >
              <Plus className="h-3.5 w-3.5" />
              {inspector.addToolDependency}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-auto border-t border-gray-100 p-4">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 py-2.5 text-sm font-bold text-gray-900 transition-all hover:bg-gray-100"
        >
          <Code2 className="h-4 w-4" />
          {inspector.exportJson}
        </button>
      </div>
    </aside>
  );
}
