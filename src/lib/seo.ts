import type { Metadata } from "next";
import { SITE, buildAbsoluteUrl } from "./site";

type PageSeo = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  type?: "website" | "article";
};

/**
 * Build per-page Next.js Metadata with title suffix, canonical, OG, Twitter.
 * Title is always suffixed with the site name unless already present.
 */
export function buildMetadata({
  title,
  description = SITE.defaultDescription,
  path = "/",
  image = SITE.defaultOgImage,
  noIndex = false,
  keywords,
  publishedTime,
  modifiedTime,
  authors,
  type = "website",
}: PageSeo): Metadata {
  const url = buildAbsoluteUrl(path);
  const imageUrl = /^https?:/i.test(image) ? image : buildAbsoluteUrl(image);
  const fullTitle =
    title.toLowerCase().includes(SITE.name.toLowerCase()) || title.length > 60
      ? title
      : `${title} | ${SITE.name}`;

  return {
    title: fullTitle,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    openGraph: {
      type,
      locale: SITE.locale,
      url,
      siteName: SITE.name,
      title: fullTitle,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/jpeg",
        },
      ],
      ...(type === "article" && publishedTime
        ? { publishedTime, modifiedTime, authors }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      site: SITE.twitter,
      creator: SITE.twitter,
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  };
}

/* ----------------------------- JSON-LD generators ----------------------------- */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: buildAbsoluteUrl(SITE.defaultOgImage),
    description: SITE.defaultDescription,
    foundingDate: SITE.foundingDate,
    areaServed: { "@type": "Country", name: "VN" },
    sameAs: [SITE.social.facebook, SITE.social.youtube, SITE.social.github],
  };
}

export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    url: SITE.url,
    description: SITE.defaultDescription,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "VND",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
    },
    screenshot: buildAbsoluteUrl(SITE.defaultOgImage),
  };
}

export function webPageSchema(title: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: buildAbsoluteUrl(path),
    inLanguage: "vi-VN",
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
  };
}

export function faqSchema(
  faqs: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildAbsoluteUrl(item.path),
    })),
  };
}

export function personSchema(name: string, title?: string, sameAs?: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: title || "Expert Writer",
    worksFor: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    sameAs: sameAs || [SITE.social.facebook],
  };
}

export function articleSchema(opts: {
  title: string;
  description: string;
  image?: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    image: buildAbsoluteUrl(opts.image || SITE.defaultOgImage),
    datePublished: opts.datePublished,
    dateModified: opts.dateModified || opts.datePublished,
    inLanguage: "vi-VN",
    author: {
      "@type": "Person",
      name: opts.author || "QuizKen Team",
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: {
        "@type": "ImageObject",
        url: buildAbsoluteUrl(SITE.defaultOgImage),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": buildAbsoluteUrl(opts.path),
    },
  };
}

/** Inline <script type="application/ld+json"> renderer for use in Server Components. */

/** BlogPosting schema — more specific than Article, preferred by Google for blog posts. */
export function blogPostingSchema(opts: {
  title: string;
  description: string;
  image?: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  wordCount?: number;
  tags?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: opts.title,
    description: opts.description,
    image: buildAbsoluteUrl(opts.image || SITE.defaultOgImage),
    datePublished: opts.datePublished,
    dateModified: opts.dateModified || opts.datePublished,
    inLanguage: "vi-VN",
    ...(opts.wordCount ? { wordCount: opts.wordCount } : {}),
    ...(opts.tags ? { keywords: opts.tags.join(", ") } : {}),
    author: {
      "@type": "Organization",
      name: opts.author || SITE.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: {
        "@type": "ImageObject",
        url: buildAbsoluteUrl(SITE.defaultOgImage),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": buildAbsoluteUrl(opts.path),
    },
    isPartOf: {
      "@type": "Blog",
      name: `${SITE.name} Blog`,
      url: buildAbsoluteUrl("/blog"),
    },
  };
}

/** CollectionPage schema for category/tag listing pages. */
export function collectionPageSchema(opts: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: buildAbsoluteUrl(opts.path),
    inLanguage: "vi-VN",
    isPartOf: {
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.url,
    },
  };
}

/** WebSite schema with SearchAction for Google sitelinks searchbox. */
export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.defaultDescription,
    inLanguage: "vi-VN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
