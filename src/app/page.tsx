"use client";

import dynamic from "next/dynamic";

// The map sizes itself from the live stage dimensions, so there is nothing
// meaningful to render on the server — load it in the browser only.
const AwsMap = dynamic(() => import("@/components/AwsMap"), { ssr: false });

export default function Page() {
  return <AwsMap />;
}
