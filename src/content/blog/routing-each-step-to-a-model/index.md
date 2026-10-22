---
title: "Routing each step to a different model"
description: "One model per agent is simple and expensive. One model per step is cheaper, faster and easier to change. Here is how routing works."
date: 2026-07-29
topic: Product
author: Amara Okafor
cover: ./cover.png
coverAlt: "A white route icon on a dark dithered field"
coverArt: route
coverTone: smoke
tags: [models, routing, cost]
---

When we started, every agent ran on one model. It was the obvious choice, and for a demo it is the right one. In production it meant we paid frontier prices to classify "where is my order" and waited frontier latency to extract a postcode.

Model routing is now a setting on every step of a flow.

## Different steps want different things

A single conversation turn involves several distinct jobs, and they do not have the same needs:

- **Classifying intent** wants speed and consistency. A small model trained or prompted for your intents does it in tens of milliseconds.
- **Extracting fields** wants structured output and strict formats. Cheap, fast and very reliable with a schema.
- **Writing the reply** wants fluency, tone and the ability to follow a brand guide. This is where a larger model earns its cost.
- **Grading** wants careful reading, and it runs after the conversation, so latency barely matters.

## What it looks like in a flow

Each step names a tier rather than a vendor. Tiers map to models in one place, so changing provider is a one-line edit followed by a regression run.

```ts
export const tiers = {
  fast: { provider: "open-weight", model: "intent-small", maxLatencyMs: 80 },
  standard: { provider: "frontier-a", model: "general", maxLatencyMs: 900 },
  careful: { provider: "frontier-b", model: "reasoning", maxLatencyMs: 20000 },
};

flow("order-status")
  .classify({ tier: "fast" })
  .extract({ tier: "fast", schema: OrderQuery })
  .lookup("order", orders.get)
  .compose({ tier: "standard", style: "brand/warm-brief" })
  .grade({ tier: "careful", rubric: "support-v3" });
```

## What changed for customers

Across the customers who moved from a single model to routed tiers, the median cost per resolved conversation fell by a little over half. Median response time on chat fell by forty percent, mostly because classification and extraction stopped queueing behind a large model.

Quality did not move in either direction by more than the noise between weekly runs. That was the result we cared about most, and it is the reason routing is now the default rather than an option.

## Changing a model without changing the agent

The less obvious benefit is freedom. Because steps name tiers, a customer can move their `standard` tier to a new model, run the regression suite against real transcripts, compare scores side by side and ship the change the same afternoon. Nothing about the agent's persona, knowledge or flows has to be rebuilt.

That turns a model upgrade from a project into a test run, which is how it should feel.
