"use client";

import { motion } from "motion/react";
import {
  ChevronRight,
  Clock,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/hooks";
import type { ExploreCategoryId } from "@/types/studio";
import { exploreCategories, exploreTemplates } from "@/utils/studio";

export function ExploreView() {
  const { t } = useI18n();
  const explore = t.studio.explore;
  const [activeCategory, setActiveCategory] = useState<ExploreCategoryId>("all");

  const filteredTemplates =
    activeCategory === "all"
      ? exploreTemplates
      : exploreTemplates.filter((tpl) => tpl.groupKey === activeCategory);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white">
      <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 p-8 backdrop-blur-md">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col items-center justify-between gap-6 md:flex-row">
            <h1 className="font-display flex items-center gap-3 text-2xl font-bold">
              <Sparkles className="h-6 w-6 text-indigo-600" />
              {explore.title}
            </h1>
            <div className="relative w-full md:w-96">
              <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={explore.searchPlaceholder}
                className="w-full rounded-2xl border border-transparent bg-gray-50 py-3 pr-4 pl-11 text-sm transition-all focus:border-gray-200 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-2">
            {exploreCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-sm font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {explore.categories[cat]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl space-y-12 p-8 pb-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.div
            whileHover={{ y: -4 }}
            className="group relative cursor-pointer overflow-hidden rounded-[2rem] bg-indigo-600 p-8 text-white"
          >
            <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
            <div className="relative z-10">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h2 className="font-display mb-3 text-3xl font-bold">
                {explore.featuredTrending.title}
              </h2>
              <p className="mb-6 max-w-xs text-indigo-100">
                {explore.featuredTrending.description}
              </p>
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 font-bold text-indigo-600 transition-all group-hover:gap-3"
              >
                {explore.featuredTrending.cta}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="group relative cursor-pointer overflow-hidden rounded-[2rem] bg-gray-900 p-8 text-white"
          >
            <div className="absolute bottom-0 left-0 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="relative z-10">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Clock className="h-6 w-6" />
              </div>
              <h2 className="font-display mb-3 text-3xl font-bold">
                {explore.featuredRecent.title}
              </h2>
              <p className="mb-6 max-w-xs text-gray-400">
                {explore.featuredRecent.description}
              </p>
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-2.5 font-bold text-white transition-all group-hover:gap-3"
              >
                {explore.featuredRecent.cta}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold">
              {explore.starterTemplates}
            </h3>
            <button
              type="button"
              className="text-sm font-bold text-indigo-600 hover:underline"
            >
              {explore.viewAll}
            </button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((tpl, idx) => {
              const template = explore.templates[tpl.templateKey];
              return (
                <motion.div
                  key={tpl.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group flex cursor-pointer flex-col rounded-3xl border border-gray-100 bg-white p-6 transition-all hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-100/50"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div
                      className={`rounded-2xl p-3 ${tpl.color} ${tpl.textColor} transition-transform group-hover:scale-110`}
                    >
                      <tpl.icon className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="mb-1 text-[10px] leading-none font-bold tracking-widest text-gray-400 uppercase">
                        {explore.groups[tpl.groupKey]}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold">★ {tpl.rating}</span>
                        <span className="text-[10px] text-gray-400">({tpl.users})</span>
                      </div>
                    </div>
                  </div>
                  <h4 className="mb-2 text-lg font-bold transition-colors group-hover:text-indigo-600">
                    {template.name}
                  </h4>
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-500">
                    {template.description}
                  </p>
                  <button
                    type="button"
                    className="w-full rounded-xl bg-gray-50 py-2.5 text-xs font-bold text-gray-900 transition-all group-hover:bg-indigo-600 group-hover:text-white"
                  >
                    {explore.useTemplate}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
