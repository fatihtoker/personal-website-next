import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl().origin;
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/games/*/play", "/playables/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
