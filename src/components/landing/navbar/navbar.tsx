"use client";

import { motion } from "motion/react";
import { Bot, ChevronRight, Menu } from "lucide-react";

import { GetStartedButton } from "@/components/auth";
import { LocaleSwitcher } from "@/components/landing/locale-switcher";
import { useI18n, useMotionTransition } from "@/hooks";
import { navHrefs, siteConfig } from "@/utils/landing";
import { cn } from "@/utils";

function isExternalHref(href: string) {
  return href.startsWith("http");
}

export function Navbar() {
  const { t } = useI18n();
  const enterTransition = useMotionTransition({ duration: 0.5 });

  const navLinks = [
    { label: t.nav.features, href: navHrefs.features },
    { label: t.nav.docs, href: navHrefs.docs },
  ];

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 flex justify-center p-4 md:p-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={enterTransition}
        className="glass flex w-full max-w-6xl items-center justify-between rounded-full px-6 py-3 shadow-sm"
      >
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-black p-1.5">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            {siteConfig.name}
          </span>
        </div>

        <div className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
          {navLinks.map((link) =>
            isExternalHref(link.href) ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-black"
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-black"
              >
                {link.label}
              </a>
            ),
          )}
        </div>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <GetStartedButton className="group flex items-center gap-1 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-gray-800">
            {t.common.getStarted}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </GetStartedButton>
          <button
            type="button"
            className={cn("md:hidden")}
            aria-label={t.common.openMenu}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </motion.div>
    </nav>
  );
}
