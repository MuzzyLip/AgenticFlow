import type { LucideIcon } from "lucide-react";

export type WorkspaceTabId =
  | "explore"
  | "workspace"
  | "datasets"
  | "plugins";

export type AgentStatus = "live" | "paused";

export type AgentType = "swarm" | "agent" | "workflow";

export interface WorkspaceAgent {
  id: string;
  name: string;
  desc: string;
  status: AgentStatus;
  updated: string;
  apps: number;
  executions: string;
  type: AgentType;
}

export type ExploreCategoryId =
  | "all"
  | "marketing"
  | "support"
  | "engineering"
  | "personal"
  | "data";

export type ExploreTemplateKey =
  | "seoStrategist"
  | "csResponse"
  | "prReview"
  | "travelPlanner"
  | "sqlGenerator"
  | "emailOutreach";

export type ExploreGroupKey =
  | "marketing"
  | "support"
  | "engineering"
  | "personal"
  | "data";

export interface ExploreTemplateConfig {
  id: string;
  templateKey: ExploreTemplateKey;
  groupKey: ExploreGroupKey;
  icon: LucideIcon;
  users: string;
  rating: string;
  color: string;
  textColor: string;
}

export type KnowledgeDatasetStatus = "synced" | "processing";

export interface KnowledgeDataset {
  id: string;
  name: string;
  type: string;
  size: string;
  chunks: string | number;
  status: KnowledgeDatasetStatus;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export type StudioPluginProvider = "official" | "nexus" | "community";

export type StudioPluginDescKey =
  | "googleSearch"
  | "githubSync"
  | "slackBot"
  | "stripePayments"
  | "postmarkEmail"
  | "cronScheduler"
  | "vercelDeploy"
  | "wolframAlpha";

export interface StudioPluginConfig {
  id: string;
  name: string;
  provider: StudioPluginProvider;
  descKey: StudioPluginDescKey;
  icon: LucideIcon;
  color: string;
  bg: string;
  installed: boolean;
}

export type CanvasNodeType = "trigger" | "agent" | "tool";

export interface CanvasNode {
  id: string;
  type: CanvasNodeType;
  icon: LucideIcon;
  label: string;
  color: string;
  x: number;
  y: number;
}
