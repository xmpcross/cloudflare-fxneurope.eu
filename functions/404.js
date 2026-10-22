export async function onRequest({ request, env }) {
  const response = await env.ASSETS.fetch(new Request(new URL("/404.html", request.url)));
  return new Response(response.body, { status: 404, headers: response.headers });
}
