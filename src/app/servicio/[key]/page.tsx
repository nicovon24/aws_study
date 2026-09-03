"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout";
import { ServiceContent } from "@/components/shared";
import { IconButton, BackIcon } from "@/components/ui";
import { useLocale } from "@/hooks";
import { byKey } from "@/lib/study/graph";
import { pick } from "@/lib/ui/locale";
import { UI } from "@/lib/ui/uiStrings";

/** Full-view page for a single catalog item — same content as `DetailPanel`,
 * rendered with real width for long copy and diagrams. Works for any
 * `Service.key` regardless of which exam it belongs to. */
export default function ServicePage() {
  const { locale } = useLocale();
  const router = useRouter();
  const params = useParams<{ key: string }>();
  const node = byKey[params.key];

  if (!node) notFound();

  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[820px] px-4 py-6 sm:px-6 sm:py-8">
          <IconButton size="sm" onClick={() => router.push("/catalogo")} title={pick(locale, UI.backToCatalog)} className="mb-4">
            <BackIcon />
          </IconButton>
          <ServiceContent node={node} onSelect={(id) => router.push(`/servicio/${byKey[id]?.key ?? params.key}`)} />
        </div>
      </div>
    </AppShell>
  );
}
