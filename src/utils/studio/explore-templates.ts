import { Bot, Globe, MessageSquare, Shield, Zap } from "lucide-react";

import type { ExploreCategoryId, ExploreTemplateConfig } from "@/types/studio";

export const exploreCategories: ExploreCategoryId[] = [
  "all",
  "marketing",
  "support",
  "engineering",
  "personal",
  "data",
];

export const exploreTemplates: ExploreTemplateConfig[] = [
  {
    id: "1",
    templateKey: "seoStrategist",
    groupKey: "marketing",
    icon: Bot,
    users: "12k",
    rating: "4.8",
    color: "bg-indigo-50",
    textColor: "text-indigo-600",
  },
  {
    id: "2",
    templateKey: "csResponse",
    groupKey: "support",
    icon: MessageSquare,
    users: "8.4k",
    rating: "4.9",
    color: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    id: "3",
    templateKey: "prReview",
    groupKey: "engineering",
    icon: Shield,
    users: "4.2k",
    rating: "4.7",
    color: "bg-amber-50",
    textColor: "text-amber-600",
  },
  {
    id: "4",
    templateKey: "travelPlanner",
    groupKey: "personal",
    icon: Globe,
    users: "25k",
    rating: "4.6",
    color: "bg-rose-50",
    textColor: "text-rose-600",
  },
  {
    id: "5",
    templateKey: "sqlGenerator",
    groupKey: "data",
    icon: Zap,
    users: "15k",
    rating: "4.9",
    color: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    id: "6",
    templateKey: "emailOutreach",
    groupKey: "marketing",
    icon: Bot,
    users: "7.1k",
    rating: "4.5",
    color: "bg-purple-50",
    textColor: "text-purple-600",
  },
];
