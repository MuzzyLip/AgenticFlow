"use client";

import { motion } from "motion/react";
import { ChevronRight, Search } from "lucide-react";

import { useI18n } from "@/hooks";
import { studioPlugins } from "@/utils/studio";

export function PluginsView() {
  const { t } = useI18n();
  const plugins = t.studio.plugins;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <div className="border-b border-gray-100 p-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-1">
            <h1 className="font-display text-2xl font-bold">{plugins.title}</h1>
            <p className="text-sm text-gray-500">{plugins.description}</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={plugins.searchPlaceholder}
              className="w-full rounded-xl border border-transparent bg-gray-50 py-2.5 pr-4 pl-9 text-sm transition-all focus:border-gray-200 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {studioPlugins.map((plugin, idx) => (
              <motion.div
                key={plugin.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="group flex cursor-pointer flex-col rounded-3xl border border-gray-100 bg-white p-6 transition-all hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`rounded-2xl p-3 ${plugin.bg} ${plugin.color} transition-transform group-hover:scale-110`}
                  >
                    <plugin.icon className="h-6 w-6" />
                  </div>
                  {plugin.installed ? (
                    <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold tracking-tight text-emerald-600 uppercase">
                      {plugins.active}
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="flex items-center gap-1 text-[10px] font-bold tracking-tight text-gray-400 uppercase hover:text-black"
                    >
                      {plugins.install}
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 transition-colors group-hover:text-indigo-600">
                  {plugin.name}
                </h3>
                <p className="mt-1 mb-3 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                  {plugins.providers[plugin.provider]}
                </p>
                <p className="line-clamp-2 text-xs leading-relaxed text-gray-500">
                  {plugins.descriptions[plugin.descKey]}
                </p>
                <div className="mt-auto flex items-center justify-between pt-6 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    className="text-[10px] font-bold text-gray-400 hover:text-indigo-600 hover:underline"
                  >
                    {plugins.configuration}
                  </button>
                  <button
                    type="button"
                    className="text-[10px] font-bold text-gray-400 hover:text-indigo-600 hover:underline"
                  >
                    {plugins.documentation}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center justify-between rounded-[2.5rem] border border-gray-100 bg-gray-50 p-12 md:flex-row">
            <div className="mb-8 text-center md:mb-0 md:text-left">
              <h2 className="mb-2 text-2xl font-bold">{plugins.buildOwn.title}</h2>
              <p className="max-w-md text-sm text-gray-500">
                {plugins.buildOwn.description}
              </p>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-2xl bg-black px-8 py-3 font-bold text-white shadow-lg shadow-black/5 transition-all hover:bg-gray-800"
            >
              {plugins.buildOwn.cta}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
