import projectsData from "@/content/projects.json";
import { projectManifestSchema, Project, PlayableGame } from "./schema";

// Parse projects manifest at startup
const parsedProjects = projectManifestSchema.parse(projectsData);

// Sort once by sortOrder ascending
const sortedProjects = [...parsedProjects].sort((a, b) => a.sortOrder - b.sortOrder);

export function getAllProjects(): Project[] {
  return sortedProjects;
}

export function getFeaturedProjects(): Project[] {
  return sortedProjects.filter(p => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return sortedProjects.find(p => p.slug === slug);
}

export function getPlayableGameBySlug(slug: string): PlayableGame | undefined {
  const project = getProjectBySlug(slug);
  if (project?.kind === "playable-game") {
    return project;
  }
  return undefined;
}
