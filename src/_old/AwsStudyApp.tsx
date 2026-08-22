"use client";

import { useState } from "react";
import type { MapFocus, View } from "@/lib/types";
import CatalogView from "./CatalogView";
import CategoryFilters from "./CategoryFilters";
import DashboardView from "./DashboardView";
import Header from "./Header";
import MindMapView from "./MindMapView";
import PracticeView from "./PracticeView";

export default function AwsStudyApp() {
  const [view, setView] = useState<View>("dashboard");
  const [focus, setFocus] = useState<MapFocus>({ kind: "all" });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function goStudy(f: MapFocus) {
    setFocus(f);
    setSelectedId(null);
    setView("map");
  }

  function navigate(v: View) {
    setSelectedId(null);
    setView(v);
  }

  return (
    <div
      className="flex h-screen flex-col bg-bg bg-repeat text-ink"
      style={{
        backgroundImage:
          "linear-gradient(#141f36 1px,transparent 1px),linear-gradient(90deg,#141f36 1px,transparent 1px)",
        backgroundSize: "56px 56px",
      }}
    >
      <Header view={view} onNavigate={navigate}>
        <CategoryFilters
          focus={focus}
          onFocusChange={view === "map" || view === "catalog" ? setFocus : goStudy}
        />
      </Header>

      {view === "dashboard" && <DashboardView onStudy={goStudy} onNavigate={navigate} />}

      {view === "map" && (
        <MindMapView focus={focus} onFocusChange={setFocus} selectedId={selectedId} onSelect={setSelectedId} />
      )}

      {view === "catalog" && (
        <CatalogView focus={focus} onFocusChange={setFocus} selectedId={selectedId} onSelect={setSelectedId} />
      )}

      {view === "practice" && <PracticeView focus={focus} onFocusChange={setFocus} onNavigate={navigate} />}
    </div>
  );
}
