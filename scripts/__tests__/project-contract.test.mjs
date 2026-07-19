import { describe, test, expect, beforeAll } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import sharp from "sharp";
import { validatePublication } from "../project-contract.mjs";

const FIXTURE_DIR = path.resolve("scripts/__tests__/fixtures/valid-game");

// Helper to create a temp copy of the valid fixture
function createTempFixture() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-test-"));
  
  // Copy portfolio.json
  fs.writeFileSync(
    path.join(tempDir, "portfolio.json"),
    fs.readFileSync(path.join(FIXTURE_DIR, "portfolio.json"))
  );
  
  // Copy portfolio-cover.webp
  fs.writeFileSync(
    path.join(tempDir, "portfolio-cover.webp"),
    fs.readFileSync(path.join(FIXTURE_DIR, "portfolio-cover.webp"))
  );

  // Copy dist folder contents
  fs.mkdirSync(path.join(tempDir, "dist"));
  fs.writeFileSync(
    path.join(tempDir, "dist", "index.html"),
    fs.readFileSync(path.join(FIXTURE_DIR, "dist", "index.html"))
  );

  fs.mkdirSync(path.join(tempDir, "dist", "assets"));
  fs.writeFileSync(
    path.join(tempDir, "dist", "assets", "game.js"),
    fs.readFileSync(path.join(FIXTURE_DIR, "dist", "assets", "game.js"))
  );

  return tempDir;
}

// Clean up temp directory recursively
function cleanupTempFixture(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

describe("project-contract validation rules", () => {
  test("valid fixture passes validation cleanly", async () => {
    const tempDir = createTempFixture();
    try {
      const descriptor = await validatePublication(tempDir);
      expect(descriptor.slug).toBe("valid-game");
    } finally {
      cleanupTempFixture(tempDir);
    }
  });

  test("missing manifest file fails validation", async () => {
    const tempDir = createTempFixture();
    try {
      fs.unlinkSync(path.join(tempDir, "portfolio.json"));
      await expect(validatePublication(tempDir)).rejects.toThrow("Missing manifest");
    } finally {
      cleanupTempFixture(tempDir);
    }
  });

  test("unsafe slug format fails", async () => {
    const tempDir = createTempFixture();
    try {
      const desc = JSON.parse(fs.readFileSync(path.join(tempDir, "portfolio.json"), "utf-8"));
      desc.slug = "../escape";
      fs.writeFileSync(path.join(tempDir, "portfolio.json"), JSON.stringify(desc));
      await expect(validatePublication(tempDir)).rejects.toThrow("Invalid slug format");
    } finally {
      cleanupTempFixture(tempDir);
    }
  });

  test("missing cover image fails", async () => {
    const tempDir = createTempFixture();
    try {
      fs.unlinkSync(path.join(tempDir, "portfolio-cover.webp"));
      await expect(validatePublication(tempDir)).rejects.toThrow("Missing cover image");
    } finally {
      cleanupTempFixture(tempDir);
    }
  });

  test("incorrect cover resolution fails", async () => {
    const tempDir = createTempFixture();
    try {
      // Create 1601x900 image
      await sharp({
        create: { width: 1601, height: 900, channels: 3, background: "#223344" }
      }).webp().toFile(path.join(tempDir, "portfolio-cover.webp"));

      await expect(validatePublication(tempDir)).rejects.toThrow("Cover image resolution must be exactly 1600x900");
    } finally {
      cleanupTempFixture(tempDir);
    }
  });

  test("excessive cover file size fails", async () => {
    const tempDir = createTempFixture();
    try {
      // Append large dummy bytes to make it > 600 KB (614400 bytes)
      const validCoverBytes = fs.readFileSync(path.join(tempDir, "portfolio-cover.webp"));
      const bigBuffer = Buffer.concat([validCoverBytes, Buffer.alloc(700 * 1024)]);
      fs.writeFileSync(path.join(tempDir, "portfolio-cover.webp"), bigBuffer);

      await expect(validatePublication(tempDir)).rejects.toThrow("Cover image exceeds max size");
    } finally {
      cleanupTempFixture(tempDir);
    }
  });

  test("missing index.html fails", async () => {
    const tempDir = createTempFixture();
    try {
      fs.unlinkSync(path.join(tempDir, "dist", "index.html"));
      await expect(validatePublication(tempDir)).rejects.toThrow("Missing dist/index.html");
    } finally {
      cleanupTempFixture(tempDir);
    }
  });

  test("disallowed extension in bundle fails", async () => {
    const tempDir = createTempFixture();
    try {
      fs.writeFileSync(path.join(tempDir, "dist", "badfile.exe"), "malicious code");
      await expect(validatePublication(tempDir)).rejects.toThrow("Disallowed file extension");
    } finally {
      cleanupTempFixture(tempDir);
    }
  });

  test("source maps (.map files) are forbidden", async () => {
    const tempDir = createTempFixture();
    try {
      fs.writeFileSync(path.join(tempDir, "dist", "game.js.map"), "{}");
      await expect(validatePublication(tempDir)).rejects.toThrow("Source maps are forbidden");
    } finally {
      cleanupTempFixture(tempDir);
    }
  });

  test("symbolic links are forbidden", async () => {
    const tempDir = createTempFixture();
    try {
      fs.symlinkSync(
        path.join(tempDir, "dist", "index.html"),
        path.join(tempDir, "dist", "link.html")
      );
      await expect(validatePublication(tempDir)).rejects.toThrow("Symbolic link forbidden");
    } finally {
      cleanupTempFixture(tempDir);
    }
  });

  test("root-absolute URLs in HTML/CSS are forbidden", async () => {
    const tempDir = createTempFixture();
    try {
      fs.writeFileSync(
        path.join(tempDir, "dist", "index.html"),
        `<!doctype html><html><body><script src="/absolute/path.js"></script></body></html>`
      );
      await expect(validatePublication(tempDir)).rejects.toThrow("Forbidden root-absolute URL");
    } finally {
      cleanupTempFixture(tempDir);
    }
  });

  test("file size above 20 MiB fails", async () => {
    const tempDir = createTempFixture();
    try {
      // 21 MiB file
      const bigFile = Buffer.alloc(21 * 1024 * 1024);
      fs.writeFileSync(path.join(tempDir, "dist", "big.js"), bigFile);
      await expect(validatePublication(tempDir)).rejects.toThrow("exceeds max file size");
    } finally {
      cleanupTempFixture(tempDir);
    }
  });
});
