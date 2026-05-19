"use client";

import {
  Database,
  HardDrive,
  MoreHorizontal,
  Plus,
  Search,
  SearchCode,
  Shield,
  Upload,
} from "lucide-react";

import { useI18n } from "@/hooks";
import { knowledgeDatasets } from "@/utils/studio";

const featureIcons = [SearchCode, Database, HardDrive, Shield] as const;
const featureKeys = [
  "vectorSearch",
  "graphMemory",
  "coldStorage",
  "accessControl",
] as const;

export function KnowledgeView() {
  const { t } = useI18n();
  const knowledge = t.studio.knowledge;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-gray-50/50">
      <div className="mx-auto w-full max-w-6xl space-y-8 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">{knowledge.title}</h1>
            <p className="text-sm text-gray-500">{knowledge.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50"
            >
              <Upload className="h-4 w-4" />
              {knowledge.uploadFile}
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-black/5 transition-all hover:bg-gray-800"
            >
              <Plus className="h-4 w-4" />
              {knowledge.newCollection}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featureKeys.map((key, idx) => {
            const feature = knowledge.features[key];
            const Icon = featureIcons[idx];
            const colors = [
              "bg-indigo-50 text-indigo-600",
              "bg-emerald-50 text-emerald-600",
              "bg-amber-50 text-amber-600",
              "bg-rose-50 text-rose-600",
            ];
            return (
              <div
                key={key}
                className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${colors[idx]}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-1 font-bold">{feature.title}</h3>
                <p className="text-xs text-gray-500">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-6">
            <h3 className="font-bold">{knowledge.activeCollections}</h3>
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={knowledge.searchCollections}
                className="rounded-lg border border-gray-200 bg-gray-50 py-1.5 pr-4 pl-9 text-xs focus:ring-1 focus:ring-black/5 focus:outline-none"
              />
            </div>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                <th className="px-6 py-4">{knowledge.table.name}</th>
                <th className="px-6 py-4">{knowledge.table.format}</th>
                <th className="px-6 py-4">{knowledge.table.size}</th>
                <th className="px-6 py-4">{knowledge.table.chunks}</th>
                <th className="px-6 py-4">{knowledge.table.status}</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {knowledgeDatasets.map((data) => (
                <tr key={data.id} className="group transition-colors hover:bg-gray-50/50">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-2 ${data.bg} ${data.color}`}>
                        <data.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold text-gray-900">{data.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-medium text-gray-500">{data.type}</span>
                  </td>
                  <td className="px-6 py-5 font-mono text-[10px] text-gray-400">
                    {data.size}
                  </td>
                  <td className="px-6 py-5 font-mono text-[10px] text-gray-400">
                    {data.chunks}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          data.status === "synced"
                            ? "bg-emerald-500"
                            : "animate-pulse bg-amber-500"
                        }`}
                      />
                      <span className="text-xs font-bold text-gray-600 capitalize">
                        {knowledge.status[data.status]}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      type="button"
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white hover:text-black"
                      aria-label="More options"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
