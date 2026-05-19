/**
 * 外部链接常量 — 修改仓库地址时只需更新 GITHUB_REPO
 */
const GITHUB_REPO = "https://github.com/your-username/agentic-flow";

export const externalLinks = {
  /** GitHub 仓库首页 */
  githubRepo: GITHUB_REPO,
  /** 仓库 README（「Read the Docs」、导航 Docs 等） */
  docsReadme: `${GITHUB_REPO}#readme`,
} as const;
