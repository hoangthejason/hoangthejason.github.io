---
title: LLM serving notes for latency-sensitive applications
description: A short note on batching, context windows, and predictable latency.
date: 2026-03-09
topic: llm
tags:
  - llm
  - serving
  - systems
---

Serving quality is not just model quality. It also depends on predictable latency and operational simplicity.

## Immediate questions

- how large can prompt contexts become?
- when does batching stop helping?
- what metrics matter for user-facing latency?
