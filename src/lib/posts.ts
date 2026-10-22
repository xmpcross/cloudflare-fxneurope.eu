import { getCollection, type CollectionEntry } from "astro:content";
import { authors, topicSlug } from "@/config/blog";
import { siteConfig } from "@/config/site";
import type { SearchItem } from "@/lib/search";

export type Post = CollectionEntry<"blog">;

export const postSlug = (post: Post) => post.id.replace(/\/index$/, "");
export const postHref = (post: Post) => `/blog/${postSlug(post)}/`;
export const topicHref = (topic: string) => `/blog/topic/${topicSlug(topic)}/`;

const byNewest = (a: Post, b: Post) => b.data.date.getTime() - a.data.date.getTime();

/** Published posts, newest first. Drafts never leave the dev server. */
export async function getPosts() {
  const posts = await getCollection("blog", ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort(byNewest);
}

/** The featured post if one is flagged, the newest otherwise. */
export const leadPost = (posts: Post[]) => posts.find((post) => post.data.featured) ?? posts[0];

const dateFormat = new Intl.DateTimeFormat(siteConfig.dateLocale, {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export const formatDate = (date: Date) => dateFormat.format(date);

export const authorOf = (name: string) => authors[name];

/** Every name on a post, lead author first. */
export const postAuthors = (post: Post) => [post.data.author, ...post.data.coauthors];

/** "A", "A & B", "A, B & C". */
export const joinNames = (names: string[]) =>
  names.length < 2 ? (names[0] ?? "") : `${names.slice(0, -1).join(", ")} & ${names.at(-1)}`;

/** Same topic first, then the newest of the rest. */
export const relatedPosts = (post: Post, posts: Post[], count = 3) => {
  const others = posts.filter((other) => other.id !== post.id);
  const sameTopic = others.filter((other) => other.data.topic === post.data.topic);
  const rest = others.filter((other) => other.data.topic !== post.data.topic);
  return [...sameTopic, ...rest].slice(0, count);
};

export const searchItems = (posts: Post[]): SearchItem[] =>
  posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    href: postHref(post),
    topic: post.data.topic,
    author: joinNames(postAuthors(post)),
    date: formatDate(post.data.date),
    tags: post.data.tags,
  }));
