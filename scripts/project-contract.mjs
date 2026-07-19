import fs from "fs";
import path from "path";
import sharp from "sharp";

export const MAX_COVER_BYTES = 614400; // 600 KB
export const MAX_BUNDLE_BYTES = 50 * 1024 * 1024; // 50 MiB
export const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MiB

export const ALLOWED_EXTENSIONS = new Set([
  ".html", ".js", ".css", ".json", ".webmanifest",
  ".png", ".jpg", ".jpeg", ".webp", ".svg", ".ico",
  ".mp3", ".ogg", ".wav", ".m4a", ".mp4", ".webm",
  ".woff", ".woff2", ".ttf", ".wasm", ".bin", ".glb", ".gltf"
]);

// Helper to validate the projects.json manifest shape
export function validateDescriptor(data) {
  if (data.schemaVersion !== 1) {
    throw new Error("Invalid schemaVersion: must be 1");
  }
  if (typeof data.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
    throw new Error(`Invalid slug format: "${data.slug}"`);
  }
  if (typeof data.title !== "string" || data.title.trim() === "") {
    throw new Error("Missing or invalid title");
  }
  if (typeof data.cardSummary !== "string" || data.cardSummary.trim() === "") {
    throw new Error("Missing or invalid cardSummary");
  }
  if (typeof data.description !== "string" || data.description.trim() === "") {
    throw new Error("Missing or invalid description");
  }
  if (typeof data.seoTitle !== "string" || data.seoTitle.trim() === "") {
    throw new Error("Missing or invalid seoTitle");
  }
  if (typeof data.seoDescription !== "string" || data.seoDescription.trim() === "") {
    throw new Error("Missing or invalid seoDescription");
  }
  if (typeof data.genre !== "string" || data.genre.trim() === "") {
    throw new Error("Missing or invalid genre");
  }
  if (!Array.isArray(data.tags) || data.tags.some(t => typeof t !== "string")) {
    throw new Error("Missing or invalid tags");
  }
  if (!Array.isArray(data.supportedDevices) || data.supportedDevices.some(d => !["desktop", "tablet", "mobile"].includes(d))) {
    throw new Error("Missing or invalid supportedDevices");
  }
  if (!Array.isArray(data.controls) || data.controls.some(c => !["keyboard", "mouse", "touch", "gamepad"].includes(c))) {
    throw new Error("Missing or invalid controls");
  }
  if (typeof data.recommendedAspectRatio !== "string" || data.recommendedAspectRatio.trim() === "") {
    throw new Error("Missing or invalid recommendedAspectRatio");
  }
  if (!data.minimumViewport || typeof data.minimumViewport.width !== "number" || typeof data.minimumViewport.height !== "number") {
    throw new Error("Missing or invalid minimumViewport");
  }
  if (typeof data.coverAlt !== "string" || data.coverAlt.trim() === "") {
    throw new Error("Missing or invalid coverAlt");
  }
}

// Scans HTML/CSS file content for root-absolute URLs (excluding external and data/blob URIs)
export function scanContentForRootAbsoluteUrls(content, relativePath) {
  const srcRegex = /\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  const hrefRegex = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  const urlRegex = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/gi;

  const checkUrl = (url, attr) => {
    if (!url) return;
    url = url.trim();
    if (url.startsWith("/") && !url.startsWith("//")) {
      throw new Error(`Forbidden root-absolute URL "${url}" found in ${relativePath} (${attr})`);
    }
  };

  let match;
  while ((match = srcRegex.exec(content)) !== null) {
    checkUrl(match[1] || match[2], "src");
  }
  while ((match = hrefRegex.exec(content)) !== null) {
    checkUrl(match[1] || match[2], "href");
  }
  while ((match = urlRegex.exec(content)) !== null) {
    checkUrl(match[1] || match[2] || match[3], "url");
  }
}

// Validates a single publication source package before import
export async function validatePublication(sourceDir) {
  // 1. Read & Validate portfolio.json
  const descriptorPath = path.join(sourceDir, "portfolio.json");
  if (!fs.existsSync(descriptorPath)) {
    throw new Error(`Missing manifest at ${descriptorPath}`);
  }
  let descriptor;
  try {
    descriptor = JSON.parse(fs.readFileSync(descriptorPath, "utf-8"));
  } catch (err) {
    throw new Error(`Failed to parse portfolio.json: ${err.message}`);
  }
  validateDescriptor(descriptor);

  // 2. Validate cover WebP dimensions & file size
  const coverPath = path.join(sourceDir, "portfolio-cover.webp");
  if (!fs.existsSync(coverPath)) {
    throw new Error(`Missing cover image at ${coverPath}`);
  }
  const coverStats = fs.statSync(coverPath);
  if (coverStats.size > MAX_COVER_BYTES) {
    throw new Error(`Cover image exceeds max size of ${MAX_COVER_BYTES} bytes (got ${coverStats.size})`);
  }
  let coverMeta;
  try {
    coverMeta = await sharp(coverPath).metadata();
  } catch (err) {
    throw new Error(`Cover image is not a valid WebP/image: ${err.message}`);
  }
  if (coverMeta.format !== "webp") {
    throw new Error(`Cover image format must be webp, got "${coverMeta.format}"`);
  }
  if (coverMeta.width !== 1600 || coverMeta.height !== 900) {
    throw new Error(`Cover image resolution must be exactly 1600x900, got ${coverMeta.width}x${coverMeta.height}`);
  }

  // 3. Validate dist bundles
  const distDir = path.join(sourceDir, "dist");
  if (!fs.existsSync(distDir)) {
    throw new Error(`Missing dist directory at ${distDir}`);
  }
  const indexHtmlPath = path.join(distDir, "index.html");
  if (!fs.existsSync(indexHtmlPath)) {
    throw new Error(`Missing dist/index.html`);
  }

  let totalBundleBytes = 0;
  function scanDir(dir) {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const relativeToDist = path.relative(distDir, fullPath);
      const lstat = fs.lstatSync(fullPath);

      if (lstat.isSymbolicLink()) {
        throw new Error(`Symbolic link forbidden: ${relativeToDist}`);
      }

      if (lstat.isDirectory()) {
        scanDir(fullPath);
      } else if (lstat.isFile()) {
        const size = lstat.size;
        if (size > MAX_FILE_BYTES) {
          throw new Error(`File ${relativeToDist} exceeds max file size of ${MAX_FILE_BYTES} bytes (got ${size})`);
        }
        totalBundleBytes += size;
        if (totalBundleBytes > MAX_BUNDLE_BYTES) {
          throw new Error(`Total bundle size exceeds max bundle size of ${MAX_BUNDLE_BYTES} bytes`);
        }

        const ext = path.extname(entry).toLowerCase();
        if (ext === ".map") {
          throw new Error(`Source maps are forbidden: ${relativeToDist}`);
        }
        if (!ALLOWED_EXTENSIONS.has(ext)) {
          throw new Error(`Disallowed file extension "${ext}" in bundle file ${relativeToDist}`);
        }

        if (ext === ".html" || ext === ".css") {
          const content = fs.readFileSync(fullPath, "utf-8");
          scanContentForRootAbsoluteUrls(content, relativeToDist);
        }
      }
    }
  }

  scanDir(distDir);
  return descriptor;
}

// Validates the entire portfolio repository manifest and assets
export async function validateSite(targetRoot) {
  const projectsJsonPath = path.join(targetRoot, "content", "projects.json");
  if (!fs.existsSync(projectsJsonPath)) {
    throw new Error(`Manifest not found at ${projectsJsonPath}`);
  }

  let projects;
  try {
    projects = JSON.parse(fs.readFileSync(projectsJsonPath, "utf-8"));
  } catch (err) {
    throw new Error(`Failed to parse content/projects.json: ${err.message}`);
  }

  if (!Array.isArray(projects)) {
    throw new Error("content/projects.json must be a JSON array");
  }

  // Validate duplicate slugs
  const seenSlugs = new Set();

  for (const project of projects) {
    if (seenSlugs.has(project.slug)) {
      throw new Error(`Duplicate project slug detected: "${project.slug}"`);
    }
    seenSlugs.add(project.slug);

    // Validate cover exists and matches requirements
    const coverPath = path.join(targetRoot, "public", project.coverSrc);
    if (!fs.existsSync(coverPath)) {
      throw new Error(`Cover image not found for slug "${project.slug}" at ${coverPath}`);
    }
    const coverStats = fs.statSync(coverPath);
    if (coverStats.size > MAX_COVER_BYTES) {
      throw new Error(`Cover image for "${project.slug}" exceeds max size of ${MAX_COVER_BYTES} bytes`);
    }
    let coverMeta;
    try {
      coverMeta = await sharp(coverPath).metadata();
    } catch (err) {
      throw new Error(`Cover image for "${project.slug}" is not a valid image: ${err.message}`);
    }
    if (coverMeta.format !== "webp") {
      throw new Error(`Cover image for "${project.slug}" must be webp, got "${coverMeta.format}"`);
    }
    if (coverMeta.width !== 1600 || coverMeta.height !== 900) {
      throw new Error(`Cover image for "${project.slug}" must be exactly 1600x900, got ${coverMeta.width}x${coverMeta.height}`);
    }

    // Playable bundle validation
    if (project.kind === "playable-game") {
      const bundleDir = path.dirname(path.join(targetRoot, "public", project.playablePath));
      if (!fs.existsSync(bundleDir)) {
        throw new Error(`Playable bundle directory not found for slug "${project.slug}" at ${bundleDir}`);
      }
      const indexHtmlPath = path.join(bundleDir, "index.html");
      if (!fs.existsSync(indexHtmlPath)) {
        throw new Error(`Playable index.html not found for slug "${project.slug}" at ${indexHtmlPath}`);
      }

      // Check bundle contents recursively
      let totalBundleBytes = 0;
      const scanBundleDir = (dir) => {
        const entries = fs.readdirSync(dir);
        for (const entry of entries) {
          const fullPath = path.join(dir, entry);
          const relativeToBundle = path.relative(bundleDir, fullPath);
          const lstat = fs.lstatSync(fullPath);

          if (lstat.isSymbolicLink()) {
            throw new Error(`Symbolic link forbidden in playable "${project.slug}": ${relativeToBundle}`);
          }

          if (lstat.isDirectory()) {
            scanBundleDir(fullPath);
          } else if (lstat.isFile()) {
            const size = lstat.size;
            if (size > MAX_FILE_BYTES) {
              throw new Error(`File ${relativeToBundle} in playable "${project.slug}" exceeds max file size`);
            }
            totalBundleBytes += size;
            if (totalBundleBytes > MAX_BUNDLE_BYTES) {
              throw new Error(`Playable "${project.slug}" total bundle size exceeds max bundle size`);
            }

            const ext = path.extname(entry).toLowerCase();
            if (ext === ".map") {
              throw new Error(`Source maps forbidden in playable "${project.slug}": ${relativeToBundle}`);
            }
            if (!ALLOWED_EXTENSIONS.has(ext)) {
              throw new Error(`Disallowed file extension "${ext}" in playable "${project.slug}": ${relativeToBundle}`);
            }

            if (ext === ".html" || ext === ".css") {
              const content = fs.readFileSync(fullPath, "utf-8");
              scanContentForRootAbsoluteUrls(content, relativeToBundle);
            }
          }
        }
      };
      scanBundleDir(bundleDir);
    }
  }
}
