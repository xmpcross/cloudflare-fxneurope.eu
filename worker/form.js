import { sendEmail } from './email.js';
const hits = new Map();
const reply = (status, text) => new Response(text, {status, headers: {'Content-Type':'text/plain; charset=utf-8', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff'}});
export async function handleForm(request, env, send = sendEmail) {
  if (request.method !== 'POST') return reply(405, 'Method not allowed');
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return reply(403, 'Invalid origin');
  if (!request.headers.get('Content-Type')?.startsWith('application/x-www-form-urlencoded')) return reply(415, 'Unsupported content type');
  if (Number(request.headers.get('Content-Length')) > 65536) return reply(413, 'Message too large');
  const reader = request.body?.getReader();
  if (!reader) return reply(400, 'Missing form');
  const chunks = []; let size = 0;
  for (;;) {
    const {done, value} = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 65536) { await reader.cancel(); return reply(413, 'Message too large'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  const fields = new URLSearchParams(new TextDecoder().decode(bytes));
  if (fields.get('bot-field')) return reply(200, 'OK');
  const name = (fields.get('name') || '').replace(/[\r\n]+/g,' ').trim().slice(0,200);
  const email = (fields.get('email') || '').trim();
  const message = (fields.get('message') || '').trim().slice(0,5000);
  if (!name || !message || email.length > 200 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) return reply(400, 'Please add your name, valid email and message.');
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(time => now-time < 600000);
  if (recent.length >= 5) return reply(429, 'Too many messages. Please try again later.');
  if (hits.size > 5000) hits.clear();
  hits.set(ip, [...recent, now]);
  const result = await send(env, {replyTo:email, subject:`[fxneurope.eu] Contact form from ${name}`,text:`Name: ${name}\nEmail: ${email}\n\n${message}\n`});
  if (!result.ok) return reply(result.reason === 'not_configured' ? 503 : 502, 'Message could not be sent. Email contact@fxneurope.eu instead.');
  return reply(200, 'OK');
}
