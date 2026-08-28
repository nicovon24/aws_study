"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout";
import { useExam, useUrlFocus } from "@/hooks";
import { VIEW_PATH } from "@/lib/routes";

const PracticeView = dynamic(() => import("@/components/views/PracticeView"), { ssr: false });

function PracticarPageInner() {
  const router = useRouter();
  const { urlFor } = useExam();
  const { focus, setFocus } = useUrlFocus();

  return (
    <AppShell>
      <PracticeView
        focus={focus}
        onFocusChange={setFocus}
        onNavigate={(v) => router.push(urlFor(VIEW_PATH[v]))}
      />
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
