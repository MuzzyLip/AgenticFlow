"use client";

import { motion } from "motion/react";

import { useI18n, useMotionTransition } from "@/hooks";
import { featureVisuals } from "@/utils/landing";

export function FeatureGrid() {
  const { t } = useI18n();
  const itemTransition = useMotionTransition({ duration: 0.5 });

  return (
    <section id="features" className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {t.features.items.map((feature, idx) => {
            const visual = featureVisuals[idx];
            if (!visual) return null;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  ...itemTransition,
                  delay: (itemTransition.delay ?? 0) + idx * 0.1,
                }}
                className="group rounded-3xl border border-gray-100 p-8 transition-all hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100"
              >
                <div
                  className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${visual.color} ${visual.iconColor}`}
                >
                  <visual.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                <p className="leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
