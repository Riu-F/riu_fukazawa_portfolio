"use client";

import type { ReactNode } from "react";

const URL_RE = /(https?:\/\/[^\s<]+[^<.,;:!?\s])/g;

export type AboutTextClassNames = {
  link: string;
  body: string;
  bodyLine: string;
  list: string;
};

export const FOCUS_ANNOTATION_TEXT_CLASSES: AboutTextClassNames = {
  link: "about-focus-annotation__link",
  body: "about-focus-annotation__body",
  bodyLine: "about-focus-annotation__body-line",
  list: "about-focus-annotation__list",
};

export const MOBILE_ABOUT_TEXT_CLASSES: AboutTextClassNames = {
  link: "mobile-about__link",
  body: "mobile-about__body",
  bodyLine: "mobile-about__body-line",
  list: "mobile-about__list",
};

export function textWithLinks(text: string, linkClass: string): ReactNode {
  const parts: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  const re = new RegExp(URL_RE.source, URL_RE.flags);
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      parts.push(text.slice(last, m.index));
    }
    const href = m[1];
    parts.push(
      <a
        key={`${m.index}-${href}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        {href}
      </a>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length ? parts : text;
}

export function AboutDetailBody(params: {
  detailBody: string | undefined;
  classNames: AboutTextClassNames;
}) {
  const { detailBody, classNames: c } = params;
  if (!detailBody?.trim()) return null;
  if (detailBody.includes("\n\n")) {
    const blocks = detailBody
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
    return (
      <div className={c.body}>
        {blocks.map((para, bi) => {
          const lines = para.split(/\n/).map((s) => s.trim()).filter(Boolean);
          if (lines.length <= 1) {
            return (
              <p key={`b-${bi}`}>{textWithLinks(para, c.link)}</p>
            );
          }
          return (
            <ul key={`b-${bi}`} className={c.list}>
              {lines.map((line, li) => (
                <li key={`b-${bi}-l-${li}`}>{textWithLinks(line, c.link)}</li>
              ))}
            </ul>
          );
        })}
      </div>
    );
  }
  const lines = detailBody
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  if (lines.length === 0) return null;
  if (lines.length === 1) {
    return (
      <p className={c.bodyLine}>{textWithLinks(lines[0], c.link)}</p>
    );
  }
  return (
    <ul className={c.list}>
      {lines.map((line, li) => (
        <li key={`l-${li}`}>{textWithLinks(line, c.link)}</li>
      ))}
    </ul>
  );
}

export function AboutDescriptionLead(params: {
  description: string | undefined;
  linkClass: string;
  className?: string;
}) {
  const { description, linkClass, className } = params;
  if (!description?.trim()) return null;
  return (
    <p className={className}>{textWithLinks(description, linkClass)}</p>
  );
}
