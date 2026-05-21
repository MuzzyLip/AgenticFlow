"use client";

import { motion } from "motion/react";
import { MousePointer2, Plus } from "lucide-react";

import { useI18n } from "@/hooks";
import { canvasNodes } from "@/utils/studio";

export function WorkspaceCanvas() {
  const { t } = useI18n();
  const inspector = t.studio.editor.inspector;

  return (
    <div className="relative flex-1 overflow-hidden bg-gray-50 select-none">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />

      <svg className="pointer-events-none absolute inset-0 h-full w-full">
        <defs>
          <marker
            id="studio-arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#E5E7EB" />
          </marker>
        </defs>
        <path
          d="M 136 178 L 300 178"
          stroke="#E5E7EB"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#studio-arrowhead)"
        />
        <path
          d="M 356 160 C 400 160, 420 88, 520 88"
          stroke="#E5E7EB"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#studio-arrowhead)"
        />
        <path
          d="M 356 195 C 400 195, 420 268, 520 268"
          stroke="#E5E7EB"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#studio-arrowhead)"
        />
        <path
          d="M 576 88 C 650 88, 680 160, 740 160"
          stroke="#E5E7EB"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#studio-arrowhead)"
        />
        <path
          d="M 576 268 C 650 268, 680 195, 740 195"
          stroke="#E5E7EB"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#studio-arrowhead)"
        />
      </svg>

      {canvasNodes.map((node) => (
        <motion.div
          key={node.id}
          drag
          dragMomentum={false}
          style={{ left: node.x, top: node.y }}
          className="group absolute cursor-grab active:cursor-grabbing"
        >
          <div className="w-48 overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-sm transition-all group-hover:border-black/20 group-hover:shadow-md">
            <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
              <div className="flex items-center gap-2">
                <div className={`rounded-md p-1 ${node.color}`}>
                  <node.icon className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-[10px] font-bold tracking-tight text-gray-400 uppercase">
                  {node.type}
                </span>
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />
            </div>
            <div className="p-3">
              <h4 className="mb-1 text-xs font-bold text-gray-900">{node.label}</h4>
              <p className="line-clamp-1 text-[10px] text-gray-500">
                {inspector.nodeDescription}
              </p>
            </div>
            <div className="absolute top-1/2 -left-1.5 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-gray-200 bg-white transition-colors group-hover:border-gray-400" />
            <div className="absolute top-1/2 -right-1.5 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-gray-200 bg-white transition-colors group-hover:border-gray-400" />
          </div>
        </motion.div>
      ))}

      <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
        <button
          type="button"
          className="rounded-md p-2 text-gray-500 hover:bg-gray-50"
          aria-label="Add node"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="rounded-md p-2 text-gray-500 hover:bg-gray-50"
          aria-label="Select"
        >
          <MousePointer2 className="h-4 w-4" />
        </button>
        <div className="mx-1 h-4 w-px bg-gray-200" />
        <span className="px-2 text-xs leading-none font-medium text-gray-400">
          {t.studio.editor.canvas.zoom}
        </span>
      </div>
    </div>
  );
}
