"use client";

import { motion } from "motion/react";

import { useI18n, useMotionTransition } from "@/hooks";
import { workflowNodeVisuals, workflowPaths } from "@/utils/landing";

function getNodeById(id: string) {
  const node = workflowNodeVisuals.find((n) => n.id === id);
  if (!node) {
    throw new Error(`Workflow node not found: ${id}`);
  }
  return node;
}

export function WorkflowCanvas() {
  const { t } = useI18n();
  const pathTransition = useMotionTransition({ duration: 1.5, delay: 0.5 });

  return (
    <section className="bg-gray-50/50 py-20">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="font-display mb-4 text-3xl font-bold md:text-4xl">
            {t.workflow.title}
          </h2>
          <p className="mx-auto max-w-xl text-gray-600">
            {t.workflow.description}
          </p>
        </div>

        <div className="relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(#000 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
            aria-hidden
          />

          <svg className="pointer-events-none absolute inset-0 h-full w-full">
            {workflowPaths.map((path, idx) => {
              const from = getNodeById(path.fromId);
              const to = getNodeById(path.toId);
              return (
                <motion.path
                  key={`${path.fromId}-${path.toId}`}
                  d={`M ${from.x} ${from.y} C ${from.x} ${from.y}, ${to.x} ${to.y}, ${to.x} ${to.y}`}
                  stroke="#E5E7EB"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    ...pathTransition,
                    delay: (pathTransition.delay ?? 0) + idx * 0.2,
                  }}
                />
              );
            })}
          </svg>

          {workflowNodeVisuals.map((node) => (
            <motion.div
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                damping: 15,
                delay: node.id === "1" ? 0 : 0.2 * Number.parseInt(node.id, 10),
              }}
              className="group absolute"
              style={{
                left: node.x,
                top: node.y,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110 ${node.color}`}
                >
                  <node.icon className="h-6 w-6 text-white" />
                </div>
                <span className="mt-3 rounded border border-gray-100 bg-white px-2 py-1 text-xs font-bold tracking-widest text-gray-400 uppercase shadow-sm">
                  {t.workflow.nodes[node.labelKey]}
                </span>
              </div>
            </motion.div>
          ))}

          {workflowPaths.map((path, idx) => {
            const from = getNodeById(path.fromId);
            const to = getNodeById(path.toId);
            return (
              <motion.div
                key={`pulse-${path.fromId}-${path.toId}`}
                className="absolute h-2 w-2 rounded-full bg-blue-500"
                animate={{
                  left: [from.x, to.x],
                  top: [from.y, to.y],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: idx * 0.5,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
