"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { AppShell } from "@/components/layout";
import { CategoryFilters } from "@/components/shared";
import { useUrlFocus } from "@/hooks";

const CatalogView = dynamic(() => import("@/components/views/CatalogView"), { ssr: false });

function CatalogoPageInner() {
  const { focus, setFocus, selectedId, setSelectedId } = useUrlFocus();

  return (
    <AppShell drawerContent={<CategoryFilters focus={focus} onFocusChange={setFocus} />}>
      <CatalogView focus={focus} onFocusChange={setFocus} selectedId={selectedId} onSelect={setSelectedId} />
    </AppShell>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense>
      <CatalogoPageInner />
    </Suspense>
  );
}
