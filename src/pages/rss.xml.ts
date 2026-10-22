import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { siteConfig } from "@/config/site";
import { getPosts, joinNames, postAuthors, postHref } from "@/lib/posts";

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  return rss({
    title: `${siteConfig.name} blog`,
    description: siteConfig.description,
    site: siteConfig.siteUrl,
    items: posts.slice(0, 20).map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: postHref(post),
      categories: [post.data.topic, ...post.data.tags],
      author: `${siteConfig.email} (${joinNames(postAuthors(post))})`,
    })),
    customData: `<language>${siteConfig.language}</language>`,
  });
};
