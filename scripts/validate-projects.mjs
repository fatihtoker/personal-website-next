import fs from "fs";
import path from "path";
import { validateSite } from "./project-contract.mjs";

async function main() {
  try {
    const targetRoot = process.cwd();
    await validateSite(targetRoot);

    const manifestPath = path.join(targetRoot, "content", "projects.json");
    const projects = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    const playableCount = projects.filter(p => p.kind === "playable-game").length;
    const totalCount = projects.length;

    console.log(`Site validation successful: validated ${totalCount} projects (${playableCount} playable games).`);
    process.exit(0);
  } catch (err) {
    console.error("Site validation failed!");
    console.error(err.stack || err.message || err);
    process.exit(1);
  }
}

main();
