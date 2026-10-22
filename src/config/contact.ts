export const contact = {
  title: "Talk to the people who build it",
  lead: "Tell us about your queues and we will show you an agent working on them. Every message is read by a person, usually the same day.",
  /**
   * Read as "I'd like to <label>". `value` is what the form sends; link to
   * `/contact/?topic=<value>` to preselect one.
   */
  topics: [
    { value: "demo", label: "book a demo" },
    { value: "pricing", label: "talk about pricing" },
    { value: "security", label: "start a security review" },
    { value: "support", label: "get help with my account" },
    { value: "partners", label: "discuss a partnership" },
    { value: "press", label: "ask a press question" },
  ],
  teamSizes: ["Under 25 agents", "25 to 100", "100 to 500", "More than 500"],
  routesTitle: "Or write to a team",
  routes: [
    {
      label: "Sales",
      detail: "Demos, pilots and pricing",
      email: "sales@example.com",
    },
    {
      label: "Support",
      detail: "Help for existing customers",
      email: "support@example.com",
    },
    {
      label: "Security",
      detail: "Questionnaires, DPAs and audit reports",
      email: "security@example.com",
    },
    {
      label: "Press",
      detail: "Interviews, data and brand assets",
      email: "press@example.com",
    },
  ],
  officesTitle: "Our offices",
  offices: [
    {
      city: "London",
      address: ["4th floor, 20 Farringdon Road", "London EC1M 3HE"],
    },
    {
      city: "Lisbon",
      address: ["Rua da Prata 80, 2º", "1100-420 Lisboa"],
    },
    {
      city: "New York",
      address: ["148 Lafayette Street, Floor 6", "New York, NY 10013"],
    },
  ],
};
