import type { LucideIcon } from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterLinkGroup {
  title: string;
  links: NavLink[];
}

export interface WorkflowNode {
  id: string;
  icon: LucideIcon;
  label: string;
  color: string;
  x: string;
  y: string;
}

export interface WorkflowPath {
  fromId: string;
  toId: string;
}

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  iconColor: string;
}
