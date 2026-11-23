import { buildMetadata } from "@/lib/seo";
import { EXTENDED_HUBS } from "@/lib/pseoExtended";
import { ExtendedExamHubView } from "@/components/pSEO/ExtendedExamHubView";

const hub = EXTENDED_HUBS.dgnl;

export const metadata = buildMetadata({
  title: hub.seoTitle,
  description: hub.seoDescription,
  path: hub.path,
  keywords: hub.keywords,
});

export default function DgnlHubPage() {
  return <ExtendedExamHubView hubKey="dgnl" />;
}
