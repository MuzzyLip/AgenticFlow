"use client";

import { motion } from "motion/react";
import { MessageSquare, Send, Sparkles, X } from "lucide-react";

import { useI18n } from "@/hooks";

interface SimulatorChatPanelProps {
  onClose: () => void;
}

export function SimulatorChatPanel({ onClose }: SimulatorChatPanelProps) {
  const { t } = useI18n();
  const editor = t.studio.editor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      className="absolute right-[350px] bottom-6 z-30 flex h-[550px] w-[400px] flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl"
    >
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold">{editor.simulator}</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase">
              {editor.simulatorSubtitle}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
          aria-label="Close simulator"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        <div className="flex h-full flex-col items-center justify-center space-y-3 text-center opacity-30">
          <MessageSquare className="h-8 w-8" />
          <p className="text-sm font-medium whitespace-pre-line">{editor.chatEmpty}</p>
        </div>
      </div>

      <div className="border-t border-gray-100 p-4">
        <div className="relative group">
          <input
            type="text"
            placeholder={editor.chatPlaceholder}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pr-12 pl-4 text-sm transition-all focus:bg-white focus:ring-1 focus:ring-black/10 focus:outline-none"
          />
          <button
            type="button"
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-xl bg-black p-2 text-white shadow-sm transition-all hover:scale-110 active:scale-95"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
