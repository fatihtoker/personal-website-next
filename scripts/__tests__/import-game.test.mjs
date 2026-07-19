import { describe, test, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import { importGame } from "../import-game.mjs";

const FIXTURE_DIR = path.resolve("scripts/__tests__/fixtures/valid-game");

describe("import-game atomic importer pipeline", () => {
  let tempTargetDir;
  let projectsJsonPath;

  beforeEach(() => {
    tempTargetDir = fs.mkdtempSync(path.join(os.tmpdir(), "target-root-"));
    fs.mkdirSync(path.join(tempTargetDir, "content"), { recursive: true });
    projectsJsonPath = path.join(tempTargetDir, "content", "projects.json");
    fs.writeFileSync(projectsJsonPath, "[]", "utf-8");
  });

  afterEach(() => {
    if (fs.existsSync(tempTargetDir)) {
      fs.rmSync(tempTargetDir, { recursive: true, force: true });
    }
  });

  test("new import creates projects record, cover, and bundle successfully", async () => {
    const result = await importGame({
      sourceDir: FIXTURE_DIR,
      sourceRepository: "https://github.com/fatihtoker/idea-generator",
      sourceCommit: "0123456789abcdef0123456789abcdef01234567",
      targetRoot: tempTargetDir
    });

    expect(result.mode).toBe("import");
    expect(result.slug).toBe("valid-game");

    const projects = JSON.parse(fs.readFileSync(projectsJsonPath, "utf-8"));
    expect(projects.length).toBe(1);
    const record = projects[0];
    expect(record.slug).toBe("valid-game");
    expect(record.kind).toBe("playable-game");
    expect(record.featured).toBe(false);
    expect(record.sortOrder).toBe(10);

    const coverPath = path.join(tempTargetDir, "public", "project-covers", "valid-game.webp");
    expect(fs.existsSync(coverPath)).toBe(true);

    const indexPath = path.join(tempTargetDir, "public", "playables", "valid-game", "index.html");
    expect(fs.existsSync(indexPath)).toBe(true);
  });

  test("duplicate import behaves as update, preserving featured and sortOrder", async () => {
    await importGame({
      sourceDir: FIXTURE_DIR,
      sourceRepository: "https://github.com/fatihtoker/idea-generator",
      sourceCommit: "1111111111111111111111111111111111111111",
      targetRoot: tempTargetDir
    });

    let projects = JSON.parse(fs.readFileSync(projectsJsonPath, "utf-8"));
    projects[0].featured = true;
    projects[0].sortOrder = 99;
    projects[0].detailHref = "/bespoke-path";
    fs.writeFileSync(projectsJsonPath, JSON.stringify(projects, null, 2), "utf-8");

    const result = await importGame({
      sourceDir: FIXTURE_DIR,
      sourceRepository: "https://github.com/fatihtoker/idea-generator",
      sourceCommit: "2222222222222222222222222222222222222222",
      targetRoot: tempTargetDir
    });

    expect(result.mode).toBe("update");

    projects = JSON.parse(fs.readFileSync(projectsJsonPath, "utf-8"));
    expect(projects.length).toBe(1);
    const record = projects[0];
    expect(record.featured).toBe(true);
    expect(record.sortOrder).toBe(99);
    expect(record.detailHref).toBe("/bespoke-path");
    expect(record.source.commit).toBe("2222222222222222222222222222222222222222");
  });

  test("invalid import leaves target state byte-for-byte unchanged", async () => {
    await importGame({
      sourceDir: FIXTURE_DIR,
      sourceRepository: "https://github.com/fatihtoker/idea-generator",
      sourceCommit: "1111111111111111111111111111111111111111",
      targetRoot: tempTargetDir
    });

    const manifestBefore = fs.readFileSync(projectsJsonPath, "utf-8");
    const coverPath = path.join(tempTargetDir, "public", "project-covers", "valid-game.webp");
    const coverBefore = fs.readFileSync(coverPath);

    const invalidSourceDir = fs.mkdtempSync(path.join(os.tmpdir(), "invalid-source-"));
    fs.writeFileSync(path.join(invalidSourceDir, "portfolio.json"), JSON.stringify({ slug: "bad-game" }));

    await expect(
      importGame({
        sourceDir: invalidSourceDir,
        sourceRepository: "https://github.com/fatihtoker/idea-generator",
        sourceCommit: "3333333333333333333333333333333333333333",
        targetRoot: tempTargetDir
      })
    ).rejects.toThrow();

    const manifestAfter = fs.readFileSync(projectsJsonPath, "utf-8");
    expect(manifestAfter).toBe(manifestBefore);

    const coverAfter = fs.readFileSync(coverPath);
    expect(coverAfter.equals(coverBefore)).toBe(true);

    fs.rmSync(invalidSourceDir, { recursive: true, force: true });
  });
});
