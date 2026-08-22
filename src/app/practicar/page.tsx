"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout";
import { CategoryFilters } from "@/components/shared";
import { useUrlFocus } from "@/hooks";
import { VIEW_PATH } from "@/lib/routes";

const PracticeView = dynamic(() => import("@/components/views/PracticeView"), { ssr: false });

function PracticarPageInner() {
  const router = useRouter();
  const { focus, setFocus } = useUrlFocus();

  return (
    <AppShell drawerContent={<CategoryFilters focus={focus} onFocusChange={setFocus} />}>
      <PracticeView focus={focus} onFocusChange={setFocus} onNavigate={(v) => router.push(VIEW_PATH[v])} />
    </AppShell>
  );
}

export default function PracticarPage() {
  return (
    <Suspense>
      <PracticarPageInner />
    </Suspense>
  );
}
