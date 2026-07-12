import { getAllPosts } from "./blog";
import { SITE, buildAbsoluteUrl } from "./site";

/**
 * Generate RSS 2.0 XML feed from all blog posts.
 */
export function generateRssFeed(): string {
  const posts = getAllPosts();

  const items = posts
    .map((post) => {
      const url = buildAbsoluteUrl(`/blog/${post.frontmatter.slug}`);
      const pubDate = new Date(post.frontmatter.date).toUTCString();
      const description = escapeXml(post.frontmatter.description);
      const title = escapeXml(post.frontmatter.title);
      const categories = post.frontmatter.tags
        .map((t) => `      <category>${escapeXml(t)}</category>`)
        .join("\n");

      return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${SITE.email} (${post.frontmatter.author || SITE.name})</author>
${categories}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
>
  <channel>
    <title>${escapeXml(SITE.name)} Blog</title>
    <link>${SITE.url}/blog</link>
    <description>${escapeXml(SITE.defaultDescription)}</description>
    <language>vi</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE.url}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${buildAbsoluteUrl(SITE.defaultOgImage)}</url>
      <title>${escapeXml(SITE.name)}</title>
      <link>${SITE.url}</link>
    </image>
${items}
  </channel>
</rss>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
