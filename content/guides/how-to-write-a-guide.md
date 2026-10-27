---
title: How to write a guide
description: The file format for guides on this site. This example stays hidden while draft is true.
date: 2026-10-27
draft: true
places:
  - hwk-coffee
  - the-lock-inn
---

This file is a draft, so it does not appear on the site. Copy it when you write a real guide, then remove `draft: true`.

## File

Save a Markdown file in `content/guides/`. The filename becomes the address. A file named `canal-cafes.md` is published at `/guides/canal-cafes`.

## Frontmatter

The block between the two `---` lines is required.

- `title` — the guide name.
- `description` — a short summary. It is used on the guides list and as the page description.
- `date` — written as `YYYY-MM-DD`. Newer dates are listed first.
- `places` — optional. A list of place slugs, taken from the last part of a place’s address, such as `hwk-coffee`. Those places are shown as cards at the bottom of the guide. Leave this out if the guide does not mention specific places.
- `draft` — set to `true` to hide the guide from the site, including the guides list, the homepage, and the sitemap. Remove the line, or set it to `false`, when you want it published.

## Writing

Write the guide below the second `---`. Blank lines start a new paragraph. A line starting with `##` is a heading. A line starting with `-` is a list item.
