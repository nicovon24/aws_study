"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { AppShell } from "@/components/layout";
import { focusToParams, useExam, useUrlFocus } from "@/hooks";
import { VIEW_PATH } from "@/lib/routes";

// The map view sizes itself from the live stage dimensions, so there is
// nothing meaningful to render on the server — load it in the browser only.
const DashboardView = dynamic(() => import("@/components/views/DashboardView"), { ssr: false });

function DashboardPageInner() {
  const router = useRouter();
  const { urlFor } = useExam();
  const { focus } = useUrlFocus();

  function goStudy(f: typeof focus) {
    const params = new URLSearchParams();
    focusToParams(f, params);
    router.push(urlFor(VIEW_PATH.map, params));
  }

  return (
    <AppShell>
      <DashboardView onStudy={goStudy} onNavigate={(v) => router.push(urlFor(VIEW_PATH[v]))} />
    </AppShell>
  );
}

export default function Page() {
  return (
    <Suspense>
      <DashboardPageInner />
    </Suspense>
  );
}
