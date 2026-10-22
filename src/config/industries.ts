import type { ImageMetadata } from "astro";
import retailPacking from "@/assets/images/industries/retail-packing.jpg";
import retailPhoto from "@/assets/images/industries/retail.jpg";
import type { Credit } from "@/config/home";

export interface IndustryPage {
  /** The URL segment: `retail` renders at `/industries/retail/`. */
  slug: string;
  name: string;
  title: string;
  lead: string;
  photo: ImageMetadata;
  photoAlt: string;
  photoCredit: Credit;
  metrics: { value: string; label: string }[];
  intents: {
    title: string;
    lead: string;
    /** `share` and `resolved` are percentages; `flow` names the flow that handles the intent. */
    items: { intent: string; example: string; share: number; resolved: number; flow: string }[];
  };
  flow: {
    title: string;
    lead: string;
    points: string[];
    photo: ImageMetadata;
    photoAlt: string;
    photoCredit: Credit;
    /** The two cards over the photo: the customer's message and what the flow did. */
    question: string;
    result: { title: string; detail: string };
  };
  peak: {
    title: string;
    lead: string;
    /** One point per day. `highlight` marks the day on the line. */
    days: { date: string; contacts: number; handedOff: number; highlight?: string }[];
  };
  systems: {
    title: string;
    lead: string;
    /** `icon` is a file name from `src/icons/lucide`. */
    items: { name: string; icon: string; reads: string; writes: string }[];
  };
  /** The `name` of a testimonial in `src/config/home.ts`. */
  story: string;
  faq: { title: string; items: { q: string; a: string }[] };
  closing: { title: string; body: string };
}

export const industryPages: IndustryPage[] = [
  {
    slug: "retail",
    name: "Retail",
    title: "Every order question answered before it becomes a ticket",
    lead: "Where is my order, can I return it, does it come in blue. Synth answers with live order and stock data, and issues refunds and exchanges inside the rules you set.",
    photo: retailPhoto,
    photoAlt: "The atrium of a bright shopping mall, with shopfronts on several floors",
    photoCredit: { name: "Arunodhai V / Pexels", url: "https://www.pexels.com/photo/11412766/" },
    metrics: [
      { value: "78%", label: "of contacts resolved without an agent" },
      { value: "−41%", label: "cost per contact in the first quarter" },
      { value: "0.6s", label: "median reply on chat" },
      { value: "4 wks", label: "from contract to live traffic" },
    ],
    intents: {
      title: "The conversations that fill a retail queue",
      lead: "Seven intents make up almost every retail contact. Each one maps to a flow that ships with the retail pack, and you can change any of them.",
      items: [
        {
          intent: "Where is my order",
          example: "It said Tuesday and it is Thursday",
          share: 34,
          resolved: 92,
          flow: "Order status",
        },
        {
          intent: "Returns and exchanges",
          example: "Can I swap this for a medium?",
          share: 21,
          resolved: 81,
          flow: "Returns",
        },
        {
          intent: "Product questions",
          example: "Is the jacket waterproof or just resistant?",
          share: 15,
          resolved: 88,
          flow: "Catalogue answers",
        },
        {
          intent: "Delivery changes",
          example: "Can you leave it with a neighbour?",
          share: 11,
          resolved: 74,
          flow: "Delivery update",
        },
        {
          intent: "Payments and promo codes",
          example: "My discount code did not apply",
          share: 9,
          resolved: 69,
          flow: "Payment check",
        },
        {
          intent: "Account and loyalty",
          example: "Where did my points go?",
          share: 6,
          resolved: 77,
          flow: "Account lookup",
        },
        {
          intent: "Everything else",
          example: "Complaints, press, the unexpected",
          share: 4,
          resolved: 0,
          flow: "Hand-off",
        },
      ],
    },
    flow: {
      title: "The model writes the reply. The flow moves the money.",
      lead: "Returns run as fixed steps you can read. The language model understands the customer and writes in your voice, but whether a refund is allowed is decided by a rule, every time.",
      points: [
        "Return windows, final-sale items and refund limits set per market",
        "Exchanges checked against live stock before they are offered",
        "Labels created with your carrier, refund released on first scan",
        "Anything outside policy handed to a person with the case attached",
      ],
      photo: retailPacking,
      photoAlt: "A woman packing an order into a cardboard box beside a rail of colourful shirts",
      photoCredit: {
        name: "Kampus Production / Pexels",
        url: "https://www.pexels.com/photo/7857535/",
      },
      question: "The jacket is a bit small. Can I swap it for a medium?",
      result: { title: "Exchange placed", detail: "Inside the window, medium in stock" },
    },
    peak: {
      title: "Black Friday without the hold queue",
      lead: "Contacts tripled across peak week at one fashion retailer. The agent took the extra volume and the support team stayed the size it was in October.",
      days: [
        { date: "Nov 21", contacts: 6200, handedOff: 1400 },
        { date: "Nov 22", contacts: 5800, handedOff: 1300 },
        { date: "Nov 23", contacts: 7100, handedOff: 1600 },
        { date: "Nov 24", contacts: 8400, handedOff: 1800 },
        { date: "Nov 25", contacts: 9900, handedOff: 2100 },
        { date: "Nov 26", contacts: 11600, handedOff: 2300 },
        { date: "Nov 27", contacts: 18900, handedOff: 3400, highlight: "Black Friday" },
        { date: "Nov 28", contacts: 16200, handedOff: 3000 },
        { date: "Nov 29", contacts: 14100, handedOff: 2700 },
        { date: "Nov 30", contacts: 19600, handedOff: 3600, highlight: "Cyber Monday" },
        { date: "Dec 1", contacts: 15300, handedOff: 2900 },
        { date: "Dec 2", contacts: 12200, handedOff: 2400 },
        { date: "Dec 3", contacts: 10100, handedOff: 2100 },
        { date: "Dec 4", contacts: 8700, handedOff: 1900 },
      ],
    },
    systems: {
      title: "Connected to the systems that hold the answers",
      lead: "The retail pack comes with connectors for the usual stack. Each one lists exactly what the agent can read and what it is allowed to change.",
      items: [
        {
          name: "Storefront",
          icon: "store",
          reads: "Catalogue, prices, stock by size",
          writes: "Nothing",
        },
        {
          name: "Order management",
          icon: "package",
          reads: "Orders, fulfilment, tracking",
          writes: "Delivery notes, exchanges",
        },
        {
          name: "Payments",
          icon: "credit-card",
          reads: "Charges and refund status",
          writes: "Refunds inside policy",
        },
        {
          name: "Returns portal",
          icon: "rotate-ccw",
          reads: "Open returns and labels",
          writes: "New returns, labels",
        },
        {
          name: "Loyalty",
          icon: "gift",
          reads: "Points, tier, history",
          writes: "Goodwill points, capped",
        },
        {
          name: "Helpdesk",
          icon: "headset",
          reads: "Past tickets",
          writes: "Hand-offs with a summary",
        },
      ],
    },
    story: "Priya Raman",
    closing: {
      title: "Put Synth on your retail queue",
      body: "Send us a month of transcripts and we will show you which conversations an agent could have finished, and how.",
    },
    faq: {
      title: "Questions retail teams ask",
      items: [
        {
          q: "Which commerce platforms does Synth connect to?",
          a: "The major hosted storefronts and order management systems have ready-made connectors. Anything with an API can be added as a custom connector in a day or two, with the same read and write permissions as the built-in ones.",
        },
        {
          q: "Can the agent issue refunds on its own?",
          a: "Only inside the rules you write. Refund limits, return windows and final-sale exclusions are fixed steps in the returns flow, so the model can never talk itself into a refund the policy does not allow.",
        },
        {
          q: "How does it handle peak season?",
          a: "The agent scales with traffic, so there is no queue to join. Most teams also add peak-only rules, such as extended return windows, and switch them on and off by date.",
        },
        {
          q: "Does it answer product questions from our catalogue?",
          a: "Yes. The catalogue, size guides and care instructions sync from your storefront and help centre, and stock is checked live before anything is recommended.",
        },
      ],
    },
  },
];
