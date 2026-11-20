---
name: shopify-store-review
description: Review a Shopify store connected to EcomBoost AI. Use when the owner asks how their store is doing, what to fix first, why sales changed, which products or ads to act on, whether past changes worked, or how to prepare for Black Friday or another peak.
license: MIT
---

# Shopify store review

Answer questions about the owner's store from their own data in EcomBoost AI. Answer in the language the user writes in.

## Before starting

The `ecomboost` tools must be available. If they are missing or ask for sign-in, tell the owner to:

1. Create a free account at https://www.ecomboostai.com/signup and connect their Shopify store.
2. Authenticate the `ecomboost` server (in Claude Code, run `/mcp`).

If a tool reports that no store is connected, say so and give the link it returns.

## Choose the workflow

**First question, or "how is my store doing?"**
Call `get_store_opportunities` and `get_sales` (days: 30). Open with the combined estimated impact, the largest opportunities (up to three) with dollar impact and `fixItAt` link, and how revenue and orders moved against the previous 30 days.

**Weekly review**
Call `get_sales` (days: 7), `get_store_opportunities`, `get_action_outcomes`, and `search_products` (filter: `low_stock`). Write a one-line verdict, the numbers that moved, proven wins, and the three next actions ranked by estimated impact.

**What to fix first**
Call `get_store_opportunities` and `get_change_history`. Don't recommend redoing a product changed recently. List the top three fixes by estimated impact, with one line on why each matters and its link.

**Did my changes work?**
Call `get_action_outcomes`. Give total revenue recovered and the number of proven wins. Use the attribution labels exactly as the legend defines them: a result aligned with the whole store is not a win for the change. Say how many changes are still being measured and when the next result is due.

**Black Friday or another peak**
Call `search_products` with `top_sellers`, then `low_stock`; `get_ad_performance` (days: 30); and `get_store_opportunities`. Return a checklist in order of urgency: restock, ads to scale or pause, then fixes.

**What did EcomBoost change? / Is it worth it?**
Use the `store-wins-report` skill.

**Can AI assistants recommend my products?**
Call `get_ai_readiness_score`, then `search_products` with `missing_description`. Give the score, the weakest parts, and the three fixes that raise it most. It measures readiness; never promise a recommendation.

**Competitors**
Call `get_competitor_analyses`, adding the competitor's name when the owner gives one.

## Reporting rules

- Report numbers exactly as the tools return them.
- Present estimated impact as an estimate, never as guaranteed revenue.
- Reading tools never change the store. A change happens only through a `preview_*` tool shown to the owner and an `apply_change` they explicitly approved; otherwise never say or imply that something was fixed, and point to the `fixItAt` link.
- If a preview returns `planAllowsApply: false`, say once that publishing needs a paid plan and give its `upgradeAt` link.
- If the result includes `lockedOpportunities`, say how many more were found and their combined estimated impact, and give the `upgradeAt` link. Don't guess what they are.
- Don't estimate data a tool did not return. Say what is missing.
