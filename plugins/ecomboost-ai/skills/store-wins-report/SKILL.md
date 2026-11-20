---
name: store-wins-report
description: Make a clear, shareable report of everything EcomBoost AI changed in the owner's Shopify store and what it achieved - changes made, proven results, what is still being measured, and the AI-readiness score. Use when the owner asks what was changed, what EcomBoost did, whether it is worth it, for a monthly or client report, or to show results to a partner, client or investor.
license: MIT
---

# Store wins report

Show the owner, honestly, what was done in their store and what it achieved. Answer in the language the user writes in.

## 1. Get the facts

- `get_change_history` (limit 50): every change, product and date.
- `get_action_outcomes`: revenue recovered, proven wins, per-product attribution, what is still measuring and when the next result lands.
- `get_ai_readiness_score`: how readable the catalog is for AI shopping assistants.
- `get_sales` (days: 30): how the store moved overall.
- `get_store_opportunities`: what is still open.

If a tool fails, say which part of the report is missing and why; don't fill it in.

## 2. Tell it straight

Write in past tense: "We rewrote the SEO of 8 products", not "you should".

- **What we did**: changes grouped by kind (SEO, descriptions, prices, landing, campaigns), with counts, product names and dates.
- **What it achieved**: revenue recovered and proven wins exactly as `get_action_outcomes` returns them. Use the attribution labels as its legend defines them — an `aligned` result moved with the whole store and is not a win for the change. A result with `overlappingChanges` above 0 can't be credited to one change.
- **Still being measured**: how many, and when the next result is due.
- **No proven result yet?** Say it plainly and why (for example, the store had no sales in the window, so nothing can be measured). Then show the progress that *is* real: products completed, AI-readiness score, opportunities closed. Never present an unmeasured change as a win.
- **Next step**: the single highest-impact open opportunity.

## 3. Deliver it

Build one self-contained `store-report-YYYY-MM.html`: inline CSS, mobile friendly, printable, with a headline number, the AI-readiness score as a 0–100 gauge, a table of changes, and the results. No invented numbers or charts from data the tools didn't return. Open it to check it renders, then give the owner the path. They can send it to a partner or client or print it to PDF.
