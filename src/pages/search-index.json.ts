import type { APIRoute } from "astro";
import { getPosts, searchItems } from "@/lib/posts";

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(searchItems(await getPosts())), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
