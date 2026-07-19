import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath, pathToFileURL } from "url";
import { validatePublication, validateSite } from "./project-contract.mjs";

// Helper to recursively compute size of a directory
function getDirectorySize(dir) {
  let size = 0;
  if (!fs.existsSync(dir)) return size;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      size += getDirectorySize(fullPath);
    } else if (entry.isFile()) {
      size += fs.statSync(fullPath).size;
    }
  }
  return size;
}

export async function importGame({ sourceDir, sourceRepository, sourceCommit, targetRoot = process.cwd() }) {
  if (!sourceDir || !sourceRepository || !sourceCommit) {
    throw new Error("Missing required parameters: sourceDir, sourceRepository, and sourceCommit are required.");
  }

  const absoluteSourceDir = path.resolve(sourceDir);
  const absoluteTargetRoot = path.resolve(targetRoot);

  // 1. Validate the source package first
  const descriptor = await validatePublication(absoluteSourceDir);
  const slug = descriptor.slug;

  // 2. Prepare staging directory under target root
  const stagingName = `import-${crypto.randomBytes(8).toString("hex")}`;
  const stagingDir = path.join(absoluteTargetRoot, ".portfolio-import", stagingName);
  const stagingCoversDir = path.join(stagingDir, "covers");
  const stagingPlayablesDir = path.join(stagingDir, "playables");

  fs.mkdirSync(stagingCoversDir, { recursive: true });
  fs.mkdirSync(stagingPlayablesDir, { recursive: true });

  // Staged asset paths
  const stagedCoverPath = path.join(stagingCoversDir, `${slug}.webp`);
  const stagedBundlePath = path.join(stagingPlayablesDir, slug);

  // Copy assets to staging
  fs.copyFileSync(path.join(absoluteSourceDir, "portfolio-cover.webp"), stagedCoverPath);
  fs.cpSync(path.join(absoluteSourceDir, "dist"), stagedBundlePath, { recursive: true });

  const bundleBytes = getDirectorySize(stagedBundlePath);

  // 3. Load target manifest content/projects.json
  const projectsJsonPath = path.join(absoluteTargetRoot, "content", "projects.json");
  let projects = [];
  let oldManifestText = "[]";

  if (fs.existsSync(projectsJsonPath)) {
    oldManifestText = fs.readFileSync(projectsJsonPath, "utf-8");
    try {
      projects = JSON.parse(oldManifestText);
    } catch (err) {
      throw new Error(`Failed to parse target projects.json: ${err.message}`);
    }
  }

  // Find index of existing project
  const projectIndex = projects.findIndex((p) => p.slug === slug);
  const mode = projectIndex >= 0 ? "update" : "import";

  // Compute fields based on mode
  let featured = false;
  let sortOrder = 10;
  let publishedAt = process.env.SOURCE_DATE || new Date().toISOString().split("T")[0];
  let detailHref = undefined;

  if (mode === "update") {
    const existing = projects[projectIndex];
    featured = existing.featured ?? false;
    sortOrder = existing.sortOrder ?? 10;
    publishedAt = existing.publishedAt ?? publishedAt;
    detailHref = existing.detailHref;
  } else {
    // New import: sortOrder is the next multiple of 10 after current maximum
    const maxSort = projects.reduce((max, p) => (p.sortOrder > max ? p.sortOrder : max), 0);
    sortOrder = Math.ceil((maxSort + 1) / 10) * 10;
    if (sortOrder === 0) sortOrder = 10;
  }

  // Construct updated project catalog record
  const updatedRecord = {
    schemaVersion: 1,
    kind: "playable-game",
    slug,
    title: descriptor.title,
    cardSummary: descriptor.cardSummary,
    description: descriptor.description,
    category: "game",
    tags: descriptor.tags,
    coverSrc: `/project-covers/${slug}.webp`,
    coverAlt: descriptor.coverAlt,
    publishedAt,
    featured,
    sortOrder,
    seo: {
      title: descriptor.seoTitle,
      description: descriptor.seoDescription
    },
    playablePath: `/playables/${slug}/index.html`,
    supportedDevices: descriptor.supportedDevices,
    controls: descriptor.controls,
    recommendedAspectRatio: descriptor.recommendedAspectRatio,
    minimumViewport: descriptor.minimumViewport,
    source: {
      repository: sourceRepository,
      commit: sourceCommit
    }
  };

  if (detailHref) {
    updatedRecord.detailHref = detailHref;
  }

  // Update target projects array
  if (mode === "update") {
    projects[projectIndex] = updatedRecord;
  } else {
    projects.push(updatedRecord);
    // Maintain manifest sorting by sortOrder ascending
    projects.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  // Final public asset paths
  const finalCoverPath = path.join(absoluteTargetRoot, "public", "project-covers", `${slug}.webp`);
  const finalBundlePath = path.join(absoluteTargetRoot, "public", "playables", slug);

  // Backup paths in case validation fails
  const backupCoverPath = finalCoverPath + ".bak";
  const backupBundlePath = finalBundlePath + ".bak";

  let createdCoverBackup = false;
  let createdBundleBackup = false;

  try {
    // Ensure public parent directories exist
    fs.mkdirSync(path.dirname(finalCoverPath), { recursive: true });
    fs.mkdirSync(path.dirname(finalBundlePath), { recursive: true });

    // Step A: Create backups of existing public assets
    if (fs.existsSync(finalCoverPath)) {
      if (fs.existsSync(backupCoverPath)) fs.unlinkSync(backupCoverPath);
      fs.renameSync(finalCoverPath, backupCoverPath);
      createdCoverBackup = true;
    }
    if (fs.existsSync(finalBundlePath)) {
      if (fs.existsSync(backupBundlePath)) fs.rmSync(backupBundlePath, { recursive: true, force: true });
      fs.renameSync(finalBundlePath, backupBundlePath);
      createdBundleBackup = true;
    }

    // Step B: Move staged assets to final target paths
    fs.renameSync(stagedCoverPath, finalCoverPath);
    fs.renameSync(stagedBundlePath, finalBundlePath);

    // Step C: Atomic projects.json manifest write
    const tempManifestPath = projectsJsonPath + ".tmp";
    fs.writeFileSync(tempManifestPath, JSON.stringify(projects, null, 2), "utf-8");
    fs.renameSync(tempManifestPath, projectsJsonPath);

    // Step D: Validate the entire target site post-mutation
    try {
      await validateSite(absoluteTargetRoot);
    } catch (validationErr) {
      throw new Error(`Import validation failed, site state is invalid: ${validationErr.message}`);
    }

    // If successful, clean up backups
    if (createdCoverBackup) fs.unlinkSync(backupCoverPath);
    if (createdBundleBackup) fs.rmSync(backupBundlePath, { recursive: true, force: true });

    return { mode, slug, bundleBytes };
  } catch (err) {
    // Transaction failed - Rollback atomic changes
    try {
      // Remove staging/final files that were partially copied
      if (fs.existsSync(finalCoverPath)) fs.unlinkSync(finalCoverPath);
      if (fs.existsSync(finalBundlePath)) fs.rmSync(finalBundlePath, { recursive: true, force: true });

      // Restore backups to original paths
      if (createdCoverBackup) fs.renameSync(backupCoverPath, finalCoverPath);
      if (createdBundleBackup) fs.renameSync(backupBundlePath, finalBundlePath);

      // Restore original projects.json content
      fs.writeFileSync(projectsJsonPath, oldManifestText, "utf-8");
    } catch (rollbackErr) {
      console.error(`CRITICAL: Rollback failed! Repository might be in inconsistent state: ${rollbackErr.message}`);
    }
    throw err;
  } finally {
    // Clean up random staging folder
    if (fs.existsSync(stagingDir)) {
      fs.rmSync(stagingDir, { recursive: true, force: true });
    }
    // Clean up empty parent .portfolio-import if empty
    const parentImportDir = path.join(absoluteTargetRoot, ".portfolio-import");
    if (fs.existsSync(parentImportDir) && fs.readdirSync(parentImportDir).length === 0) {
      fs.rmdirSync(parentImportDir);
    }
  }
}

// CLI runner block
const isMain = process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));
if (isMain) {
  const args = process.argv.slice(2);
  const params = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--source" && args[i + 1]) {
      params.source = args[i + 1];
    } else if (args[i] === "--source-repository" && args[i + 1]) {
      params.sourceRepository = args[i + 1];
    } else if (args[i] === "--source-commit" && args[i + 1]) {
      params.sourceCommit = args[i + 1];
    } else if (args[i] === "--target-root" && args[i + 1]) {
      params.targetRoot = args[i + 1];
    }
  }

  try {
    const result = await importGame({
      sourceDir: params.source,
      sourceRepository: params.sourceRepository,
      sourceCommit: params.sourceCommit,
      targetRoot: params.targetRoot
    });
    console.log(`Successfully completed ${result.mode} for game "${result.slug}" (${result.bundleBytes} bytes imported).`);
    process.exit(0);
  } catch (err) {
    console.error(`Import failed: ${err.message}`);
    process.exit(1);
  }
}
