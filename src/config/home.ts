import type { ImageMetadata } from "astro";
import heroPhoto from "@/assets/images/hero.jpg";
import banking from "@/assets/images/industries/banking.jpg";
import healthcare from "@/assets/images/industries/healthcare.jpg";
import insurance from "@/assets/images/industries/insurance.jpg";
import retail from "@/assets/images/industries/retail.jpg";
import telecom from "@/assets/images/industries/telecom.jpg";
import travel from "@/assets/images/industries/travel.jpg";
import jonas from "@/assets/images/people/jonas-lindqvist.jpg";
import marcus from "@/assets/images/people/marcus-bell.jpg";
import priya from "@/assets/images/people/priya-raman.jpg";
import sofia from "@/assets/images/people/sofia-almeida.jpg";

/** Where a demo photo came from, for the credits in the README. */
export interface Credit {
  name: string;
  url: string;
}

/**
 * The logo wall. Real wordmarks from Wikimedia Commons, in `src/assets/logos`,
 * shown as demo content only: replace them with your own customers.
 */
export const logoWall = [
  "google",
  "cloudflare",
  "vercel",
  "stripe",
  "shopify",
  "slack",
  "spotify",
  "airbnb",
  "dropbox",
  "duolingo",
  "atlassian",
  "hubspot",
] as const;

/** Fictional companies for testimonials. Marks are drawn in `CompanyLogo.astro`. */
export const companies = [
  "Northwind",
  "Kestrel",
  "Lumen",
  "Parcelry",
  "Harbor",
  "Orbitra",
  "Fieldstone",
  "Quanta",
  "Vela",
  "Mosaic",
  "Tessel",
  "Brightline",
] as const;

export type CompanyName = (typeof companies)[number];
export type BrandName = (typeof logoWall)[number];

export const hero = {
  title: ["Put an AI agent", "on every conversation"],
  lead: "Synth builds, runs and grades AI agents across chat, voice and email. Every decision is traced, every answer can be replayed, and every rule stays yours to change.",
  secondary: { label: "Take the tour", href: "/#platform" },
  photo: heroPhoto,
  photoAlt: "A support lead working on a laptop in a quiet office booth",
  photoCredit: {
    name: "Phil Cln / Unsplash",
    url: "https://unsplash.com/photos/a-man-using-a-laptop-ZI_EpN9_Vng",
  },
  /** The chat that plays over the hero. `receipt` renders as an action card. */
  conversation: [
    { from: "agent", text: "Hi Maya, I can see your latest order. How can I help?", time: "09:41" },
    { from: "customer", text: "My order arrived damaged. Can I get a refund?", time: "09:41" },
    {
      from: "agent",
      text: "Sorry about that. Order #48213 was delivered on Tuesday and is inside the returns window, so I have refunded it.",
      time: "09:42",
    },
    { from: "receipt", text: "Refund issued", detail: "€64.00 to Visa ending 4821", time: "09:42" },
    { from: "customer", text: "That was fast. Thank you!", time: "09:42" },
  ] as { from: "agent" | "customer" | "receipt"; text: string; detail?: string; time: string }[],
  logosLine: "Running in production at 400+ support teams",
};

export const stats = [
  { value: 71, suffix: "%", label: "of conversations resolved end to end, with no hand-off" },
  { value: 0.8, suffix: "s", decimals: 1, label: "median time to first word on a voice call" },
  { value: 38, suffix: "", label: "languages, detected and answered in the same turn" },
  { value: 5, suffix: " wks", label: "from signed contract to live traffic, on average" },
];

export const tour = {
  id: "platform",
  title: "One system to build, run and grade every agent",
  lead: "Most teams stitch together a prompt tool, a bot vendor and a spreadsheet of spot checks. Synth is the whole loop, so a fix found in grading is live in minutes.",
  tabs: [
    {
      id: "build",
      label: "Build",
      title: "Write the rules once. The agent follows them every time.",
      body: "Language models handle the conversation. Flows handle the money. Refunds, cancellations and identity checks run as fixed steps you can read, so the model never improvises policy.",
      points: [
        "Persona, tone and escalation rules in one editor",
        "Knowledge synced from help centres, PDFs and product feeds",
        "Flows that call your APIs with typed inputs and outputs",
      ],
      cards: [
        {
          icon: "user-round",
          title: "Brand voice",
          detail: "Warm, brief, no jargon",
          status: "done",
        },
        {
          icon: "book-open",
          title: "Knowledge",
          detail: "2,418 articles synced 4 minutes ago",
          status: "done",
        },
        {
          icon: "git-branch",
          title: "Refund flow",
          detail: "4 steps, published as v14",
          status: "done",
        },
        {
          icon: "life-buoy",
          title: "Escalation rules",
          detail: "Draft with 2 changes",
          status: "pending",
        },
      ],
    },
    {
      id: "run",
      label: "Run",
      title: "One agent, every channel your customers already use.",
      body: "The same agent answers the chat widget, the phone line and the support inbox, and hands over to a person with the full context when it should.",
      points: [
        "Voice with barge-in and sub-second replies",
        "Chat, WhatsApp, SMS and email from one configuration",
        "Warm hand-off to your helpdesk queue, summary attached",
      ],
      /** A live voice call; transcript lines appear one at a time. */
      call: {
        line: "+44 20 7946 0321",
        transcript: [
          { from: "customer", text: "My train tomorrow was cancelled. Can I move to the 9:40?" },
          {
            from: "agent",
            text: "Yes. The 9:40 has seats in coach C at the same fare. Shall I switch you?",
          },
          { from: "customer", text: "Please, and a window seat if there is one." },
          {
            from: "agent",
            text: "Done. Seat C14, by the window. Your new ticket is on its way by text.",
          },
          { from: "customer", text: "Perfect, thank you." },
        ],
      },
      channels: [
        { label: "Voice", live: 12 },
        { label: "Web chat", live: 86 },
        { label: "Email", live: 30 },
        { label: "WhatsApp", live: 9 },
      ],
    },
    {
      id: "grade",
      label: "Grade",
      title: "Every conversation scored, not a sample of fifty.",
      body: "A reviewer model scores each conversation against your rubric. Scores roll up by intent, channel and flow, so you know which step to fix before a customer tells you.",
      points: [
        "Rubrics for accuracy, policy and tone, weighted your way",
        "Regression tests replayed on every change",
        "Alerts when a score drifts past its threshold",
      ],
      /** Daily overall score for the last two weeks, oldest first, against its alert threshold. */
      trend: [94.8, 95.3, 95.1, 95.9, 96.2, 95.7, 96.4, 96.8, 96.5, 97.1, 97.0, 97.4, 97.3, 97.8],
      threshold: 95,
      conversations: 4912,
      rubric: [
        { label: "Accuracy", score: 97.8 },
        { label: "Policy", score: 99.2 },
        { label: "Tone", score: 92.1 },
      ],
    },
  ],
};

export const trace = {
  id: "traces",
  title: "Every answer arrives with its working",
  lead: "Open any conversation and replay it step by step: what the customer meant, which tool was called, which rule allowed the action, and what the model was given to write the reply.",
  facts: [
    { value: "100%", label: "of steps logged, tool calls and rules included" },
    { value: "90 days", label: "of full traces kept, longer on Enterprise" },
    { value: "1 click", label: "to replay a conversation on a new flow or model" },
  ],
  steps: [
    { at: 12, label: "Intent", detail: "refund_request, confidence 0.97" },
    { at: 94, label: "Order lookup", detail: "#48213, delivered, €64.00" },
    {
      at: 141,
      label: "Knowledge",
      detail: "Returns policy §2, damaged on arrival",
    },
    { at: 203, label: "Rule", detail: "Refund under €200, allowed" },
    { at: 288, label: "Action", detail: "Refund RF-90412 issued" },
    { at: 402, label: "Reply", detail: "Drafted in brand voice" },
    { at: 446, label: "Checks", detail: "PII and policy scan clean, sent" },
  ],
};

export const integrations = {
  id: "integrations",
  title: "Bring any model. Keep the stack you have.",
  lead: "Pick a model per step, not per contract. Route simple intents to a fast model and hard ones to a frontier model, and switch either without rebuilding the agent.",
  /**
   * The routing table: each flow step and the models it can run on, with a
   * median latency in ms. The first option is shown on load; the table cycles
   * through the rest to show a swap.
   */
  routes: [
    {
      step: "Classify intent",
      tier: "fast",
      options: [
        { model: "Open-weight 8B", ms: 42 },
        { model: "Your fine-tune v3", ms: 31 },
      ],
    },
    {
      step: "Extract fields",
      tier: "fast",
      options: [
        { model: "Your fine-tune v3", ms: 58 },
        { model: "Open-weight 8B", ms: 74 },
      ],
    },
    {
      step: "Compose reply",
      tier: "standard",
      options: [
        { model: "Frontier model A", ms: 410 },
        { model: "Frontier model B", ms: 520 },
      ],
    },
    {
      step: "Transcribe voice",
      tier: "speech",
      options: [
        { model: "Speech model S2", ms: 160 },
        { model: "Speech model W4", ms: 210 },
      ],
    },
    {
      step: "Grade conversation",
      tier: "careful",
      options: [
        { model: "Frontier model B", ms: 680 },
        { model: "Frontier model A", ms: 590 },
      ],
    },
  ],
  /** Systems the agent works in, with the calls it made to each today. */
  systems: [
    { label: "Helpdesk", detail: "Tickets and warm hand-offs", calls: 18420 },
    { label: "CRM", detail: "Customer profiles and history", calls: 12977 },
    { label: "Commerce", detail: "Orders, stock and returns", calls: 9364 },
    { label: "Payments", detail: "Refunds and disputes", calls: 2108 },
    { label: "Data warehouse", detail: "Traces and scores, exported", calls: 41250 },
    { label: "Identity", detail: "Verification and SSO", calls: 6733 },
  ],
};

export interface Industry {
  id: string;
  name: string;
  image: ImageMetadata;
  imageAlt: string;
  credit: Credit;
  body: string;
  /** A page for the industry, linked from its panel. */
  href?: string;
  metrics: { value: string; label: string }[];
}

export const industries: { id: string; title: string; lead: string; items: Industry[] } = {
  id: "industries",
  title: "Built around the work, not the chat window",
  lead: "Each industry ships with flows, rubrics and integrations for the conversations that fill its queues.",
  items: [
    {
      id: "retail",
      name: "Retail",
      image: retail,
      imageAlt: "The atrium of a bright shopping mall, with shopfronts on several floors",
      credit: { name: "Arunodhai V / Pexels", url: "https://www.pexels.com/photo/11412766/" },
      body: "Where is my order, can I return it, does it come in blue. Answered with live stock and order data, refunds issued inside policy.",
      href: "/industries/retail/",
      metrics: [
        { value: "78%", label: "resolved without an agent" },
        { value: "−41%", label: "cost per contact" },
      ],
    },
    {
      id: "banking",
      name: "Banking",
      image: banking,
      imageAlt: "Market data glowing on a desktop monitor",
      credit: {
        name: "Jakub Zerdzicki / Unsplash",
        url: "https://unsplash.com/photos/stock-market-data-displayed-on-a-computer-screen-itgsDhR1e2w",
      },
      body: "Card freezes, payment status and disputes, with step-up verification before anything touches an account.",
      metrics: [
        { value: "3.2×", label: "faster dispute intake" },
        { value: "100%", label: "of actions logged" },
      ],
    },
    {
      id: "insurance",
      name: "Insurance",
      image: insurance,
      imageAlt: "An electric car charging at a curbside station",
      credit: {
        name: "Ratio EV Charging / Unsplash",
        url: "https://unsplash.com/photos/an-electric-car-is-charging-at-a-station-cijIh10hXRI",
      },
      body: "First notice of loss taken by phone at 2am, photos requested by SMS, and the claim filed before the adjuster logs on.",
      metrics: [
        { value: "11 min", label: "saved per claim" },
        { value: "24/7", label: "intake coverage" },
      ],
    },
    {
      id: "telecom",
      name: "Telecom",
      image: telecom,
      imageAlt: "Network cables plugged into a lit router switch",
      credit: {
        name: "Albert Stoynov / Unsplash",
        url: "https://unsplash.com/photos/a-close-up-of-a-network-with-wires-connected-to-it-dyUp7WPu5q4",
      },
      body: "Outage lookups by postcode, plan changes and device troubleshooting that knows which router the customer owns.",
      metrics: [
        { value: "64%", label: "fewer repeat calls" },
        { value: "0.7s", label: "voice response" },
      ],
    },
    {
      id: "travel",
      name: "Travel",
      image: travel,
      imageAlt: "The cabin of a private jet with warm lighting",
      credit: {
        name: "Andy Wang / Unsplash",
        url: "https://unsplash.com/photos/luxurious-interior-of-a-private-jet-with-comfortable-seating-lU1pEjWZzXg",
      },
      body: "When a storm cancels two hundred flights, every passenger is offered a rebooking in minutes instead of a hold queue.",
      metrics: [
        { value: "9×", label: "peak capacity" },
        { value: "+22", label: "points of CSAT" },
      ],
    },
    {
      id: "healthcare",
      name: "Healthcare",
      image: healthcare,
      imageAlt: "A clinician typing on a laptop beside a stethoscope",
      credit: { name: "National Cancer Institute / Unsplash", url: "https://unsplash.com/@nci" },
      body: "Appointment booking, reminders and pre-visit questions, with clinical topics routed to staff by rule, never by guess.",
      metrics: [
        { value: "−35%", label: "no-show rate" },
        { value: "HIPAA", label: "aligned deployment" },
      ],
    },
  ],
};

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: CompanyName;
  photo: ImageMetadata;
  /** Where the face sits in the photo, as an `object-position` value. */
  focus?: string;
  credit: Credit;
  result: { value: string; label: string };
}

export const testimonials: { id: string; title: string; items: Testimonial[] } = {
  id: "customers",
  title: "Teams that stopped sampling and started reading every conversation",
  items: [
    {
      quote:
        "We used to review fifty tickets a week and hope they were typical. Now every conversation has a score, and the first thing we fixed was a flow we thought was fine.",
      name: "Priya Raman",
      role: "VP Customer Operations",
      company: "Parcelry",
      photo: priya,
      focus: "62% 22%",
      credit: {
        name: "Abenezer Shewaga / Unsplash",
        url: "https://unsplash.com/photos/xc5gojDaxW8",
      },
      result: { value: "−38%", label: "handle time in the first quarter" },
    },
    {
      quote:
        "Our compliance team signed off because they could read the refund rules themselves. The model writes the reply; it never decides the money.",
      name: "Jonas Lindqvist",
      role: "Head of Digital Service",
      company: "Harbor",
      photo: jonas,
      focus: "50% 38%",
      credit: { name: "Alef Morais / Unsplash", url: "https://unsplash.com/photos/LPvi7DMp-HU" },
      result: { value: "0", label: "policy breaches in eleven months" },
    },
    {
      quote:
        "Storm day used to mean a four-hour hold queue. Last January the agent rebooked nine thousand passengers before our morning shift arrived.",
      name: "Sofia Almeida",
      role: "Director of Customer Care",
      company: "Vela",
      photo: sofia,
      credit: {
        name: "Cemrecan Yurtman / Unsplash",
        url: "https://unsplash.com/photos/ih03D0F6M6M",
      },
      result: { value: "9,000", label: "rebookings on one morning" },
    },
    {
      quote:
        "Switching the model behind our triage step took an afternoon and a regression run. With the last vendor it would have been a new contract.",
      name: "Marcus Bell",
      role: "Principal Engineer",
      company: "Northwind",
      photo: marcus,
      credit: { name: "mehdi pezhvak / Unsplash", url: "https://unsplash.com/photos/43AUR3OGt3I" },
      result: { value: "1 day", label: "to change model providers" },
    },
  ],
};

export const security = {
  id: "security",
  title: "Ready for the teams who get audited",
  lead: "Synth runs in your region or your cloud, keeps customer data out of model training, and records every action with who approved the rule behind it.",
  features: [
    {
      title: "Data residency",
      body: "EU, US or UK hosting, or a private deployment in your own cloud account.",
    },
    {
      title: "Single sign-on",
      body: "SAML and OIDC with SCIM provisioning, and roles down to a single flow.",
    },
    {
      title: "PII redaction",
      body: "Card numbers, IDs and health data masked before any model sees them.",
    },
    {
      title: "Guardrails",
      body: "Policy checks on every reply, with blocked answers routed to a person.",
    },
    {
      title: "Audit log",
      body: "Every rule change, deployment and action, exportable to your SIEM.",
    },
    {
      title: "No training on your data",
      body: "Conversations are never used to train shared models. In writing.",
    },
  ],
};

export const compliance = {
  label: "Certifications and compliance",
  items: [
    { name: "ISO 27001", icon: "globe", note: "Certified" },
    { name: "SOC 2 Type II", icon: "shield-check", note: "Audited annually" },
    { name: "HIPAA", icon: "heart-pulse", note: "BAA available" },
    { name: "GDPR", icon: "scale", note: "EU data residency" },
  ],
  note: "Synth meets the requirements for ISO 27001, SOC 2 Type II, HIPAA and GDPR.",
};

export const faq = {
  id: "faq",
  title: "Questions teams ask before they sign",
  items: [
    {
      q: "Which language models does Synth use?",
      a: "Whichever you choose. Synth works with the major frontier providers, open-weight models you host, and your own fine-tunes. You can route each step of a flow to a different model and change it without touching the agent.",
    },
    {
      q: "How long does a typical launch take?",
      a: "Five weeks on average from signature to live traffic. The first week connects knowledge and systems, the next three build and grade flows against real transcripts, and the last runs a staged roll-out.",
    },
    {
      q: "What happens when the agent cannot help?",
      a: "It hands the conversation to your existing helpdesk queue with a summary, the customer's details and everything it already tried, so nobody has to ask the same question twice.",
    },
    {
      q: "Is our data used to train models?",
      a: "No. Conversations stay in your tenant and are never used to train shared models. Enterprise plans can keep all processing inside your own cloud account.",
    },
    {
      q: "What counts as a resolved conversation?",
      a: "One where the customer's issue was closed without a hand-off and they did not return about the same issue within 72 hours. Hand-offs are never billed.",
    },
  ],
};

export const closing = {
  title: "Put Synth on your busiest queue",
  lead: "Bring a week of real transcripts. We will show you how many the agent resolves, and exactly how it got there.",
  proof: [
    { value: "5 weeks", label: "to live traffic" },
    { value: "71%", label: "resolved end to end" },
    { value: "0", label: "policy breaches" },
  ],
};
