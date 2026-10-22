import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { topics } from "@/config/blog";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "*/index.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(100),
      description: z.string().min(40).max(220),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      topic: z.enum(topics),
      author: z.string(),
      /** Extra names on the byline, after `author`, in the order listed. */
      coauthors: z.array(z.string()).default([]),
      cover: image(),
      coverAlt: z.string(),
      /** Icon (a file name in src/icons/lucide) and tone for `npm run covers`. Ignored for photo covers. */
      coverArt: z.string().optional(),
      coverTone: z.enum(["ember", "smoke"]).optional(),
      /** Photographer and source, printed under the cover on the post. */
      coverCredit: z.object({ name: z.string(), url: z.url() }).optional(),
      tags: z.array(z.string()).default([]),
      /**
       * The call-to-action band. Left off, it closes the post with the copy in
       * `src/config/blog.ts`. `after: 2` moves it below the second `##` section;
       * the other fields override its copy; `false` removes it.
       */
      cta: z
        .union([
          z.literal(false),
          z.object({
            after: z.number().int().min(1).optional(),
            eyebrow: z.string().optional(),
            title: z.string().optional(),
            body: z.string().optional(),
            label: z.string().optional(),
            href: z.string().optional(),
          }),
        ])
        .optional(),
      /** Pins the post to the lead slot on the blog index. */
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
