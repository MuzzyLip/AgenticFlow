"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { GetStartedButton } from "@/components/auth";
import { useI18n, useMotionTransition } from "@/hooks";
import { externalLinks } from "@/utils/landing";

export function CTA() {
  const { t } = useI18n();
  const revealTransition = useMotionTransition({ duration: 0.5 });

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-black p-12 text-center md:p-20">
          <div
            className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-600/20 blur-[100px]"
            aria-hidden
          />
          <div
            className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[100px]"
            aria-hidden
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={revealTransition}
            className="relative z-10"
          >
            <h2 className="font-display mb-6 text-4xl font-bold text-white md:text-6xl">
              {t.cta.title} <br className="hidden md:block" />
              {t.cta.titleLine2}
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400 md:text-xl">
              {t.cta.description}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <GetStartedButton className="group flex w-full items-center justify-center gap-2 rounded-full bg-white px-10 py-4 font-bold text-black transition-all hover:bg-gray-100 sm:w-auto">
                {t.common.getStarted}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </GetStartedButton>
              <a
                href={externalLinks.docsReadme}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-full border border-white/20 bg-transparent px-10 py-4 font-bold text-white transition-all hover:bg-white/5 sm:w-auto"
              >
                {t.common.readTheDocs}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
