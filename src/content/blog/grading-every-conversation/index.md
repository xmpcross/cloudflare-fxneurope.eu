---
title: "Grading every conversation: what changed when we stopped sampling"
description: "Reviewing fifty tickets a week felt rigorous. Scoring all of them showed us how much the sample was hiding."
date: 2026-09-09
topic: Research
author: Ines Moreau
coauthors: [Tomasz Wrona]
cover: ./cover.png
coverAlt: "A white gauge icon on a dark dithered field"
coverArt: gauge
coverTone: smoke
tags: [evaluation, quality]
cta:
  after: 2
  eyebrow: Score your own transcripts
  title: Grade a week of your conversations, free
  body: Send us a week of transcripts and a rubric. You get every conversation scored, with the reviewer notes attached.
---

For most of the history of customer service, quality assurance has meant a person reading a small sample of conversations and filling in a scorecard. It is slow, it is expensive, and it works about as well as reading fifty pages of a novel at random and reviewing the plot.

When we started scoring every conversation with a reviewer model, we assumed the main benefit would be coverage. It turned out to be something else.

## The sample was not random

Nobody picks a QA sample at random, even when they mean to. Reviewers skip the very long conversations because they take too long. They skip the very short ones because there is nothing to score. They gravitate toward the channels and intents they know.

When we compared a quarter of hand-picked samples with full coverage for the same customer, the sample overstated quality by six points. Almost all of the gap came from two places the sample barely touched: conversations over forty turns and voice calls that ended in a transfer.

## What a score is for

A single quality number is useful for a dashboard and almost useless for fixing anything. The value is in the breakdown. We score each conversation on four criteria and keep them separate all the way up:

| Criterion  | What it checks                                       | Weight |
| ---------- | ---------------------------------------------------- | ------ |
| Accuracy   | Every factual claim matches knowledge or tool output | 35%    |
| Policy     | No action or promise outside the written rules       | 30%    |
| Resolution | The customer's actual problem was closed             | 20%    |
| Tone       | Brief, warm, no filler, matches the brand guide      | 15%    |

Rolled up by intent and by flow step, those four numbers point at a specific place. "Quality dropped" becomes "accuracy on warranty questions dropped after Tuesday's knowledge sync", which is a problem someone can fix before lunch.

## Trusting the reviewer

The obvious objection is that we are using a model to check a model. We take it seriously. Every rubric ships with a calibration set of conversations that people have scored, and the reviewer has to agree with the human consensus within a set tolerance before its scores are shown to anyone.

We also publish the disagreements. When the reviewer and the humans differ, the conversation goes into a queue, and about a third of the time the humans change their minds. The rubric was ambiguous, not the reviewer.

## What we would tell a team starting out

- Score everything, but read some of it yourself every week. The scores tell you where to look; they do not replace looking.
- Keep criteria separate. A blended number hides the one thing that moved.
- Calibrate before you trust, and recalibrate every time the rubric changes.
- Treat reviewer disagreements as rubric bugs until proven otherwise.
