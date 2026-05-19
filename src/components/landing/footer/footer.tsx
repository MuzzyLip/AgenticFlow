"use client";

import { Bot, Github, Linkedin, Twitter } from "lucide-react";

import { useI18n } from "@/hooks";
import { footerHrefs, siteConfig, socialLinks } from "@/utils/landing";

const socialIcons = {
  Twitter,
  GitHub: Github,
  LinkedIn: Linkedin,
} as const;

export function Footer() {
  const { t } = useI18n();

  const footerLinkGroups = [
    {
      title: t.footer.groups.project.title,
      links: [
        { label: t.footer.groups.project.features, href: footerHrefs.features },
        {
          label: t.footer.groups.project.documentation,
          href: footerHrefs.documentation,
        },
        { label: t.footer.groups.project.github, href: footerHrefs.github },
      ],
    },
    {
      title: t.footer.groups.resources.title,
      links: [
        {
          label: t.footer.groups.resources.documentation,
          href: footerHrefs.documentation,
        },
        {
          label: t.footer.groups.resources.apiReference,
          href: footerHrefs.apiReference,
        },
        { label: t.footer.groups.resources.guides, href: footerHrefs.guides },
      ],
    },
    {
      title: t.footer.groups.community.title,
      links: [
        { label: t.footer.groups.community.about, href: footerHrefs.about },
        {
          label: t.footer.groups.community.contributing,
          href: footerHrefs.contributing,
        },
        {
          label: t.footer.groups.community.license,
          href: footerHrefs.license,
        },
      ],
    },
  ];

  const footerLegalLinks = [
    { label: t.footer.legal.privacy, href: footerHrefs.privacy },
    { label: t.footer.legal.security, href: footerHrefs.security },
    { label: t.footer.legal.contact, href: footerHrefs.contact },
  ];

  return (
    <footer className="border-t border-gray-100 bg-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="mb-16 grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <div className="mb-6 flex items-center gap-2">
              <div className="rounded-lg bg-black p-1.5">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight">
                {siteConfig.name}
              </span>
            </div>
            <p className="mb-6 max-w-xs text-gray-500">{t.footer.tagline}</p>
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => {
                const Icon =
                  socialIcons[link.label as keyof typeof socialIcons];
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="text-gray-400 transition-colors hover:text-black"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {footerLinkGroups.map((group) => (
            <div key={group.title}>
              <h4 className="mb-6 font-bold">{group.title}</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                {group.links.map((link) => {
                  const isExternal = link.href.startsWith("http");
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        {...(isExternal
                          ? {
                              target: "_blank",
                              rel: "noopener noreferrer",
                            }
                          : {})}
                        className="transition-colors hover:text-black"
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between border-t border-gray-100 pt-8 text-xs text-gray-400 md:flex-row">
          <p>{t.footer.copyright}</p>
          <div className="mt-4 flex items-center gap-6 md:mt-0">
            {footerLegalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-black"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
