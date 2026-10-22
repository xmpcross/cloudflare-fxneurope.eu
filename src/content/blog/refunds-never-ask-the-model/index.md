---
title: "Why our refund flow never asks the model for permission"
description: "Language models are good at conversation and bad at policy. Here is how we split the two, and what it did to our error rate."
date: 2026-09-16
topic: Engineering
author: Tomasz Wrona
cover: ./cover.png
coverAlt: "A white branching-flow icon on an orange dithered field"
coverArt: git-branch
coverTone: ember
tags: [flows, reliability, refunds]
cta:
  after: 2
featured: true
---

The first version of our refund agent was a single prompt. It had the returns policy pasted in, a tool to look up orders and a tool to issue refunds. In testing it was charming. In production, about one conversation in four hundred ended with a refund that the policy did not allow.

One in four hundred sounds small until you multiply it by a retailer's Black Friday.

## The model was never the problem

Every one of those bad refunds was a reasonable reading of the conversation. A customer said the parcel was "basically destroyed", the model agreed, and the damage threshold in the policy never came into it. The model was doing what models do: finding the most helpful continuation of the text in front of it.

The fix was not a better prompt. We tried eleven. The fix was to stop asking the model a question it should never have been asked.

## Conversation and decision are different jobs

A refund has two halves. One half is language: understanding what happened, asking for a photo, explaining the outcome kindly. The other half is arithmetic and policy: is the order delivered, is it within thirty days, is the amount under the limit that needs a human.

We now run those halves in different places:

- **The model** classifies intent, extracts fields and writes every sentence the customer reads.
- **The flow** is a fixed sequence of typed steps. It calls the order API, evaluates the rules and decides what happens.
- **The model never sees the decision as a choice.** It receives the outcome and writes it up.

The flow for a damaged-item refund is short enough to read in one breath:

```ts
flow("refund-damaged-item")
  .lookup("order", orders.get, { id: input.orderId })
  .rule("eligible", ({ order }) => order.status === "delivered" && order.ageDays < 30)
  .rule("autoApprove", ({ order }) => order.total <= 200)
  .branch({
    when: ["eligible", "autoApprove"],
    then: action(payments.refund, ({ order }) => ({ amount: order.total })),
    else: handoff("helpdesk", { reason: "refund needs review" }),
  });
```

## What changed

Policy errors went to zero, and they have stayed there for eleven months across every customer running the flow. That part we expected.

What we did not expect was the effect on the rest of the conversation. With the decision taken out of its hands, the model got better at the things it is good at. Replies became shorter and warmer because they were no longer hedging. Customers stopped arguing, because there was nothing to argue with: the agent was reporting a rule, not making a call.

> The model writes the reply. It never decides the money.

That sentence is now on a slide in every compliance review we do, and it shortens those reviews considerably.

## Where the line goes

Not everything belongs in a flow. If we wrote a flow for every question, we would have rebuilt the decision-tree bots that made everyone hate chat support in the first place.

### When it is a flow

Our rule of thumb is simple: if getting it wrong costs money, breaks a law or cannot be undone, it is a flow. Refunds, cancellations, address changes and identity checks all qualify.

### When it is conversation

Everything else. Explaining a delivery estimate, suggesting a size, walking someone through a settings page: the model handles these on its own, grounded in knowledge, and a wrong answer costs a follow-up question rather than money.

That line moves per customer, and it should. A bank draws it much further toward the flow side than a fashion retailer does. The point is that the line exists, it is written down, and someone other than the model decides where it sits.
