import test from "node:test";
import assert from "node:assert";
import { buildPreviewComment, selectPullRequest } from "./preview-comment-script.mjs";

test("buildPreviewComment generates exact markdown template", () => {
  const url = "https://preview.example.vercel.app";
  const expected = `<!-- portfolio-preview -->
## Portfolio Preview

✅ The full-site Vercel preview is ready: [Open preview](https://preview.example.vercel.app)`;
  
  assert.strictEqual(buildPreviewComment(url), expected);
});

test("selectPullRequest finds matching open PR by head SHA", () => {
  const pulls = [
    { number: 1, head: { sha: "111" }, state: "open" },
    { number: 2, head: { sha: "222" }, state: "open" },
    { number: 3, head: { sha: "333" }, state: "closed" }
  ];

  assert.deepStrictEqual(selectPullRequest(pulls, "222"), { number: 2, head: { sha: "222" }, state: "open" });
  assert.strictEqual(selectPullRequest(pulls, "333"), undefined);
  assert.strictEqual(selectPullRequest(pulls, "999"), undefined);
});
