---
title: VLSP 2018 NER
description: Quick reference page for a Vietnamese named entity recognition benchmark.
date: 2026-03-03
size: Medium-scale annotated corpus
tasks:
  - named-entity-recognition
  - sequence-labeling
downloadLinks:
  - label: Official source
    url: https://vlsp.org.vn/
  - label: Project page
    url: https://vlsp.org.vn/
notes: Useful as a benchmark reference, but annotation assumptions should be checked before direct reuse.
tags:
  - datasets
  - vietnamese-nlp
  - ner
featured: true
---

This dataset is useful for benchmarking Vietnamese NER systems, but downstream reuse should verify tokenization assumptions and annotation guidelines.

## What to inspect first

- entity label inventory
- segmentation convention
- sentence boundaries
- train/test split design
