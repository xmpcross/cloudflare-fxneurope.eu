import { handleForm } from '../worker/form.js';
export async function onRequest({request, env}) {
  const url = new URL(request.url);
  if (['/netlify-forms.html', '/__forms.html'].includes(url.pathname)) {
    return handleForm(request, env);
  }
  // ASSETS bypasses Functions, preserving a true 404 for legacy error URLs.
  url.pathname = '/404.html';
  const asset = await env.ASSETS.fetch(new Request(url, {method:'GET'}));
  return new Response(request.method === 'HEAD' ? null : asset.body, {status:404, headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
}
