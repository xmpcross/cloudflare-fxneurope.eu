---
title: "Sub-second voice: where the 800 milliseconds go"
description: "People notice a pause on the phone at around a second. This is the latency budget we work to, stage by stage."
date: 2026-08-28
topic: Engineering
author: Tomasz Wrona
cover: ./cover.png
coverAlt: "A white sound-wave icon on an orange dithered field"
coverArt: audio-lines
coverTone: ember
tags: [voice, latency, performance]
---

On a chat widget, a two-second reply feels fast. On a phone call, a one-second silence feels like the line dropped. Voice is the channel where latency stops being a metric and becomes the product.

Our target is a median of 800 milliseconds from the moment the caller stops speaking to the first audible syllable of the reply. Here is where that time goes.

## The budget

| Stage                      | Median | What it is doing                              |
| -------------------------- | ------ | --------------------------------------------- |
| End-of-turn detection      | 180 ms | Deciding the caller has finished, not paused  |
| Final transcription        | 90 ms  | Committing the last words of the utterance    |
| Intent and routing         | 60 ms  | Small, fast model picks the flow step         |
| Tools and rules            | 110 ms | Lookups run in parallel where they can        |
| First tokens of the reply  | 230 ms | Streaming from the response model             |
| First audio from synthesis | 130 ms | Speech starts before the sentence is finished |

The numbers do not add up to exactly 800 because several stages overlap. That overlap is most of the engineering.

## End of turn is the hardest 180 milliseconds

The naive approach waits for a fixed silence, say 700 milliseconds, and then assumes the caller is done. That alone blows the budget. We run a small model that listens to the audio and the partial transcript together and predicts whether the turn is over. "My account number is" followed by a pause is not the end of a turn. "That's all, thanks" is, and we can act on it almost immediately.

Getting this wrong in the other direction is worse than being slow. Interrupting a caller mid-sentence costs more trust than any pause.

## Start speaking before you know the whole answer

The response model streams tokens, and synthesis starts as soon as there is a phrase worth saying. Short, natural openings buy time without sounding like filler, because they are real parts of the answer: "Okay, I can see that order." By the time that phrase has been spoken, the rest of the sentence is ready.

## Speculate on tools

When the router is fairly sure which flow step comes next, we start its lookups before the transcription is final. If the guess is wrong, we throw the result away. About eighty percent of the time it is right, and those 110 milliseconds disappear into time we were already spending.

## Barge-in

Callers interrupt. When they do, playback stops within 150 milliseconds, the partial reply is marked as unheard, and the next turn knows exactly what the caller did and did not hear. It sounds like a small detail. In testing, it was the single biggest factor in whether people described the agent as "natural".
