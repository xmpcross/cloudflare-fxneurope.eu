import teamPhoto from "@/assets/images/about.jpg";
import amara from "@/assets/images/team/amara-okafor.jpg";
import hannah from "@/assets/images/team/hannah-weiss.jpg";
import ines from "@/assets/images/team/ines-moreau.jpg";
import rafael from "@/assets/images/team/rafael-duarte.jpg";

export const about = {
  title: "We build the agents we wanted to hand our own queues to",
  lead: "Synth started in a support team that was drowning. Five years on, we build, run and grade AI agents for more than 400 support teams, and we still read the transcripts every week.",
  photo: teamPhoto,
  photoAlt: "Four colleagues talking around a table of laptops in a bright office",
  photoCredit: { name: "MART PRODUCTION / Pexels", url: "https://www.pexels.com/photo/7550538/" },
  story: {
    title: "Why we started",
    paragraphs: [
      "In 2021 our founders ran support at a fast-growing marketplace. The bots they bought guessed at policy, and the only way to know how they were doing was to read a sample of fifty conversations on a Friday.",
      "So they built the opposite: agents that follow fixed flows for anything involving money, explain every step they take, and are graded on every conversation rather than a sample.",
      "That is still the whole company. Everything we ship has to make an agent more useful to a customer, or easier for a team to trust.",
    ],
  },
  facts: [
    { value: "2021", label: "founded in London" },
    { value: "400+", label: "support teams in production" },
    { value: "1.2B", label: "conversations handled" },
    { value: "64", label: "people across 14 countries" },
  ],
  milestonesTitle: "How we got here",
  milestones: [
    {
      year: "2021",
      title: "First flow in production",
      body: "A refund flow for one marketplace, graded on every conversation from day one.",
    },
    {
      year: "2022",
      title: "Seed round and first ten customers",
      body: "Retail and travel teams, all found through support leads telling each other.",
    },
    {
      year: "2023",
      title: "Voice goes live",
      body: "Phone agents with sub-second replies, built on the same flows as chat.",
    },
    {
      year: "2024",
      title: "Series A, Lisbon hub opens",
      body: "Funding to grow research and a second home for the product team.",
    },
    {
      year: "2026",
      title: "A billion conversations",
      body: "Across 38 languages, with every one of them traced and scored.",
    },
  ],
  leadershipTitle: "Leadership",
  leadership: [
    {
      name: "Hannah Weiss",
      role: "Co-founder and CEO",
      photo: hannah,
      credit: { name: "Marcelo Verfe / Pexels", url: "https://www.pexels.com/photo/22880379/" },
    },
    {
      name: "Rafael Duarte",
      role: "Co-founder and CTO",
      photo: rafael,
      credit: { name: "Dr. Khaled Amer / Pexels", url: "https://www.pexels.com/photo/4687544/" },
    },
    {
      name: "Ines Moreau",
      role: "Head of Research",
      photo: ines,
      credit: { name: "Shovan Datta / Pexels", url: "https://www.pexels.com/photo/20276645/" },
    },
    {
      name: "Amara Okafor",
      role: "Product Lead",
      photo: amara,
      credit: { name: "Victor Koonoo / Pexels", url: "https://www.pexels.com/photo/22391749/" },
    },
  ],
  team: {
    title: "Where we work",
    lead: "Three hubs and a lot of kitchen tables. Most of the team works remotely, close to the customers they look after.",
    /**
     * Pins on the globe. `location` is [latitude, longitude]; `hub` counts
     * towards the hubs total.
     */
    places: [
      {
        city: "London",
        country: "United Kingdom",
        people: 22,
        hub: true,
        location: [51.51, -0.13],
      },
      { city: "Lisbon", country: "Portugal", people: 14, hub: true, location: [38.72, -9.14] },
      {
        city: "New York",
        country: "United States",
        people: 7,
        hub: true,
        location: [40.71, -74.01],
      },
      { city: "Berlin", country: "Germany", people: 3, location: [52.52, 13.4] },
      { city: "Warsaw", country: "Poland", people: 3, location: [52.23, 21.01] },
      { city: "Toronto", country: "Canada", people: 3, location: [43.65, -79.38] },
      { city: "Barcelona", country: "Spain", people: 2, location: [41.39, 2.17] },
      { city: "Amsterdam", country: "Netherlands", people: 2, location: [52.37, 4.9] },
      { city: "Stockholm", country: "Sweden", people: 2, location: [59.33, 18.07] },
      { city: "Bengaluru", country: "India", people: 2, location: [12.97, 77.59] },
      { city: "Nairobi", country: "Kenya", people: 1, location: [-1.29, 36.82] },
      { city: "São Paulo", country: "Brazil", people: 1, location: [-23.55, -46.63] },
      { city: "Singapore", country: "Singapore", people: 1, location: [1.35, 103.82] },
      { city: "Tokyo", country: "Japan", people: 1, location: [35.68, 139.69] },
    ] as {
      city: string;
      country: string;
      people: number;
      hub?: boolean;
      location: [number, number];
    }[],
  },
  closing: {
    title: "Come build it with us",
    body: "We are a small team with a lot of conversations to get right. If that sounds like your kind of problem, we would like to hear from you.",
    cta: { label: "See open roles", href: "/careers/" },
    /** Shown after the open-role count, which comes from `src/config/careers.ts`. */
    proof: [
      { value: "14", label: "countries" },
      { value: "Remote", label: "first" },
    ],
  },
};
