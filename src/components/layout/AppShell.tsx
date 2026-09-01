"use client";

import { usePathname, useRouter } from "next/navigation";
import { useExam, useLocale } from "@/hooks";
import { pick } from "@/lib/ui/locale";
import { VIEW_PATH, viewFromPathname } from "@/lib/routes";
import { UI } from "@/lib/ui/uiStrings";
import Header from "./Header";

type Props = {
  /** Rendered below the nav tabs inside the mobile drawer (e.g. category filters). */
  drawerContent?: React.ReactNode;
  children: React.ReactNode;
};

/** Shared header + checkered background wrapper used by every route/page. */
export default function AppShell({ drawerContent, children }: Props) {
  const { locale } = useLocale();
  const { urlFor } = useExam();
  const router = useRouter();
  const pathname = usePathname();
  const view = viewFromPathname(pathname);

  return (
    <div
      className="flex h-screen flex-col bg-bg bg-repeat text-ink"
      style={{
        backgroundImage:
          "linear-gradient(#1c2b4a 1px,transparent 1px),linear-gradient(90deg,#1c2b4a 1px,transparent 1px),linear-gradient(#16233c 1px,transparent 1px),linear-gradient(90deg,#16233c 1px,transparent 1px)",
        backgroundSize: "73px 73px,73px 73px,18.25px 18.25px,18.25px 18.25px",
      }}
    >
      <Header view={view} onNavigate={(v) => router.push(urlFor(VIEW_PATH[v]))}>
        {drawerContent}
      </Header>
      {children}
      <div className="shrink-0 border-t border-line bg-panel-2 px-4 py-1.5 text-center font-mono text-[10px] text-muted-2 sm:px-6">
        {pick(locale, UI.disclaimer)}
      </div>
    </div>
  );
}
