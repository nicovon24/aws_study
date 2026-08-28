"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { AppShell } from "@/components/layout";
import { useUrlFocus } from "@/hooks";

const FavoritesView = dynamic(() => import("@/components/views/FavoritesView"), { ssr: false });

function FavoritosPageInner() {
  const { selectedId, setSelectedId } = useUrlFocus();

  return (
    <AppShell>
      <FavoritesView selectedId={selectedId} onSelect={setSelectedId} />
    </AppShell>
  );
}

export default function FavoritosPage() {
  return (
    <Suspense>
      <FavoritosPageInner />
    </Suspense>
  );
}
