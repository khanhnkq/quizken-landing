import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { GRADE10_EXAMS, getExamByHubAndSlug } from "@/lib/pseoExtended";
import { ExtendedExamDetailView } from "@/components/pSEO/ExtendedExamDetailView";

type RouteParams = {
  exam: string;
};

export async function generateStaticParams(): Promise<RouteParams[]> {
  return GRADE10_EXAMS.map((item) => ({ exam: item.slug }));
}

export async function generateMetadata(props: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { exam } = await props.params;
  const entry = getExamByHubAndSlug("vao-10", exam);
  if (!entry) return {};

  return buildMetadata({
    title: entry.seoTitle,
    description: entry.seoDescription,
    path: `/de-thi/vao-10/${entry.slug}`,
    keywords: entry.keywords,
  });
}

export default async function Vao10DetailPage(props: {
  params: Promise<RouteParams>;
}) {
  const { exam } = await props.params;
  const entry = getExamByHubAndSlug("vao-10", exam);
  if (!entry) notFound();

  return <ExtendedExamDetailView entry={entry} />;
}
