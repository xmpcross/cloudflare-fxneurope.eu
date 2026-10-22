export interface Plan {
  /** Used as the column key in the comparison table. */
  id: string;
  name: string;
  /** Monthly prices in dollars. `null` on both shows "Custom". */
  monthly: number | null;
  annual: number | null;
  description: string;
  /** The short list on the plan card. */
  highlights: string[];
  cta: { label: string; href: string };
  featured?: boolean;
}

/**
 * A comparison cell: `true` is included, `false` is not, and a string is
 * shown as written (a limit, a period, a support level).
 */
export type Cell = boolean | string;

export interface FeatureRow {
  name: string;
  /** A short explanation under the feature name. */
  hint?: string;
  /** One value per plan, in plan order. */
  values: Cell[];
}

export const pricing = {
  title: "Priced per resolved conversation, not per seat",
  lead: "Every plan includes chat, email and voice. You pay for the conversations the agent resolves; hand-offs to your team are always free.",
  annualSaving: "−20%",
  plans: [
    {
      id: "launch",
      name: "Launch",
      monthly: 490,
      annual: 390,
      description: "One agent on one brand, for teams proving the case.",
      highlights: [
        "2,000 resolutions a month",
        "Chat, email and voice",
        "Knowledge sync and flows",
        "Weekly evaluation reports",
      ],
      cta: { label: "Start a pilot", href: "/contact/?topic=pricing" },
    },
    {
      id: "scale",
      name: "Scale",
      monthly: 1900,
      annual: 1520,
      description: "Several agents, full grading and routing across models.",
      highlights: [
        "10,000 resolutions a month",
        "Every conversation graded",
        "Model routing per step",
        "SSO and role-based access",
      ],
      cta: { label: "Book a demo", href: "/contact/?topic=demo" },
      featured: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      monthly: null,
      annual: null,
      description: "Private deployment, custom terms and a named engineer.",
      highlights: [
        "Volume pricing",
        "Private cloud or on-premise",
        "Data residency of your choice",
        "99.95% uptime SLA",
      ],
      cta: { label: "Talk to sales", href: "/contact/?topic=pricing" },
    },
  ] as Plan[],

  compareTitle: "Compare every plan",
  groups: [
    {
      name: "Usage",
      rows: [
        {
          name: "Resolved conversations",
          hint: "Per month, all channels",
          values: ["2,000", "10,000", "Custom"],
        },
        { name: "Agents", values: ["1", "5", "Unlimited"] },
        { name: "Brands", values: ["1", "3", "Unlimited"] },
        { name: "Languages", values: ["38", "38", "38"] },
        { name: "Hand-offs to your team", hint: "Never billed", values: ["Free", "Free", "Free"] },
      ],
    },
    {
      name: "Channels",
      rows: [
        { name: "Web and in-app chat", values: [true, true, true] },
        { name: "Email", values: [true, true, true] },
        { name: "Voice", values: [true, true, true] },
        { name: "WhatsApp and SMS", values: [false, true, true] },
        { name: "Custom channels via API", values: [false, false, true] },
      ],
    },
    {
      name: "Build",
      rows: [
        {
          name: "Knowledge sync",
          hint: "Help centres, PDFs, product feeds",
          values: [true, true, true],
        },
        { name: "Flows", values: ["10", "Unlimited", "Unlimited"] },
        { name: "Model routing per step", values: [false, true, true] },
        { name: "Bring your own model", values: [false, false, true] },
      ],
    },
    {
      name: "Grade",
      rows: [
        {
          name: "Evaluation",
          values: ["Weekly sample", "Every conversation", "Every conversation"],
        },
        { name: "Custom rubrics", values: ["1", "5", "Unlimited"] },
        { name: "Regression suites", values: [false, true, true] },
        { name: "Trace retention", values: ["30 days", "90 days", "Custom"] },
      ],
    },
    {
      name: "Security and admin",
      rows: [
        { name: "PII redaction", values: [true, true, true] },
        { name: "Single sign-on", hint: "SAML and OIDC", values: [false, true, true] },
        { name: "SCIM provisioning", values: [false, false, true] },
        { name: "Audit log export", values: [false, true, true] },
        { name: "Data residency", values: ["EU or US", "EU, US or UK", "Any region"] },
        { name: "Private deployment", values: [false, false, true] },
      ],
    },
    {
      name: "Support",
      rows: [
        { name: "Support", values: ["Email", "Priority chat", "Named engineer"] },
        { name: "Onboarding", values: ["Self-serve", "Guided launch", "Dedicated team"] },
        { name: "Uptime SLA", values: [false, "99.9%", "99.95%"] },
      ],
    },
  ] as { name: string; rows: FeatureRow[] }[],

  faq: {
    title: "Questions about pricing",
    items: [
      {
        q: "What counts as a resolved conversation?",
        a: "One where the customer's issue was closed without a hand-off and they did not come back about the same issue within 72 hours. Hand-offs are never billed.",
      },
      {
        q: "What happens if we go over our plan?",
        a: "Nothing breaks. Extra resolutions are billed at your plan's rate at the end of the month, and we will suggest a move to the next plan if it would cost you less.",
      },
      {
        q: "Can we change plans later?",
        a: "Yes, at any time. Upgrades apply straight away and are prorated; downgrades take effect at the next billing date.",
      },
      {
        q: "How does annual billing work?",
        a: "You pay for twelve months up front at a 20% discount, with the same monthly resolution allowance. Unused resolutions do not roll over.",
      },
      {
        q: "Do you offer a pilot?",
        a: "Every Launch plan starts with a 30-day pilot on real traffic. If the agent does not resolve the share of conversations we agreed up front, you do not pay for the pilot.",
      },
    ],
  },
};
