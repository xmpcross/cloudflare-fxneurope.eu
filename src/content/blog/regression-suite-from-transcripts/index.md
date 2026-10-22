---
title: "How to build a regression suite from real transcripts"
description: "Synthetic test cases miss the strange things customers actually say. A step-by-step guide to turning your history into tests."
date: 2026-07-02
topic: Guides
author: Daniel Reyes
cover: ./cover.png
coverAlt: "A white flask icon on a dark dithered field"
coverArt: flask-conical
coverTone: smoke
tags: [testing, evaluation, playbook]
---

Every change to an agent is a bet: a new knowledge article, a reworded instruction, a model upgrade. A regression suite is how you find out whether the bet paid off before your customers do. The best suites are built from real conversations, not invented ones.

## Step one: export and sample

Export three months of transcripts from the queue you are automating. Sample by intent rather than at random, so rare but important intents are represented. A good starting size is twenty to forty conversations per intent.

## Step two: strip personal data

Replace names, emails, phone numbers, addresses and account numbers with consistent placeholders. Consistent matters: if a customer's order number appears three times, it should become the same placeholder three times, or the conversation stops making sense.

## Step three: turn each transcript into a case

A case is the customer's side of the conversation plus the facts the agent should find. You are not testing that the agent says the same words the human did; you are testing that it reaches an acceptable outcome.

```yaml
id: returns-0142
intent: return_request
customer:
  - "hi, the jacket I ordered is too small"
  - "order is {{order_id}}"
  - "can I swap it for a large instead of a refund?"
fixtures:
  order: { status: delivered, ageDays: 9, items: [{ sku: JKT-M, size: M }] }
  stock: { JKT-L: 4 }
expect:
  outcome: exchange_created
  must_mention: ["exchange", "large"]
  must_not: ["refund issued"]
```

## Step four: run it on every change

Run the suite automatically when anything that affects the agent changes, and block the change if any score drops below its threshold. Keep the scoring rubric the same one you use in production, so a pass in the suite means the same thing as a good score live.

## Step five: keep feeding it

The suite is never finished. Every week, add the five lowest-scoring live conversations as new cases once you have fixed whatever went wrong. Within a few months, the suite becomes a record of every mistake your agent has made and a guarantee that it will not make them again.

## A few habits that help

- Name cases after what they test, not after the ticket they came from.
- Keep fixtures small. A case that needs a whole product catalogue is really five cases.
- Delete cases that no longer reflect your policy. A suite that tests old rules will block good changes.
- Review suite failures as a team once a week. It is the fastest way for everyone to learn how the agent thinks.
