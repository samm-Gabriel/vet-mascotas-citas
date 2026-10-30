import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";

export const instant = false;

function ShellFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center text-muted-foreground">
      Cargando…
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<ShellFallback />}>
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
