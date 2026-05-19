import type { WorkspaceTabId } from "@/types/studio";

export const studioRoutes = {
  home: "/",
  explore: "/explore",
  workspace: "/workspace",
  datasets: "/datasets",
  plugins: "/plugins",
  workspaceAgent: (agentId: string) => `/workspace/${agentId}`,
} as const;

const tabPathMap: Record<WorkspaceTabId, string> = {
  explore: studioRoutes.explore,
  workspace: studioRoutes.workspace,
  datasets: studioRoutes.datasets,
  plugins: studioRoutes.plugins,
};

const localePrefixPattern = /^\/(en|zh)(?=\/|$)/;

export function studioTabPath(tab: WorkspaceTabId): string {
  return tabPathMap[tab];
}

function normalizePathname(pathname: string): string {
  const pathWithoutLocale = pathname.replace(localePrefixPattern, "");
  if (!pathWithoutLocale) {
    return "/";
  }

  return pathWithoutLocale.startsWith("/")
    ? pathWithoutLocale
    : `/${pathWithoutLocale}`;
}

export function getActiveStudioTab(pathname: string): WorkspaceTabId {
  const normalizedPathname = normalizePathname(pathname);

  if (
    normalizedPathname === studioRoutes.workspace ||
    normalizedPathname.startsWith(`${studioRoutes.workspace}/`)
  ) {
    return "workspace";
  }

  if (
    normalizedPathname === studioRoutes.datasets ||
    normalizedPathname.startsWith(`${studioRoutes.datasets}/`)
  ) {
    return "datasets";
  }

  if (
    normalizedPathname === studioRoutes.plugins ||
    normalizedPathname.startsWith(`${studioRoutes.plugins}/`)
  ) {
    return "plugins";
  }

  if (
    normalizedPathname === studioRoutes.explore ||
    normalizedPathname.startsWith(`${studioRoutes.explore}/`)
  ) {
    return "explore";
  }

  return "explore";
}
