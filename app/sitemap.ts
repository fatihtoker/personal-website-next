import { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/projects/repository";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl().origin;
  const projects = getAllProjects();

  const routes = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${siteUrl}/lingolink`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  const projectRoutes = projects
    .map((project) => {
      // Exclude LingoLink as it has a custom entry above
      if (project.slug === "lingolink") return null;

      const isPlayable = project.kind === "playable-game";
      const path = isPlayable
        ? `/games/${project.slug}`
        : (project.detailHref || `/projects/${project.slug}`);

      // Only generate standard local pages
      if (path.startsWith("http")) return null;

      return {
        url: `${siteUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  return [...routes, ...projectRoutes];
}
