export const siteConfig = {
  name: "Synth",
  tagline: "AI agents for every customer conversation",
  title: "Synth - An Astro theme for AI products",
  description:
    "Synth builds, runs and grades AI agents across chat, voice and email, with every decision traced and every answer yours to change.",
  siteUrl: "https://synth.xocoweb.workers.dev",
  language: "en",
  locale: "en_US",
  dateLocale: "en-US",
  socialImage: "/og-image.png",
  email: "hello@example.com",
  /** The two calls to action in the header, the hero and the closing band. */
  actions: {
    primary: { label: "Book a demo", href: "/contact/" },
    signIn: { label: "Sign in", href: "https://app.example.com/" },
  },
  /** The contact page form. It stays disabled until `enabled` is true and `action` is set. */
  contact: {
    enabled: false,
    action: "",
    method: "post",
  },
  newsletter: {
    enabled: false,
    action: "",
    method: "post",
    emailFieldName: "email",
    title: "Product notes, once a month.",
    description: "What shipped, what we measured, and what we got wrong. No tracking pixels.",
  },
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com" },
    { label: "X", href: "https://x.com" },
    { label: "GitHub", href: "https://github.com" },
    { label: "YouTube", href: "https://www.youtube.com" },
    { label: "RSS", href: "/rss.xml" },
  ],
};

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface MenuColumn {
  /** Left off, the column continues the one before it. */
  title?: string;
  links: NavLink[];
}

/**
 * `tour` shows a live dither panel linking to the product tour, `story` the
 * first testimonial from `src/config/home.ts`, `latest` the newest blog post.
 */
export type MenuFeature = "tour" | "story" | "latest";

export type NavItem =
  { label: string; href: string } | { label: string; columns: MenuColumn[]; feature?: MenuFeature };

export const navigation: NavItem[] = [
  {
    label: "Platform",
    feature: "tour",
    columns: [
      {
        title: "Build",
        links: [
          {
            label: "Agent Studio",
            href: "/#build",
            description: "Persona, tone and limits in one place",
          },
          {
            label: "Knowledge",
            href: "/#build",
            description: "Answers grounded in your docs and data",
          },
          {
            label: "Flows",
            href: "/#build",
            description: "Fixed steps for refunds, claims and bookings",
          },
        ],
      },
      {
        title: "Run",
        links: [
          {
            label: "Chat and messaging",
            href: "/#run",
            description: "Web, in-app, WhatsApp and SMS",
          },
          {
            label: "Voice",
            href: "/#run",
            description: "Phone agents that answer in under a second",
          },
          { label: "Email", href: "/#run", description: "Threads triaged, answered and tagged" },
        ],
      },
      {
        title: "Grade",
        links: [
          {
            label: "Evaluations",
            href: "/#grade",
            description: "Every conversation scored on your rubric",
          },
          { label: "Traces", href: "/#traces", description: "Replay each decision, step by step" },
          {
            label: "Guardrails",
            href: "/#security",
            description: "Policy checks before anything is sent",
          },
        ],
      },
    ],
  },
  {
    label: "Solutions",
    feature: "story",
    columns: [
      {
        title: "Industries",
        links: [
          {
            label: "Retail",
            href: "/industries/retail/",
            description: "Orders, returns and product questions",
          },
          {
            label: "Banking",
            href: "/#banking",
            description: "Card, payment and dispute servicing",
          },
          {
            label: "Insurance",
            href: "/#insurance",
            description: "First notice of loss to claim status",
          },
        ],
      },
      {
        links: [
          { label: "Telecom", href: "/#telecom", description: "Plans, outages and device support" },
          { label: "Travel", href: "/#travel", description: "Rebooking and disruption at scale" },
          {
            label: "Healthcare",
            href: "/#healthcare",
            description: "Scheduling and patient questions",
          },
        ],
      },
      {
        title: "Proof",
        links: [
          {
            label: "Customer stories",
            href: "/#customers",
            description: "What changed after launch",
          },
          { label: "Security", href: "/#security", description: "Controls, residency and audits" },
          {
            label: "Integrations",
            href: "/#integrations",
            description: "Models, helpdesks and data",
          },
        ],
      },
    ],
  },
  {
    label: "Resources",
    feature: "latest",
    columns: [
      {
        title: "Blog",
        links: [
          { label: "All posts", href: "/blog/", description: "Everything we publish" },
          {
            label: "Engineering",
            href: "/blog/topic/engineering/",
            description: "How the system is built",
          },
          {
            label: "Research",
            href: "/blog/topic/research/",
            description: "Evaluations and experiments",
          },
        ],
      },
      {
        title: "Learn",
        links: [
          { label: "Guides", href: "/blog/topic/guides/", description: "Step-by-step playbooks" },
          { label: "Product", href: "/blog/topic/product/", description: "What shipped and why" },
          { label: "Questions", href: "/#faq", description: "Answers to the usual ones" },
        ],
      },
    ],
  },
  { label: "Pricing", href: "/pricing/" },
  { label: "Blog", href: "/blog/" },
  { label: "About", href: "/about/" },
  { label: "Careers", href: "/careers/" },
];

export const footerNavigation: MenuColumn[] = [
  {
    title: "Platform",
    links: [
      { label: "Build", href: "/#build" },
      { label: "Run", href: "/#run" },
      { label: "Grade", href: "/#grade" },
      { label: "Traces", href: "/#traces" },
      { label: "Integrations", href: "/#integrations" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Retail", href: "/industries/retail/" },
      { label: "Banking", href: "/#banking" },
      { label: "Insurance", href: "/#insurance" },
      { label: "Telecom", href: "/#telecom" },
      { label: "Travel", href: "/#travel" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog/" },
      { label: "Search", href: "/blog/search/" },
      { label: "RSS", href: "/rss.xml" },
      { label: "Questions", href: "/#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about/" },
      { label: "Careers", href: "/careers/" },
      { label: "Customers", href: "/#customers" },
      { label: "Security", href: "/#security" },
      { label: "Pricing", href: "/pricing/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
];
