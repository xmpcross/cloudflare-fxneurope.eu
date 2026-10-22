---
title: "Hand-offs are a feature, not a failure"
description: "An agent that never hands over is either doing very easy work or doing hard work badly. How we design the moment it passes to a person."
date: 2026-07-15
topic: Product
author: Amara Okafor
cover: ./cover.png
coverAlt: "A white handshake icon on an orange dithered field"
coverArt: handshake
coverTone: ember
tags: [hand-off, helpdesk, design]
---

Every automation project eventually gets a dashboard with a containment rate on it, and the number becomes a target. Once it is a target, hand-offs start to look like failures, and teams make them harder to reach. Customers notice long before the dashboard does.

We think about it the other way round. The hand-off is one of the most important features an agent has.

## When an agent should hand over

We encode hand-off rules in the flow, not in the prompt, so they cannot be talked around:

- The customer asks for a person. Once is enough.
- A rule sends the case for review, such as a refund above the auto-approval limit.
- The topic is on a restricted list, such as clinical advice or a bereavement.
- The agent has failed to make progress on the same intent twice in a row.

That last rule is the one teams most often leave out, and it is the one customers are most grateful for.

## What a good hand-off carries

A hand-off that makes the customer repeat themselves is worse than no agent at all. Every hand-off in Synth arrives in the helpdesk queue with:

1. A three-line summary of what the customer wants.
2. Everything the agent already verified, such as identity, order and eligibility.
3. What it tried and why it stopped.
4. The full transcript, one click away.

In our measurements, a hand-off with that context is closed in about half the time of a cold transfer, because the person picking it up starts at the decision rather than the discovery.

## Measuring it honestly

We report resolution, not containment. A conversation counts as resolved when the customer's problem was closed without a hand-off and they did not come back about the same issue within seventy-two hours. A conversation that was contained because the customer gave up is not resolved, and we do not count it.

It makes our numbers lower than a containment rate would. It also makes them true, and customers trust a number more when they can see how it could have been gamed and was not.

## Pricing follows the same logic

This is also why hand-offs are free in our pricing. If we charged for every conversation, we would have a financial reason to keep people away from your team. Charging for resolutions means our incentive is the same as yours: solve what can be solved, and hand over the rest cleanly.
