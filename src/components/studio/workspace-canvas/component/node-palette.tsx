"use client";

import { useMemo, useState } from "react";
import { Bot, Cpu, Database, Globe, MessageSquare, Plus, Shapes } from "lucide-react";
import { Panel } from "@xyflow/react";

import { Popover } from "@/components/ui/popover";
import type { WorkflowNodeDefinition, WorkflowNodeIcon } from "@/types";
import { cn } from "@/utils/cn";

const ICONS = {
  message: MessageSquare,
  bot: Bot,
  globe: Globe,
  database: Database,
  cpu: Cpu,
} as const satisfies Record<
  WorkflowNodeIcon,
  React.ComponentType<{ size?: number; className?: string }>
>;

interface NodePaletteProps {
  definitions: readonly WorkflowNodeDefinition[];
  onDragStart: (event: React.DragEvent<HTMLButtonElement>, nodeType: string) => void;
  onSelectNodeType: (nodeType: string) => void;
}

export function NodePalette({ definitions, onDragStart, onSelectNodeType }: NodePaletteProps) {
  const [open, setOpen] = useState(false);

  const groupedDefinitions = useMemo(() => {
    const groups = new Map<string, WorkflowNodeDefinition[]>();

    definitions.forEach((definition) => {
      const group = definition.uiMeta.category || "other";
      const existing = groups.get(group);

      if (existing) {
        existing.push(definition);
        return;
      }

      groups.set(group, [definition]);
    });

    return Array.from(groups.entries());
  }, [definitions]);

  return (
    <Panel position="top-left" className="m-4">
      <div className="flex flex-col gap-2">
        <Popover
          open={open}
          onOpenChange={setOpen}
          align="start"
          trigger={
            <button
              type="button"
              aria-label="Open node palette"
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm transition-colors",
                open ? "text-black" : "text-gray-500 hover:text-black",
              )}
            >
              <Plus className="h-5 w-5" />
            </button>
          }
        >
          <div className="w-80">
            <div className="border-b border-gray-100 px-3 py-2">
              <div className="flex items-center gap-2">
                <Shapes className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-900">Nodes</h3>
              </div>
              <p className="mt-1 text-xs text-gray-500">Drag a node to the canvas</p>
            </div>

            <div className="max-h-96 space-y-3 overflow-y-auto p-3">
              {groupedDefinitions.map(([category, items]) => (
                <section key={category} className="space-y-2">
                  <p className="px-1 text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
                    {category}
                  </p>
                  <div className="space-y-2">
                    {items.map((definition) => {
                      const Icon = ICONS[definition.uiMeta.icon];

                      return (
                        <button
                          key={`${definition.type}@${definition.version}`}
                          type="button"
                          draggable
                          onDragStart={(event) => onDragStart(event, definition.type)}
                          onClick={() => {
                            onSelectNodeType(definition.type);
                            setOpen(false);
                          }}
                          className="flex w-full cursor-grab items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 text-left transition-colors hover:border-gray-300 active:cursor-grabbing"
                        >
                          <div
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white",
                              definition.uiMeta.color,
                            )}
                          >
                            <Icon size={16} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {definition.displayName}
                            </p>
                            <p className="truncate text-xs text-gray-500">
                              {definition.description ?? definition.type}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </Popover>
      </div>
    </Panel>
  );
}
