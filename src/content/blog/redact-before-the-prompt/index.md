---
title: "PII redaction before the prompt, not after"
description: "If personal data reaches a model, no amount of filtering afterwards takes it back. Where we redact, and why it has to be first."
date: 2026-06-04
topic: Engineering
author: Tomasz Wrona
cover: ./cover.png
coverAlt: "A white crossed-out eye icon on a dark dithered field"
coverArt: eye-off
coverTone: smoke
tags: [privacy, security, compliance]
---

There are two places you can remove personal data from an AI system: before it reaches the model, or after the model has produced its output. Only one of them actually protects anyone.

## Why after is too late

Filtering the output catches a card number before it is shown to the customer. It does nothing about the fact that the card number was sent to a model provider, written to their logs, held in their retention window and, depending on the contract, possibly used for something you did not agree to.

Output filtering is still worth doing as a second line. It cannot be the first.

## What we redact, and when

Every inbound message passes through redaction before it touches anything else, including our own logs:

1. **Pattern detection** for structured data: card numbers with a checksum test, IBANs, national ID formats per country, phone numbers and email addresses.
2. **Entity detection** for unstructured data: names, street addresses and dates of birth, using a small model that runs inside the customer's region.
3. **Custom rules** per deployment, such as policy numbers or patient identifiers that follow a customer-specific format.

Each match is replaced with a typed placeholder, such as `[CARD_1]` or `[NAME_2]`, and the real value goes into an encrypted vault scoped to that one conversation.

## The model works with placeholders

The model never needs the real value to do its job. It needs to know that a card was mentioned and which one. When a flow step needs the real value, for example to call a payment API, the flow retrieves it from the vault directly. The value goes from the vault to your system without passing through a prompt.

On the way out, placeholders in the reply are restored only if the rule for that type allows it. A customer's own first name comes back. Their card number never does.

## What it costs

Redaction adds about fifteen milliseconds per message at the median. It also makes a certain kind of bug impossible: there is no prompt anywhere in the system, including in debugging tools and traces, that contains a raw card number. That property is much easier to explain to an auditor than any number of output filters.

## A test worth running

Take a staging deployment, send it a message containing a test card number and then search every log, trace and provider dashboard you have for that number. If it appears anywhere other than the vault, you know where to start.
