import test from "node:test";
import assert from "node:assert/strict";
import {
  createContactHandler,
  smtpOptions,
  deliver,
  smtpFailureDetails,
} from "../server/contact.mjs";

const env = { SMTP_USER: "kritin@fxnholdings.com", SMTP_PASS: "test-app-password" };
const data = {
  name: "Example Visitor",
  email: "visitor@example.com",
  subject: "General enquiry",
  body: "A test enquiry.",
  company: "",
  website: "",
};
function request(value = data, headers = {}) {
  return new Request("https://fxneurope.eu/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://fxneurope.eu", ...headers },
    body: JSON.stringify(value),
  });
}

test("validated enquiry is delivered once with visitor address available for Reply-To", async () => {
  let received;
  const handle = createContactHandler(async (config, fields) => {
    received = fields;
    assert.equal(config.SMTP_USER, env.SMTP_USER);
    return true;
  });
  const res = await handle({ request: request(), env });
  assert.equal(res.status, 200);
  assert.equal(received.email, data.email);
  assert.equal(received.body, data.body);
  assert.deepEqual(await res.json(), { ok: true });
});

test("rejects invalid email, header injection, missing message and invalid types before delivery", async () => {
  for (const change of [
    { email: "invalid" },
    { email: "x@example.com\r\nBcc: victim@example.com" },
    { subject: "Hi\r\nBcc: victim@example.com" },
    { body: "" },
    { name: ["array"] },
  ]) {
    const handle = createContactHandler(async () => {
      assert.fail("must not send");
    });
    assert.equal((await handle({ request: request({ ...data, ...change }), env })).status, 400);
  }
});

test("blocks cross-origin submissions", async () => {
  const handle = createContactHandler(async () => assert.fail("must not send"));
  assert.equal(
    (await handle({ request: request(data, { origin: "https://unrelated.example" }), env })).status,
    403,
  );
});

test("honeypot submissions do not send mail", async () => {
  const handle = createContactHandler(async () => assert.fail("must not send"));
  assert.equal(
    (await handle({ request: request({ ...data, "bot-field": "spam" }), env })).status,
    200,
  );
});

test("missing SMTP credentials produce a visible failure, never success", async () => {
  const handle = createContactHandler(async () => assert.fail("must not send"));
  assert.equal((await handle({ request: request(), env: {} })).status, 503);
});

test("SMTP rejection is reported as delivery failure", async () => {
  const handle = createContactHandler(async () => false);
  const res = await handle({ request: request(), env });
  assert.equal(res.status, 502);
  assert.ok((await res.json()).error);
});

test("limits oversized bodies and repeated submissions", async () => {
  const handle = createContactHandler(async () => true);
  assert.equal(
    (await handle({ request: request({ ...data, body: "x".repeat(25000) }), env })).status,
    413,
  );
  const limited = createContactHandler(async () => true);
  for (let i = 0; i < 5; i++)
    assert.equal((await limited({ request: request(), env })).status, 200);
  assert.equal((await limited({ request: request(), env })).status, 429);
});

test("ordinary form submissions redirect only after successful delivery", async () => {
  const handle = createContactHandler(async () => true);
  const res = await handle({
    request: new Request("https://fxneurope.eu/api/contact", {
      method: "POST",
      body: new URLSearchParams(data),
    }),
    env,
  });
  assert.equal(res.status, 303);
  assert.equal(res.headers.get("location"), "/en/contact/thanks/");
});

test("GET cannot trigger mail delivery", async () => {
  const handle = createContactHandler(async () => assert.fail("must not send"));
  assert.equal(
    (await handle({ request: new Request("https://fxneurope.eu/api/contact"), env })).status,
    405,
  );
});

test("Google SMTP uses TLS and rejects unsupported hosts and ports", () => {
  const config = smtpOptions(env);
  assert.equal(config.host, "smtp.gmail.com");
  assert.equal(config.port, 465);
  assert.equal(config.secure, true);
  assert.equal(config.requireTLS, true);
  assert.equal(smtpOptions({ ...env, SMTP_PORT: "25" }), null);
  assert.equal(smtpOptions({ ...env, SMTP_HOST: "unrelated.example" }), null);
  assert.equal(smtpOptions({ ...env, SMTP_PORT: "587" }).secure, false);
});

test("SMTP diagnostics expose only safe protocol codes", () => {
  const result = smtpFailureDetails({
    code: "EAUTH",
    responseCode: 535,
    command: "AUTH PLAIN secret-token",
    response: "private SMTP reply",
    message: "private visitor data",
  });
  assert.deepEqual(result, { code: "EAUTH", responseCode: 535, stage: "AUTH" });
  assert.deepEqual(
    smtpFailureDetails({ code: "secret-token", command: "private-address", responseCode: 999 }),
    { code: "UNKNOWN", responseCode: null, stage: "UNKNOWN" },
  );
});

test("sender and recipient are fixed and order references are accepted", async () => {
  let mail;
  let closed = false;
  const result = await deliver(
    { ...env, CONTACT_TO: "attacker@example.com" },
    { ...data, website: "Order #12345", to: "attacker@example.com", from: "attacker@example.com" },
    () => ({
      async sendMail(message) {
        mail = message;
        return { accepted: ["contact@fxneurope.eu"] };
      },
      close() {
        closed = true;
      },
    }),
  );
  assert.equal(result, true);
  assert.equal(mail.from.address, "kritin@fxnholdings.com");
  assert.equal(mail.to, "contact@fxneurope.eu");
  assert.equal(mail.replyTo, data.email);
  assert.ok(mail.text.includes("Order #12345"));
  assert.equal(closed, true);
  const handle = createContactHandler(async () => true);
  assert.equal(
    (await handle({ request: request({ ...data, website: "Order #12345" }), env })).status,
    200,
  );
  assert.equal(smtpOptions({ ...env, SMTP_USER: "other@example.com" }), null);
});
