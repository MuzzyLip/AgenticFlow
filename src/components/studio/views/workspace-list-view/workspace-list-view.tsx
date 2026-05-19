"use client";

import { motion } from "motion/react";
import {
  Bot,
  Grid,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Terminal,
  Workflow,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useI18n } from "@/hooks";
import type { AgentType } from "@/types/studio";
import { studioRoutes, workspaceAgents } from "@/utils/studio";

function AgentTypeIcon({ type }: { type: AgentType }) {
  if (type === "swarm") {
    return <Terminal className="h-6 w-6 text-white" />;
  }
  if (type === "workflow") {
    return <Workflow className="h-6 w-6 text-white" />;
  }
  return <Bot className="h-6 w-6 text-white" />;
}

function AgentTypeIconSmall({ type }: { type: AgentType }) {
  if (type === "agent") {
    return <Bot className="h-4 w-4" />;
  }
  return <Terminal className="h-4 w-4" />;
}

export function WorkspaceListView() {
  const { t, lp } = useI18n();
  const router = useRouter();
  const list = t.studio.workspaceList;
  const hasWorkspaceItems = workspaceAgents.length > 0;
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const openAgentEditor = (agentId: string) => {
    router.push(lp(studioRoutes.workspaceAgent(agentId)));
  };

  const openExplore = () => {
    router.push(lp(studioRoutes.explore));
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#fcfcfd]">
      <div className="border-b border-gray-100 bg-white p-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-1">
            <h1 className="font-display text-2xl font-bold">{list.title}</h1>
            <p className="text-sm text-gray-500">{list.description}</p>
          </div>
          <div className="flex items-center gap-3">
            {hasWorkspaceItems && (
              <>
                <div className="group relative mr-2">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={list.filterPlaceholder}
                    className="w-64 rounded-xl border border-gray-200 bg-gray-50 py-2 pr-4 pl-9 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-black/5 focus:outline-none"
                  />
                </div>
                <div className="mr-2 flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`rounded-lg p-1.5 transition-all ${
                      viewMode === "grid"
                        ? "bg-white text-black shadow-sm"
                        : "text-gray-400"
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`rounded-lg p-1.5 transition-all ${
                      viewMode === "list"
                        ? "bg-white text-black shadow-sm"
                        : "text-gray-400"
                    }`}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-black/5 transition-all hover:bg-gray-800"
            >
              <Plus className="h-4 w-4" />
              {list.createNew}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl">
          {!hasWorkspaceItems ? (
            <div className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-gray-200 bg-white py-24 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50">
                  <Bot className="h-8 w-8 text-gray-300" />
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50">
                  <Workflow className="h-8 w-8 text-gray-300" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold">{list.emptyTitle}</h3>
              <p className="mb-8 max-w-md text-center text-sm text-gray-500">
                {list.emptyDescription}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-2xl bg-black px-8 py-3 font-bold text-white transition-all hover:bg-gray-800"
                >
                  <Plus className="h-5 w-5" />
                  {list.createAgent}
                </button>
                <button
                  type="button"
                  onClick={openExplore}
                  className="rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  {t.studio.nav.explore}
                </button>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {workspaceAgents.map((agent, idx) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => openAgentEditor(agent.id)}
                  className="group flex cursor-pointer flex-col rounded-[2rem] border border-gray-100 bg-white p-6 transition-all hover:border-gray-200 hover:shadow-2xl hover:shadow-black/5"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="rounded-2xl bg-black p-3 shadow-lg shadow-black/10 transition-transform group-hover:scale-110">
                      <AgentTypeIcon type={agent.type} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase ${
                          agent.status === "live"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {list.status[agent.status]}
                      </span>
                      <button
                        type="button"
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-50"
                        aria-label="More options"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="mb-2 text-lg font-bold tracking-tight uppercase transition-colors group-hover:text-indigo-600">
                    {agent.name}
                  </h3>
                  <p className="mb-8 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-500">
                    {agent.desc}
                  </p>

                  <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold tracking-tighter text-gray-400 uppercase">
                          {list.executions}
                        </span>
                        <span className="text-sm font-bold">
                          {agent.executions}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold tracking-tighter text-gray-400 uppercase">
                          {list.applications}
                        </span>
                        <span className="text-sm font-bold">{agent.apps}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold tracking-tighter text-gray-400 uppercase">
                        {list.updated}
                      </span>
                      <span className="text-sm font-medium text-gray-500">
                        {agent.updated}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                  <tr className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                    <th className="px-6 py-4">{list.tableName}</th>
                    <th className="px-6 py-4">{list.tableStatus}</th>
                    <th className="px-6 py-4">{list.tableType}</th>
                    <th className="px-6 py-4">{list.tableUsage}</th>
                    <th className="px-6 py-4">{list.updated}</th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {workspaceAgents.map((agent) => (
                    <tr
                      key={agent.id}
                      onClick={() => openAgentEditor(agent.id)}
                      className="group cursor-pointer transition-colors hover:bg-gray-50/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 scale-90 items-center justify-center rounded-lg bg-black text-white">
                            <AgentTypeIconSmall type={agent.type} />
                          </div>
                          <div>
                            <p className="text-sm font-bold">{agent.name}</p>
                            <p className="max-w-[200px] truncate text-[10px] text-gray-400">
                              {agent.desc}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase ${
                            agent.status === "live"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {list.status[agent.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold tracking-tighter text-gray-500 uppercase">
                          {agent.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                          <Zap className="h-3 w-3 text-amber-500" />
                          {agent.executions}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-400">
                          {agent.updated}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:text-black"
                          aria-label="More options"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
