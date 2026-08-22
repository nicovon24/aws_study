"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { AppShell } from "@/components/layout";
import { CategoryFilters } from "@/components/shared";
import { useUrlFocus } from "@/hooks";

const MindMapView = dynamic(() => import("@/components/views/MindMapView"), { ssr: false });

function MapaPageInner() {
  const { focus, setFocus, selectedId, setSelectedId } = useUrlFocus();

  return (
    <AppShell drawerContent={<CategoryFilters focus={focus} onFocusChange={setFocus} />}>
      <MindMapView focus={focus} onFocusChange={setFocus} selectedId={selectedId} onSelect={setSelectedId} />
    </AppShell>
  );
}

export default function MapaPage() {
  return (
    <Suspense>
      <MapaPageInner />
    </Suspense>
  );
}
