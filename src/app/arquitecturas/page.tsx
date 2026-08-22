"use client";

import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AppShell } from "@/components/layout";

const ArchitecturesView = dynamic(() => import("@/components/views/ArchitecturesView"), { ssr: false });

function ArquitecturasPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id");

  function onSelect(id: string | null) {
    router.replace(id ? `${pathname}?id=${encodeURIComponent(id)}` : pathname, { scroll: false });
  }

  return (
    <AppShell>
      <ArchitecturesView selectedId={selectedId} onSelect={onSelect} />
    </AppShell>
  );
}

export default function ArquitecturasPage() {
  return (
    <Suspense>
      <ArquitecturasPageInner />
    </Suspense>
  );
}
