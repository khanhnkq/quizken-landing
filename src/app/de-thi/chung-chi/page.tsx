import { buildMetadata } from "@/lib/seo";
import { EXTENDED_HUBS } from "@/lib/pseoExtended";
import { ExtendedExamHubView } from "@/components/pSEO/ExtendedExamHubView";

const hub = EXTENDED_HUBS["chung-chi"];

export const metadata = buildMetadata({
  title: hub.seoTitle,
  description: hub.seoDescription,
  path: hub.path,
  keywords: hub.keywords,
});

export default function ChungChiHubPage() {
  return <ExtendedExamHubView hubKey="chung-chi" />;
}
