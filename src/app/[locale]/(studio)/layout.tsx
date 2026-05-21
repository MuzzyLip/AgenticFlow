import { StudioAuthGate } from "@/components/studio/studio-auth-gate";
import { StudioShell } from "@/components/studio/studio-shell";

interface StudioLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function StudioLayout({
  children,
  params,
}: StudioLayoutProps) {
  const { locale } = await params;

  return (
    <StudioAuthGate locale={locale}>
      <StudioShell>{children}</StudioShell>
    </StudioAuthGate>
  );
}
