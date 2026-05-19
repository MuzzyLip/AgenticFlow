import { externalLinks } from "./links";

/** 锚点与外部链接（文案由 i18n 字典提供） */
export const navHrefs = {
  features: "#features",
  docs: externalLinks.docsReadme,
} as const;

export const footerHrefs = {
  features: "#features",
  documentation: externalLinks.docsReadme,
  github: externalLinks.githubRepo,
  apiReference: "#api",
  guides: "#guides",
  about: "#about",
  contributing: `${externalLinks.githubRepo}/blob/main/CONTRIBUTING.md`,
  license: "#license",
  privacy: "#privacy",
  security: "#security",
  contact: "#contact",
} as const;

export const socialLinks = [
  { label: "Twitter", href: "https://twitter.com" },
  { label: "GitHub", href: externalLinks.githubRepo },
  { label: "LinkedIn", href: "https://linkedin.com" },
] as const;
