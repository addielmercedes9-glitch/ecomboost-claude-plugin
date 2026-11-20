---
name: product-import
description: Prepare products for import into the owner's Shopify store as a Shopify-ready product CSV - from a supplier list, spreadsheet, catalog, product URLs or a description - with clean titles, descriptions, SEO and prices. Use when the owner asks to import, add, upload or bulk-create products, or to clean up a supplier catalog.
license: MIT
---

# Product import

Build a CSV the owner imports in Shopify Admin (Products → Import). EcomBoost AI does not create products in Shopify itself, so never say the products were added: the owner runs the import. Answer in the language the user writes in.

## 1. Gather the source

Ask for what they have: a supplier spreadsheet or CSV, a list of product URLs the owner has the right to use, or a plain description. Read files with the usual tools.

Call `search_products` (no filter, limit 25) to see the store's existing products, so you match their naming and price range and don't create duplicates. Flag any product that already exists by title.

## 2. Clean every product

For each product:

- **Title**: clear and specific — what it is, key attribute, variant. No supplier codes or all caps.
- **Description**: plain HTML (`<p>`, `<ul><li>`), written fresh, not pasted from the supplier. Only facts from the source; mark gaps as `[ADD: ...]`.
- **SEO title** (max 70) and **SEO description** (max 320).
- **Price**: the owner's price. If you only have a cost, ask for their markup; never guess a price. Put the cost in `Cost per item` so EcomBoost can protect margins later.
- **Variants**, **SKU**, **inventory**, **weight**, **tags**, **product type**, **vendor**.
- **Image alt text** for every image URL.

Copying text or images from someone else's site is not allowed unless the owner says they own or license it; ask if it's unclear.

## 3. Write the CSV

Use Shopify's product CSV columns, in this order: `Handle, Title, Body (HTML), Vendor, Product Category, Type, Tags, Published, Option1 Name, Option1 Value, Variant SKU, Variant Grams, Variant Inventory Qty, Variant Price, Variant Compare At Price, Variant Requires Shipping, Variant Taxable, Image Src, Image Position, Image Alt Text, SEO Title, SEO Description, Cost per item, Status`.

- One row per variant; extra rows for extra images share the same `Handle`.
- Set `Status` to `draft` so nothing goes live before the owner reviews it.
- UTF-8, quoted fields, validate that every row has a Handle and that prices are numbers.

Save as `shopify-import-YYYY-MM-DD.csv`, show a short table of what's in it, list every `[ADD: ...]`, and give the import steps: Shopify Admin → Products → Import → choose the file → review → Import. After importing and syncing EcomBoost, run `get_ai_readiness_score` to see the catalog's new AI-readiness score.
