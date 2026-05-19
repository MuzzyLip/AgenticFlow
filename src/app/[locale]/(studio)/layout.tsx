import { auth } from "@/auth";
import { StudioShell } from "@/components/studio/studio-shell";
import { redirect } from "next/navigation";

interface StudioLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function StudioLayout({
  children,
  params,
}: StudioLayoutProps) {
  const { locale } = await params;
  const session = await auth();

  if (!session) {
    redirect(`/${locale}`);
  }

  return <StudioShell>{children}</StudioShell>;
}
