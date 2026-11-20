---
name: sales-content-kit
description: Create ready-to-use sales content for the owner's Shopify products from their real EcomBoost AI data - ad copy, product descriptions, emails, social posts, short video scripts and promotion plans. Use when the owner asks for ads, copy, captions, posts, emails, a campaign, a promotion, or "help me sell more" of a product.
license: MIT
---

# Sales content kit

Turn the owner's real store data into content they can post or send today. Answer in the language the user writes in; write the content in the language of the owner's customers.

## 1. Pick what to sell, with data

Call these before writing anything:

- `search_products` with `filter: top_sellers` (what already sells) and `filter: no_sales` (what needs a push).
- `get_sales` (days: 30) for the trend and best sellers.
- `get_store_opportunities` for stock stuck unsold or other leaks a promotion could fix.
- `get_ad_performance` (days: 30) if ads are connected, to reuse the angles of campaigns that pay off.

Recommend one or two products and say why in one line each (for example: "100 units unsold, about $X of stock waiting" — numbers exactly as returned, estimates called estimates). Let the owner choose.

## 2. Write the kit

Save everything to one file, `sales-kit-PRODUCT.md`, with these sections:

- **Product description** for the store: short paragraph, 3–5 bullets, plain text.
- **SEO title** (max 70 characters) and **SEO description** (max 320).
- **3 ad variants** (Meta/TikTok): hook, body, call to action — each a different angle (problem, outcome, offer).
- **5 social posts**: caption plus a one-line image or video idea.
- **3 emails**: launch, reminder, last chance — subject line, preview text, body.
- **2 short video scripts** (15–30 s): shot by shot, with on-screen text.
- **Promotion plan**: 7 days, what to post and send each day.

Rules: use only real facts from the tools or the owner. No invented reviews, discounts, scarcity ("only 3 left") or claims. Mark any fact you need as `[ADD: ...]` and list them at the end. No vendor or AI-provider names in customer-facing copy.

## 3. Put it to work

- Offer to publish the description and SEO into the store with `preview_listing_change`. Show the before/after and wait for an explicit yes before `apply_change`. One yes covers one preview.
- For stock that isn't selling, offer `preview_opportunity_fix` with `clearance_discount` on the matching opportunity, and write the promo copy for it.
- If a preview says `planAllowsApply: false`, say once that publishing needs a paid plan and give the `upgradeAt` link; the kit file is still theirs to use.
- After applying, say results are measured over 14 days with `get_action_outcomes`, and that listing changes can be undone.
