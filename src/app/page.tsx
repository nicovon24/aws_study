"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";

// The map view sizes itself from the live stage dimensions, so there is
// nothing meaningful to render on the server — load it in the browser only.
const AwsStudyApp = dynamic(() => import("@/components/AwsStudyApp"), { ssr: false });

const MIN_LOADER_MS = 1200;

export default function Page() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowLoader(false), MIN_LOADER_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <AwsStudyApp />
      {showLoader && (
        <div className="fixed inset-0 z-[100]">
          <Loader />
        </div>
      )}
    </>
  );
}
