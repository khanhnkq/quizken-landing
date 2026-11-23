import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { CERT_EXAMS, getExamByHubAndSlug } from "@/lib/pseoExtended";
import { ExtendedExamDetailView } from "@/components/pSEO/ExtendedExamDetailView";

type RouteParams = {
  cert: string;
};

export async function generateStaticParams(): Promise<RouteParams[]> {
  return CERT_EXAMS.map((item) => ({ cert: item.slug }));
}

export async function generateMetadata(props: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { cert } = await props.params;
  const entry = getExamByHubAndSlug("chung-chi", cert);
  if (!entry) return {};

  return buildMetadata({
    title: entry.seoTitle,
    description: entry.seoDescription,
    path: `/de-thi/chung-chi/${entry.slug}`,
    keywords: entry.keywords,
  });
}

export default async function ChungChiDetailPage(props: {
  params: Promise<RouteParams>;
}) {
  const { cert } = await props.params;
  const entry = getExamByHubAndSlug("chung-chi", cert);
  if (!entry) notFound();

  return <ExtendedExamDetailView entry={entry} />;
}
