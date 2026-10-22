export interface SearchItem {
  title: string;
  description: string;
  href: string;
  topic: string;
  author: string;
  date: string;
  tags: string[];
}

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

/** Every query word has to start a word somewhere in the field. */
const matches = (field: string, words: string[]) => {
  const tokens = normalize(field).split(/[^a-z0-9]+/);
  return words.every((word) => tokens.some((token) => token.startsWith(word)));
};

/** Ranked in tiers: title, then topic and tags, then description and author. */
export function rankPosts(items: SearchItem[], query: string): SearchItem[] {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const scored = items.map((item) => {
    const score = matches(item.title, words)
      ? 3
      : matches(`${item.topic} ${item.tags.join(" ")}`, words)
        ? 2
        : matches(
              `${item.title} ${item.description} ${item.author} ${item.topic} ${item.tags.join(" ")}`,
              words,
            )
          ? 1
          : 0;
    return { item, score };
  });
  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}
