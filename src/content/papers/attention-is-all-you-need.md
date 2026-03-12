---
title: Attention Is All You Need
description: Paper note for the Transformer architecture paper.
date: 2026-03-01
authors:
  - Ashish Vaswani
  - Noam Shazeer
  - Niki Parmar
  - Jakob Uszkoreit
paperLink: https://arxiv.org/abs/1706.03762
problem: Recurrent architectures were hard to parallelize and limited long-range dependency modeling.
method: Replace recurrence with self-attention and stacked encoder-decoder blocks.
results: Strong machine translation performance with significantly better parallelism.
limitations: Quadratic attention cost with sequence length and limited discussion of long-context efficiency.
notes: Foundational for modern sequence modeling.
bibliography: /src/content/references/references.bib
tags:
  - transformers
  - deep-learning
  - sequence-modeling
featured: true
---

The main conceptual move is simple: treat pairwise token interaction as the primitive operation and build sequence modeling around it [@vaswani2017].

## Why it mattered

The paper changed both model design and infrastructure assumptions. Parallel training became much easier than with recurrent baselines.

## What I still watch for

The original formulation does not solve long-context efficiency. That problem became more visible as context windows expanded.
