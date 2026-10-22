import nodemailer from "nodemailer";

const LIMIT = 24 * 1024;
const EMAIL = /^[^\s@<>\x00-\x1f\x7f]+@[^\s@<>\x00-\x1f\x7f]+\.[^\s@<>\x00-\x1f\x7f]+$/;
const lengths = {
  name: 200,
  email: 200,
  company: 200,
  website: 500,
  subject: 100,
  body: 5000,
  "bot-field": 200,
};

export function smtpOptions(env) {
  const host = env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(env.SMTP_PORT || 465);
  if (!["smtp.gmail.com", "smtp-relay.gmail.com"].includes(host) || ![465, 587].includes(port))
    return null;
  if (env.SMTP_USER !== "kritin@fxnholdings.com" || !env.SMTP_PASS) return null;
  return {
    host,
    port,
    secure: port === 465,
    requireTLS: true,
    name: "fxneurope.eu",
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS.replace(/\s/g, "") },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    disableFileAccess: true,
    disableUrlAccess: true,
  };
}

export async function deliver(env, fields, createTransport = nodemailer.createTransport) {
  const options = smtpOptions(env);
  const to = "contact@fxneurope.eu";
  if (!options || !EMAIL.test(to)) return false;
  const transport = createTransport(options);
  try {
    const result = await transport.sendMail({
      from: { name: "FXN Europe website", address: env.SMTP_USER },
      to,
      replyTo: fields.email,
      subject: `[FXN Europe] ${fields.subject || "Website enquiry"}`,
      text: [
        "New enquiry from the FXN Europe contact form",
        "",
        `Name: ${fields.name}`,
        `Email: ${fields.email}`,
        `Company: ${fields.company || "Not provided"}`,
        `Website or order reference: ${fields.website || "Not provided"}`,
        `Subject: ${fields.subject || "Website enquiry"}`,
        "",
        fields.body,
      ].join("\n"),
    });
    return result.accepted?.length > 0;
  } finally {
    transport.close();
  }
}

async function readBody(request) {
  if (Number(request.headers.get("content-length")) > LIMIT) throw new RangeError();
  const reader = request.body?.getReader();
  if (!reader) throw new TypeError();
  let size = 0;
  const chunks = [];
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > LIMIT) {
        await reader.cancel();
        throw new RangeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const blob = new Blob(chunks);
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) return JSON.parse(await blob.text());
  if (!type.includes("application/x-www-form-urlencoded") && !type.includes("multipart/form-data"))
    throw new TypeError();
  return Object.fromEntries(
    await new Response(blob, { headers: { "content-type": type } }).formData(),
  );
}

// Log only allowlisted protocol codes, never raw SMTP responses or message data.
export function smtpFailureDetails(error) {
  const codes = [
    "EAUTH",
    "ECONNECTION",
    "ECONNRESET",
    "ETIMEDOUT",
    "ESOCKET",
    "EDNS",
    "EENVELOPE",
    "EMESSAGE",
    "ESTREAM",
    "ETLS",
  ];
  const stages = ["CONN", "EHLO", "HELO", "STARTTLS", "AUTH", "MAIL", "RCPT", "DATA"];
  const stage = typeof error?.command === "string" ? error.command.split(" ")[0] : "";
  return {
    code: codes.includes(error?.code) ? error.code : "UNKNOWN",
    responseCode:
      Number.isInteger(error?.responseCode) &&
      error.responseCode >= 400 &&
      error.responseCode <= 599
        ? error.responseCode
        : null,
    stage: stages.includes(stage) ? stage : "UNKNOWN",
  };
}

// Per-instance protection; configure a Cloudflare rate-limit rule for a distributed limit.
export function createContactHandler(send = deliver) {
  const attempts = new Map();
  return async ({ request, env }) => {
    const reference = crypto.randomUUID();
    const wantsJson =
      request.headers.get("accept")?.includes("application/json") ||
      request.headers.get("content-type")?.includes("application/json");
    const reply = (status, message) => {
      const headers = {
        "cache-control": "no-store",
        "x-content-type-options": "nosniff",
        "x-contact-reference": reference,
      };
      if (status === 429) headers["retry-after"] = "600";
      if (wantsJson)
        return Response.json(status === 200 ? { ok: true } : { error: message, reference }, {
          status,
          headers,
        });
      if (status === 200)
        return new Response(null, {
          status: 303,
          headers: { ...headers, location: "/en/contact/thanks/" },
        });
      return new Response(
        `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Contact FXN Europe</title><h1>Message not sent</h1><p>${message}</p><p><a href="/en/contact/">Return to the contact form</a> or email <a href="mailto:contact@fxneurope.eu">contact@fxneurope.eu</a>.</p></html>`,
        { status, headers: { ...headers, "content-type": "text/html; charset=utf-8" } },
      );
    };
    if (request.method !== "POST")
      return new Response("Method not allowed", {
        status: 405,
        headers: { Allow: "POST", "cache-control": "no-store" },
      });
    const origin = request.headers.get("origin");
    if (
      (origin && origin !== new URL(request.url).origin) ||
      request.headers.get("sec-fetch-site") === "cross-site"
    )
      return reply(403, "Please submit the form from this website.");
    const now = Date.now();
    for (const [key, value] of attempts) if (value.expires <= now) attempts.delete(key);
    const ip = request.headers.get("cf-connecting-ip") || "local";
    const bucket = attempts.get(ip) || { count: 0, expires: now + 600000 };
    if (bucket.count >= 5 || (attempts.size >= 5000 && !attempts.has(ip)))
      return reply(429, "Too many attempts. Please wait ten minutes before trying again.");
    bucket.count++;
    attempts.set(ip, bucket);
    let data;
    try {
      data = await readBody(request);
    } catch (error) {
      return reply(
        error instanceof RangeError ? 413 : 400,
        "The form could not be read. Please check your message and try again.",
      );
    }
    if (!data || typeof data !== "object" || Array.isArray(data))
      return reply(400, "Invalid form submission.");
    const fields = {};
    for (const [key, max] of Object.entries(lengths)) {
      if (data[key] != null && typeof data[key] !== "string")
        return reply(400, "Please check the form fields.");
      fields[key] = (data[key] || "").trim();
      if (fields[key].length > max)
        return reply(400, "One of the form fields is too long. Please shorten it and try again.");
    }
    if (fields["bot-field"]) return reply(200);
    if (!fields.name || !fields.body || !EMAIL.test(fields.email))
      return reply(400, "Please provide your name, a valid email address and a message.");
    if (
      [fields.name, fields.company, fields.website, fields.subject].some((value) =>
        /[\x00-\x1f\x7f]/.test(value),
      )
    )
      return reply(400, "Please remove line breaks from the short form fields.");
    if (!smtpOptions(env))
      return reply(
        503,
        "The contact form is temporarily unavailable. Please email contact@fxneurope.eu directly.",
      );
    try {
      if (!(await send(env, fields)))
        return reply(502, "Your message could not be sent. Please try again or email us directly.");
      return reply(200);
    } catch (error) {
      console.error(
        JSON.stringify({
          event: "contact_delivery_failed",
          reference,
          ...smtpFailureDetails(error),
        }),
      );
      return reply(502, "Your message could not be sent. Please try again or email us directly.");
    }
  };
}
