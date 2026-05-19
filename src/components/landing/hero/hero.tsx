"use client";

import { motion } from "motion/react";
import { BookOpen } from "lucide-react";

import { GetStartedButton } from "@/components/auth";
import { useI18n, useMotionTransition } from "@/hooks";
import { externalLinks } from "@/utils/landing";

export function Hero() {
  const { t } = useI18n();
  const titleTransition = useMotionTransition({ duration: 0.7 });
  const subtitleTransition = useMotionTransition({ duration: 0.7, delay: 0.1 });
  const ctaTransition = useMotionTransition({ duration: 0.7, delay: 0.2 });

  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      <div
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[800px] w-full -translate-x-1/2"
        aria-hidden
      >
        <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-blue-50/50 blur-[120px]" />
        <div className="absolute top-[10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-purple-50/50 blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={titleTransition}
          className="font-display mx-auto mb-8 max-w-4xl text-5xl leading-[1.1] font-bold tracking-tight text-gray-950 md:text-7xl"
        >
          {t.hero.title} <br />
          <span className="text-gray-400">{t.hero.titleMuted}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={subtitleTransition}
          className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl"
        >
          {t.hero.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={ctaTransition}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <GetStartedButton className="w-full rounded-full bg-black px-8 py-4 font-semibold text-white shadow-lg shadow-black/5 transition-all hover:bg-gray-800 sm:w-auto" />
          <a
            href={externalLinks.docsReadme}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-8 py-4 font-semibold text-gray-900 transition-all hover:bg-gray-50 sm:w-auto"
          >
            <BookOpen className="h-4 w-4" />
            {t.common.readTheDocs}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
