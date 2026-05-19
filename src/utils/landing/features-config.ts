import {
  BarChart3,
  Globe,
  Layers,
  Share2,
  Shield,
  Zap,
} from "lucide-react";

export const featureVisuals = [
  {
    icon: Zap,
    color: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    icon: Shield,
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Layers,
    color: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: Globe,
    color: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: Share2,
    color: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    icon: BarChart3,
    color: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
] as const;
