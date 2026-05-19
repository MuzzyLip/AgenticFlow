import {
  Database,
  FolderOpen,
  Globe,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

import type { WorkspaceTabId } from "@/types/studio";

export interface WorkspaceNavItem {
  id: WorkspaceTabId;
  icon: LucideIcon;
}

export const workspaceNavItems: WorkspaceNavItem[] = [
  { id: "explore", icon: ShoppingBag },
  { id: "workspace", icon: FolderOpen },
  { id: "datasets", icon: Database },
  { id: "plugins", icon: Globe },
];
