"use client";

import dynamic from "next/dynamic";

const GlobalConversionPopup = dynamic(
  () =>
    import("./GlobalConversionPopup").then((mod) => mod.GlobalConversionPopup),
  { ssr: false },
);

const MobileFloatingCta = dynamic(
  () => import("./MobileFloatingCta").then((mod) => mod.MobileFloatingCta),
  { ssr: false },
);

export function ConversionLayerClient() {
  return (
    <>
      <GlobalConversionPopup />
      <MobileFloatingCta />
    </>
  );
}
