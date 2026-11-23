import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";
import { CATEGORIES } from "@/lib/categories";
import { SUBJECTS, GRADES } from "@/lib/pSEO";
import { getToolPaths } from "@/lib/toolsCatalog";
import { getExtendedPseoPaths } from "@/lib/pseoExtended";
import { fetchPublicQuizSlugs } from "@/lib/publicQuizzes";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const posts = getAllPosts();
  const publicQuizSlugs = await fetchPublicQuizSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE.url}/de-thi`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/kho-de`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/meo`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/howtouse`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/stats`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Subject hubs & Programmatic SEO pages (9 subjects + 36 subject x grade pages)
  const subjectHubPages: MetadataRoute.Sitemap = SUBJECTS.map((sub) => ({
    url: `${SITE.url}/de-thi/${sub.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const pseoPages: MetadataRoute.Sitemap = [];
  for (const sub of SUBJECTS) {
    for (const gr of GRADES) {
      pseoPages.push({
        url: `${SITE.url}/de-thi/${sub.slug}/${gr.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      });
    }
  }

  // Extended pSEO 2.0 hubs & detail pages (/de-thi/dgnl, dai-hoc, vao-10, chung-chi)
  const extendedPseoPages: MetadataRoute.Sitemap = getExtendedPseoPaths().map(
    (path) => {
      const isHub = path.split("/").filter(Boolean).length === 2;
      return {
        url: `${SITE.url}${path}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: isHub ? 0.85 : 0.8,
      };
    },
  );

  // Free interactive micro-tools (/cong-cu and /cong-cu/<slug>)
  const toolPages: MetadataRoute.Sitemap = getToolPaths().map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "/cong-cu" ? 0.9 : 0.85,
  }));

  // Public community quizzes (/kho-de/<slug>)
  const publicQuizPages: MetadataRoute.Sitemap = publicQuizSlugs.map((item) => ({
    url: `${SITE.url}/kho-de/${item.slug}`,
    lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${SITE.url}/blog/category/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Blog post pages
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE.url}/blog/${post.frontmatter.slug}`,
    lastModified: new Date(post.frontmatter.updated || post.frontmatter.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    ...(post.frontmatter.cover
      ? {
          images: [
            /^https?:/i.test(post.frontmatter.cover)
              ? post.frontmatter.cover
              : `${SITE.url}${post.frontmatter.cover}`,
          ],
        }
      : {}),
  }));

  return [
    ...staticPages,
    ...subjectHubPages,
    ...pseoPages,
    ...extendedPseoPages,
    ...toolPages,
    ...publicQuizPages,
    ...categoryPages,
    ...blogPages,
  ];
}
