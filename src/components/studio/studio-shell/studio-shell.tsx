"use client";

import { WorkspaceSidebar } from "@/components/studio/workspace-sidebar";

interface StudioShellProps {
  children: React.ReactNode;
}

export function StudioShell({ children }: StudioShellProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white font-sans text-gray-900">
      <WorkspaceSidebar />
      <div className="relative flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
