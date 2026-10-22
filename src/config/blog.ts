import type { ImageMetadata } from "astro";
import amara from "@/assets/images/team/amara-okafor.jpg";
import daniel from "@/assets/images/team/daniel-reyes.jpg";
import ines from "@/assets/images/team/ines-moreau.jpg";
import tomasz from "@/assets/images/team/tomasz-wrona.jpg";

export const topics = ["Engineering", "Research", "Product", "Guides", "Company"] as const;

export type Topic = (typeof topics)[number];

export const topicSlug = (topic: string) => topic.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export const topicDescriptions: Record<Topic, string> = {
  Engineering: "How the platform is built, run and kept fast.",
  Research: "Evaluations, experiments and the numbers behind them.",
  Product: "What shipped, what changed and why we changed it.",
  Guides: "Step-by-step playbooks for teams putting agents in production.",
  Company: "News, hiring and the occasional opinion.",
};

export interface Author {
  role: string;
  /** Portrait for the byline and the author card, shown in greyscale. */
  photo?: ImageMetadata;
  credit?: { name: string; url: string };
}

/**
 * Keyed by the `author` value in post frontmatter. Names with no entry still
 * build, with the role left off.
 */
export const authors: Record<string, Author> = {
  "Ines Moreau": {
    role: "Head of Research",
    photo: ines,
    credit: { name: "Shovan Datta / Pexels", url: "https://www.pexels.com/photo/20276645/" },
  },
  "Tomasz Wrona": {
    role: "Staff Engineer",
    photo: tomasz,
    credit: { name: "Digvijaysinh Rajput / Pexels", url: "https://www.pexels.com/photo/5214356/" },
  },
  "Amara Okafor": {
    role: "Product Lead",
    photo: amara,
    credit: { name: "Victor Koonoo / Pexels", url: "https://www.pexels.com/photo/22391749/" },
  },
  "Daniel Reyes": {
    role: "Solutions Architect",
    photo: daniel,
    credit: { name: "Natali Wonkaz / Pexels", url: "https://www.pexels.com/photo/9720868/" },
  },
};

/** The call to action under every post. Its button is `siteConfig.actions.primary`. */
export const postCta = {
  eyebrow: "Try it on your queue",
  title: "See what Synth resolves in your first week",
  body: "Bring a week of real transcripts. We will run them through a working agent and show you every step it took.",
};

/** Posts per page on the blog index and topic archives. */
export const POSTS_PER_PAGE = 9;
