/**
 * @ethos/meta - OG metadata and image generation utilities
 */

/**
 * Generate complete metadata object for Next.js
 *
 * @param {Object} options
 * @param {string} options.title - Page title
 * @param {string} options.description - Page description
 * @param {string} options.url - Canonical URL
 * @param {string} options.image - OG image URL (or will be generated)
 * @param {string} options.siteName - Site name (default: "AI Ethos")
 * @param {string} options.twitterHandle - Twitter handle
 * @param {string} options.type - og:type (default: "website")
 * @param {Object} options.extra - Additional metadata fields
 * @returns {Object} Next.js metadata object
 */
export function generateMetadata({
  title,
  description,
  url,
  image,
  siteName = "AI Ethos",
  twitterHandle = "@aiethos",
  type = "website",
  extra = {},
}) {
  const ogImage = image || generateOGImageUrl({ title, description });

  return {
    title,
    description,
    metadataBase: new URL(url || "https://theaiethos.com"),

    // Open Graph
    openGraph: {
      title,
      description,
      url,
      siteName,
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...extra.openGraph,
    },

    // Twitter
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: twitterHandle,
      images: [ogImage],
      ...extra.twitter,
    },

    // Additional SEO
    robots: {
      index: true,
      follow: true,
      ...extra.robots,
    },

    // Spread any extra fields
    ...extra,
  };
}

/**
 * Generate OG image URL from parameters
 * Points to the dynamic OG image API route
 *
 * @param {Object} options
 * @param {string} options.title - Title text
 * @param {string} options.description - Description text
 * @param {string} options.appSlug - App slug for styling
 * @param {string} options.color - Brand color
 * @param {string} options.icon - Emoji icon
 * @returns {string} OG image URL
 */
export function generateOGImageUrl({
  title,
  description,
  appSlug,
  color,
  icon,
}) {
  const params = new URLSearchParams();

  if (title) params.set("title", title);
  if (description) params.set("desc", description);
  if (appSlug) params.set("app", appSlug);
  if (color) params.set("color", color.replace("#", ""));
  if (icon) params.set("icon", icon);

  return `/api/og?${params.toString()}`;
}

/**
 * Generate app-specific metadata
 * Convenience function for Launchpad apps
 *
 * @param {Object} app - App configuration object
 * @returns {Object} Next.js metadata object
 */
export function generateAppMetadata(app) {
  return generateMetadata({
    title: app.meta?.title || `${app.name} - ${app.tagline}`,
    description: app.meta?.description || app.description,
    url: `https://${app.slug}.theaiethos.com`,
    image:
      app.meta?.ogImage ||
      generateOGImageUrl({
        title: app.name,
        description: app.tagline,
        appSlug: app.slug,
        color: app.color,
        icon: app.icon,
      }),
    siteName: app.name,
  });
}

/**
 * Default metadata for the AI Ethos site
 */
export const defaultMetadata = {
  title: "AI Ethos - Solo AI Product Incubator",
  description:
    "Building AI-powered tools that solve real problems. Rapid experimentation, transparent building.",
  siteName: "AI Ethos",
  twitterHandle: "@aiethos",
};

/**
 * JSON-LD structured data generators
 */
export const structuredData = {
  /**
   * Generate Organization schema
   */
  organization: (options = {}) => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: options.name || "AI Ethos",
    url: options.url || "https://theaiethos.com",
    logo: options.logo || "https://theaiethos.com/logo.png",
    sameAs: options.socialLinks || [],
  }),

  /**
   * Generate SoftwareApplication schema
   */
  softwareApp: (app) => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    description: app.description,
    url: `https://${app.slug}.theaiethos.com`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: app.pricing
      ? {
          "@type": "Offer",
          price: app.pricing.price,
          priceCurrency: app.pricing.currency || "USD",
        }
      : undefined,
  }),

  /**
   * Generate BreadcrumbList schema
   */
  breadcrumbs: (items) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),
};
