---
title: "Nine thousand rebookings before breakfast"
description: "When a winter storm grounded two hundred flights, an airline's agent handled the morning. What we saw from the inside."
date: 2026-06-18
topic: Company
author: Daniel Reyes
cover: ./cover.png
coverAlt: "A white plane icon on an orange dithered field"
coverArt: plane
coverTone: ember
tags: [travel, scale, customers]
---

At 4:10 on a Tuesday morning last January, Vela Air cancelled the first wave of flights out of its two northern hubs. By 5:00, two hundred departures were grounded and roughly twenty-six thousand passengers needed to know what came next.

The contact centre's morning shift started at 7:00.

## What the agent was set up to do

Vela had launched with us four months earlier, on a narrow scope: booking changes and baggage questions, on chat and phone. Disruption rebooking was a flow they had built and tested but had only used on a handful of single-flight cancellations.

The flow itself was straightforward. For each affected passenger, find the next available itinerary under the airline's rebooking rules, offer it, and let the passenger accept, choose another option or ask for a refund. Anything unusual, such as unaccompanied minors, connecting partner flights or medical assistance, went straight to a person.

## The first three hours

Between 4:30 and 7:30 the agent handled a little over eleven thousand conversations across chat, SMS and phone. Nine thousand of them ended with a confirmed new booking. Most of the rest were refunds or passengers choosing to wait for more information. Four hundred and twelve were handed to people, each with a summary and the options already checked.

Median time to a confirmed rebooking was three minutes and forty seconds. On a normal disruption morning, the median wait just to reach an agent had been over two hours.

## What nearly went wrong

Around 5:45 the scores for one intent dipped. Passengers on a codeshare route were being offered itineraries on the partner airline that the partner had not yet confirmed. The flow had a rule for this case, but the partner's availability feed was running forty minutes behind.

The operations lead saw the dip in grading, paused that branch of the flow and routed those passengers to the hand-off queue. The change took two minutes. Without per-intent scores, it would have surfaced as angry calls mid-morning.

## What the team did with the time

By the time the morning shift arrived, the queue was not a wall of people waiting to be rebooked. It was four hundred cases that genuinely needed a person, each with the context attached. The team spent the day on those, and on the passengers stranded at airports, which is the work people are uniquely good at.

That is the part of the story Vela's customer care director tells most often. The agent did not replace her team that morning. It gave them the morning back.
