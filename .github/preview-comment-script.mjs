export function buildPreviewComment(url) {
  return `<!-- portfolio-preview -->
## Portfolio Preview

✅ The full-site Vercel preview is ready: [Open preview](${url})`;
}

export function selectPullRequest(pulls, sha) {
  return pulls.find((pr) => pr.head.sha === sha && pr.state === "open");
}
