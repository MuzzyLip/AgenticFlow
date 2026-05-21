"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  Bell,
  Bot,
  ChevronDown,
  ChevronRight,
  Home,
  LogOut,
  Mail,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { useAuthSession } from "@/contexts/auth-session-provider";
import { useI18n, useMotionTransition } from "@/hooks";
import { appRoutes, workspaceNavItems } from "@/utils";
import { cn } from "@/utils/cn";
import { getActiveStudioTab, studioTabPath } from "@/utils/studio";

export function WorkspaceSidebar() {
  const { t, lp } = useI18n();
  const { session, signOut } = useAuthSession();
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = getActiveStudioTab(pathname);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuTransition = useMotionTransition({ duration: 0.2 });
  const user = session?.user;

  const navLabels = {
    explore: t.studio.nav.explore,
    workspace: t.studio.nav.workspace,
    datasets: t.studio.nav.datasets,
    plugins: t.studio.nav.plugins,
  } as const;

  const handleGoHome = () => {
    setIsProfileOpen(false);
    router.push(lp(appRoutes.home));
  };

  const handleSignOut = () => {
    setIsProfileOpen(false);
    void signOut(lp(appRoutes.home));
  };

  return (
    <aside className="relative flex h-full w-[240px] shrink-0 flex-col border-r border-gray-100 bg-[#f9fafb]">
      <div className="mb-2 p-4">
        <button
          type="button"
          className="group flex w-full items-center justify-between rounded-xl border border-transparent p-2 transition-all hover:border-gray-100 hover:bg-white hover:shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black text-white">
              <Bot className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="mb-1 text-sm leading-none font-bold text-gray-900">
                {t.studio.workspaceSwitcher.name}
              </p>
              <p className="text-[10px] font-bold tracking-tight text-gray-400 uppercase">
                {t.studio.workspaceSwitcher.tier}
              </p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400 transition-colors group-hover:text-gray-900" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {workspaceNavItems.map((item) => {
          const href = lp(studioTabPath(item.id));
          const isActive = activeTab === item.id;

          return (
            <Link
              key={item.id}
              href={href}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all",
                isActive
                  ? "border border-gray-100 bg-white text-indigo-600 shadow-sm"
                  : "text-gray-500 hover:bg-gray-200/50 hover:text-gray-900",
              )}
            >
              <item.icon
                className={cn(
                  "h-4.5 w-4.5",
                  isActive ? "text-indigo-600" : "text-gray-400",
                )}
              />
              {navLabels[item.id]}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-gray-100 p-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border border-transparent p-1.5 transition-all",
                isProfileOpen
                  ? "border-gray-100 bg-white shadow-sm"
                  : "hover:bg-gray-200/50",
              )}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-indigo-200 bg-indigo-100">
                <User className="h-4.5 w-4.5 text-indigo-600" />
              </div>
              <p className="truncate text-xs font-bold text-gray-700">
                {user?.name ?? t.studio.profile.displayName}
              </p>
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-40"
                    aria-label="Close profile menu"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={menuTransition}
                    className="absolute bottom-full left-0 z-50 mb-2 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white py-2 shadow-2xl"
                  >
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-indigo-200 bg-indigo-100">
                        <User className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-900">
                          {user?.email ?? t.studio.profile.email}
                        </p>
                        <p className="text-[10px] font-bold tracking-tight text-gray-400">
                          {user?.id ?? t.studio.profile.userId}
                        </p>
                      </div>
                    </div>

                    <div className="mx-2 my-1 h-px bg-gray-50" />

                    <div className="space-y-0.5 px-2">
                      <button
                        type="button"
                        onClick={handleGoHome}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50"
                      >
                        <Home className="h-4 w-4 text-gray-400" />
                        {t.studio.profile.profile}
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50"
                      >
                        <Settings className="h-4 w-4 text-gray-400" />
                        {t.studio.profile.account}
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {t.studio.profile.contactUs}
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                      </button>
                    </div>

                    <div className="mx-2 my-2 h-px bg-gray-50" />

                    <div className="px-2">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-gray-600 transition-colors hover:bg-rose-50 hover:text-rose-600"
                      >
                        <LogOut className="h-4 w-4 text-gray-400" />
                        {t.studio.profile.logOut}
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            className="relative rounded-xl p-2 text-gray-400 transition-all hover:bg-gray-200/50 hover:text-gray-900"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <motion.div className="absolute top-2 right-2 h-2 w-2 rounded-full border-2 border-[#f9fafb] bg-rose-500" />
          </button>
        </div>
      </div>
    </aside>
  );
}


