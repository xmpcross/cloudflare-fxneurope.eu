import teamPhoto from "@/assets/images/careers.jpg";

export interface Role {
  title: string;
  team: string;
  location: string;
  type: string;
  /** Link to the posting on your applicant tracking system. Left empty, the row renders without a link. */
  applyUrl: string;
}

export const careers = {
  title: "Build the agents people trust with their problems",
  lead: "We are a small team of engineers, researchers and operators putting AI agents in front of millions of customers. The work is hard in the right ways, and every release is measured.",
  photo: teamPhoto,
  photoAlt: "A team working together around a table of laptops, seen from above",
  photoCredit: { name: "Marvin Meyer / Unsplash", url: "https://unsplash.com/@marvelous" },
  facts: [
    { value: "64", label: "people across 14 countries" },
    { value: "Remote", label: "first, with hubs in London and Lisbon" },
    { value: "2×", label: "a year, the whole team in one room" },
  ],
  values: [
    {
      title: "Measure it or it did not happen",
      body: "Every change ships with a number that says whether it worked. Opinions are welcome; evidence decides.",
    },
    {
      title: "Write it down",
      body: "Decisions live in documents anyone can read, so people in any time zone can do their best work without a meeting.",
    },
    {
      title: "Stay close to the transcript",
      body: "Everyone, including leadership, reads real customer conversations every week. It is where the roadmap comes from.",
    },
    {
      title: "Hand over cleanly",
      body: "The same rule we build into the product: when something is not yours to finish, pass it on with the full context.",
    },
  ],
  benefits: [
    {
      icon: "credit-card",
      title: "Competitive salary and equity",
      body: "Published bands for every role, reviewed twice a year.",
    },
    {
      icon: "clock",
      title: "Flexible hours",
      body: "Core overlap of three hours. The rest of the day is yours to arrange.",
    },
    {
      icon: "sparkles",
      title: "Learning budget",
      body: "€2,000 a year for courses, conferences and books.",
    },
    {
      icon: "shield-check",
      title: "Health cover",
      body: "Private medical and dental for you and your dependants.",
    },
    {
      icon: "cpu",
      title: "Your own setup",
      body: "A laptop of your choice and €1,500 for your home office.",
    },
    {
      icon: "users",
      title: "Parental leave",
      body: "Twenty weeks fully paid for every parent, however you became one.",
    },
  ],
  rolesTitle: "Open roles",
  roles: [
    {
      title: "Senior Backend Engineer, Runtime",
      team: "Engineering",
      location: "Remote, Europe",
      type: "Full-time",
      applyUrl: "",
    },
    {
      title: "Staff Engineer, Voice",
      team: "Engineering",
      location: "London or remote",
      type: "Full-time",
      applyUrl: "",
    },
    {
      title: "Frontend Engineer, Agent Studio",
      team: "Engineering",
      location: "Lisbon or remote",
      type: "Full-time",
      applyUrl: "",
    },
    {
      title: "Machine Learning Engineer, Evaluation",
      team: "Research",
      location: "Remote, Europe",
      type: "Full-time",
      applyUrl: "",
    },
    {
      title: "Research Scientist, Dialogue",
      team: "Research",
      location: "London",
      type: "Full-time",
      applyUrl: "",
    },
    {
      title: "Senior Product Designer",
      team: "Product and design",
      location: "Remote, Europe",
      type: "Full-time",
      applyUrl: "",
    },
    {
      title: "Product Manager, Integrations",
      team: "Product and design",
      location: "London or remote",
      type: "Full-time",
      applyUrl: "",
    },
    {
      title: "Solutions Architect",
      team: "Customers",
      location: "New York",
      type: "Full-time",
      applyUrl: "",
    },
    {
      title: "Enterprise Account Executive",
      team: "Customers",
      location: "London",
      type: "Full-time",
      applyUrl: "",
    },
  ] as Role[],
  closing: {
    title: "Do not see your role?",
    body: "We hire for people as much as for openings. Tell us what you would build here.",
    cta: { label: "Write to us", href: "mailto:careers@example.com" },
  },
};
