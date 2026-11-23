import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { UNIVERSITY_SUBJECTS, getExamByHubAndSlug } from "@/lib/pseoExtended";
import { ExtendedExamDetailView } from "@/components/pSEO/ExtendedExamDetailView";

type RouteParams = {
  subject: string;
};

export async function generateStaticParams(): Promise<RouteParams[]> {
  return UNIVERSITY_SUBJECTS.map((item) => ({ subject: item.slug }));
}

export async function generateMetadata(props: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { subject } = await props.params;
  const entry = getExamByHubAndSlug("dai-hoc", subject);
  if (!entry) return {};

  return buildMetadata({
    title: entry.seoTitle,
    description: entry.seoDescription,
    path: `/de-thi/dai-hoc/${entry.slug}`,
    keywords: entry.keywords,
  });
}

export default async function DaiHocDetailPage(props: {
  params: Promise<RouteParams>;
}) {
  const { subject } = await props.params;
  const entry = getExamByHubAndSlug("dai-hoc", subject);
  if (!entry) notFound();

  return <ExtendedExamDetailView entry={entry} />;
}
