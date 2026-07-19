import Hero from "@/components/home/Hero";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import ProjectCatalog from "@/components/home/ProjectCatalog";
import { getAllProjects } from "@/lib/projects/repository";

export default function Home() {
  const projects = getAllProjects();

  return (
    <>
      <Hero />
      <FeaturedProjects projects={projects} />
      <ProjectCatalog projects={projects} />
    </>
  );
}
