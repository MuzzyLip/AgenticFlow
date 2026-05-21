import { Database, FileText, Shield, Table } from "lucide-react";

import type { KnowledgeDataset } from "@/types/studio";

export const knowledgeDatasets: KnowledgeDataset[] = [
  {
    id: "1",
    name: "Product Documentation",
    type: "Text/Markdown",
    size: "24.5 MB",
    chunks: 1204,
    status: "synced",
    icon: FileText,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    id: "2",
    name: "User Support History",
    type: "JSON/CSV",
    size: "156.0 MB",
    chunks: 8520,
    status: "synced",
    icon: Table,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    id: "3",
    name: "Company Policy PDF",
    type: "PDF",
    size: "2.1 MB",
    chunks: 45,
    status: "processing",
    icon: Shield,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    id: "4",
    name: "Customer Database",
    type: "SQL Sync",
    size: "1.2 GB",
    chunks: "Daily",
    status: "synced",
    icon: Database,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
];
