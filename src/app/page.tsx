"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { AppShell } from "@/components/layout";
import { CategoryFilters } from "@/components/shared";
import { Loader } from "@/components/skeletons";
import { useUrlFocus } from "@/hooks";
import { VIEW_PATH } from "@/lib/routes";

// The map view sizes itself from the live stage dimensions, so there is
// nothing meaningful to render on the server — load it in the browser only.
const DashboardView = dynamic(() => import("@/components/views/DashboardView"), { ssr: false });

const MIN_LOADER_MS = 1200;

function DashboardPageInner() {
  const router = useRouter();
  const { focus, setFocus } = useUrlFocus();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowLoader(false), MIN_LOADER_MS);
    return () => clearTimeout(t);
  }, []);

  function goStudy(f: typeof focus) {
    const params = new URLSearchParams();
    if (f.kind === "domain") params.set("domain", String(f.n));
    else if (f.kind === "category") params.set("cat", f.name);
    const qs = params.toString();
    router.push(qs ? `${VIEW_PATH.map}?${qs}` : VIEW_PATH.map);
  }

  return (
    <>
      <AppShell drawerContent={<CategoryFilters focus={focus} onFocusChange={setFocus} />}>
        <DashboardView onStudy={goStudy} onNavigate={(v) => router.push(VIEW_PATH[v])} />
      </AppShell>
      {showLoader && (
        <div className="fixed inset-0 z-[100]">
          <Loader />
        </div>
      )}
    </>
  );
}

export default function Page() {
  return (
    <Suspense>
      <DashboardPageInner />
    </Suspense>
  );
}
