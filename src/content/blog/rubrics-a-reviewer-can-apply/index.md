---
title: "Writing rubrics a reviewer model can actually apply"
description: "Most quality rubrics are written for people who already know what good looks like. Here is how to write one for a model."
date: 2026-08-07
topic: Research
author: Ines Moreau
cover: ./cover.png
coverAlt: "A white checked-clipboard icon on an orange dithered field"
coverArt: clipboard-check
coverTone: ember
tags: [evaluation, rubrics]
---

Hand a typical QA scorecard to a reviewer model and it will return confident, consistent and mostly meaningless scores. The problem is rarely the model. It is that the scorecard was written for people who share years of unstated context about what "empathetic" means at this company.

A rubric for a model has to carry that context itself.

## Replace adjectives with observations

"Was the agent empathetic?" is not a criterion; it is an invitation to guess. Rewrite it as things a reader could point to in the transcript:

- The agent acknowledged the customer's problem before asking for information.
- The agent did not repeat an apology more than once.
- The agent did not use the phrases on the brand guide's "avoid" list.

Each of those can be checked, and each can be wrong in a way you can see.

## Anchor every score

A five-point scale with no anchors produces a lot of fours. Give the reviewer an example of each level, taken from real conversations, and tell it which observation separates one level from the next.

```yaml
criterion: accuracy
question: "Does every factual claim match the knowledge base or a tool result?"
levels:
  5: "Every claim is supported. Nothing is invented."
  3: "One minor unsupported detail that does not change the outcome."
  1: "A claim that is wrong or unsupported and changes what the customer will do."
evidence: required
examples:
  - transcript: conv_2210
    level: 3
    why: "Said delivery is 'usually two days'; the policy says three to five."
```

The `evidence: required` line matters more than it looks. It makes the reviewer quote the part of the transcript that justifies the score, which makes disagreements quick to resolve.

## One question per criterion

If a criterion contains the word "and", split it. "Accurate and complete" is two questions, and a conversation can easily be one without the other. When they share a score, you can no longer tell which one moved.

## Calibrate with people, not against them

Before a rubric goes live, three people score the same forty conversations independently. Where they disagree with each other, the rubric is ambiguous, and no model will fix that. Where they agree with each other and disagree with the reviewer, look at the reviewer's quoted evidence. Usually the rubric has a gap the humans filled from experience.

Fix the rubric, rerun, and repeat until the reviewer lands within a point of the human consensus on at least nine in ten conversations. Then, and only then, let it score production traffic.
