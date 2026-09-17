# SellAuth crypto checkout on the site

Goal: clicking a "Get 1B" (or custom amount) button shows payment on your own site — crypto address, amount, QR, live status — instead of sending people to a SellAuth page. Discord stays, but only as support.

## Why a small backend is required

SellAuth checkouts are created with your secret API key. Anything put in the website files is public, so a pure GitHub Pages site cannot hold that key — anyone could read it and create orders as you.

So the site needs a tiny server piece. Two free ways:

1. **Everything hosted here (recommended).** Site + server + database in one place, free tier, no key ever exposed. GitHub still keeps the code.
2. **Site stays on GitHub Pages, server lives here.** The page calls our server for checkout. Also free, but two places to manage and a small extra setup step for cross-site calls.

I will assume option 1 unless you say otherwise.

## What I need from you

1. SellAuth **API key** and **Shop ID** (I add them as protected secrets, never in the code).
2. Confirmation to create the products in SellAuth — or you create them and give me the product/variant IDs.
3. Which crypto coins you want offered (BTC, LTC, ETH, SOL, USDT…).
4. Whether the buyer must enter their Minecraft username before paying (recommended, so delivery is unambiguous).

## Flow after the change

```text
pick amount  ->  enter Minecraft username + email
             ->  site creates SellAuth order (server-side, key hidden)
             ->  payment panel on our page: coin choice, address, QR, amount, timer
             ->  status polls until paid
             ->  "Paid" screen with order ID + Join Discord for delivery/support
```

## Pricing, including the custom amount

Your existing scale (10% off at 100M rising to 30% at 1B+) keeps living on the site. The server recalculates the price from the requested amount before creating the order, so a tampered page cannot buy 5B for $1. Fixed packages map to fixed SellAuth products; the custom amount uses a variable-price order created through the API.

## Orders and stock

Paid orders are stored (order ID, item, amount, username, status) so you get an admin list of what to deliver, and stock counters can decrease automatically. A SellAuth webhook marks orders paid server-side — the page alone is never trusted for that.

## Technical notes

- Enable Lovable Cloud (database + server functions + secrets).
- `createServerFn` endpoints: `createCheckout` (validates amount, recomputes price, calls SellAuth), `getOrderStatus` (polls).
- Public route `src/routes/api/public/sellauth-webhook.ts` verifies the SellAuth signature, marks the order paid, and can fire your Discord webhook.
- `orders` table with RLS; only the server writes, buyers read their own order by ID token.
- Storefront buy buttons swap the current fake order-code modal for the real checkout panel; the Discord button stays on the paid screen.
- Verification step first: confirm SellAuth's API supports custom-price invoices and returns raw crypto address/QR data. If it only returns a hosted link, fallback is that link inside a modal on our domain, and I'll tell you before building.

## Out of scope

No changes to layout, copy, or animations beyond the checkout area. Tebex remains untouched.
