---
name: store-landing-page
description: Build a high-converting landing page or a full mini website for products in the owner's Shopify store, from their real EcomBoost AI data. Use when the owner asks for a landing page, sales page, product page, website, microsite, Black Friday page, or a page for an ad campaign.
license: MIT
---

# Store landing page

Build a finished, self-contained page the owner can publish, using only real product data. Answer in the language the user writes in, and write the page in the language the owner's customers speak (ask once if it isn't clear).

## 1. Get the real data first

The `ecomboost` tools must be available (see the `shopify-store-review` skill for sign-in steps).

- Ask which product or collection the page is for. If the owner doesn't know, call `search_products` with `filter: top_sellers` and suggest the best seller that still has stock.
- Call `search_products` with the product name to get its id, price, stock and whether a description exists.
- Call `get_sales` (days: 30, `product_query` = the product name) to know if it is selling.
- Call `get_store_opportunities` to catch problems the page would expose (out of stock, dead listings).

Never invent features, materials, sizes, reviews, ratings, customer counts, guarantees, shipping times or discounts. If the page needs a fact the tools did not return, ask the owner for it, or leave a clearly marked placeholder like `[ADD: material]` and list every placeholder at the end.

## 2. Plan the page

One page, one product (or one collection), one goal: the click to buy. Sections, in order:

1. Hero: product name, one-line promise drawn from what the product really is, price, primary button.
2. Why it matters: three benefits, each tied to a real detail.
3. Details: what it is, who it's for, what's included. Use the owner's facts only.
4. Proof: only proof that exists (real reviews the owner pastes, real sales counts from `get_sales` if they want to show them). No proof? Skip the section.
5. FAQ: shipping, returns, sizing — answered only with the owner's real policies.
6. Final call to action.

Buttons link to the product on the owner's store: `https://STORE_DOMAIN/products/HANDLE`. Ask for the domain if you don't have it.

## 3. Build it

- One `index.html` file: inline CSS, no external scripts, mobile first, fast. System font stack. Real `<img>` tags only for image URLs the owner provides; otherwise a neutral placeholder block with alt text.
- Add `<title>`, meta description, Open Graph tags, and schema.org `Product` JSON-LD with the real name, price, currency and availability. That JSON-LD also helps AI shopping assistants read the product.
- Accessible: contrast, alt text, heading order, buttons at least 44px tall.
- For a full website, build `index.html` plus one page per product, sharing one CSS file.

Open the file to check it renders, then give the owner the file path and how to publish: paste into a Shopify page (Online Store → Pages, or a custom Liquid section), or host it anywhere static.

## 4. Offer the next step

If the product has no description in the store (`hasDescription: false`), offer to put the page's product copy in the store with `preview_listing_change`. Show the preview and wait for an explicit yes before `apply_change`. If the preview says `planAllowsApply: false`, say once that publishing needs a paid plan and give the `upgradeAt` link.
