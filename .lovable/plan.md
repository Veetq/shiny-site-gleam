# SellAuth crypto checkout on the site

Goal: clicking a "Get 1B" (or custom amount) button shows payment on your own site — crypto address, amount, QR, live status — instead of sending people to a SellAuth page. Discord stays, but only as optional support.

**Status: waiting on you for the SellAuth API key and Shop ID. Nothing is built until you send them.**

## Hosting decision (yours): option 2

The site stays on GitHub Pages with your custom domain (free). The checkout server lives here (also free), and the page calls it when someone buys. Two places to manage, but both free. I'll handle the cross-site connection; the server URL is stable and the GitHub workflow needs no changes.

## Why a server is needed at all

SellAuth checkouts are created with your secret API key. Anything in the website files is public, so a pure GitHub Pages site cannot hold that key — anyone could read it and create orders as you.

## What I need from you

1. SellAuth **API key** and **Shop ID** (stored as protected secrets, never in code).
2. Which crypto coins you want offered (BTC, LTC, ETH, SOL, USDT…).
3. Whether the buyer must enter their Minecraft username before paying — recommended yes, since you deliver in-game.

## Flow after the change

```text
pick amount  ->  enter Minecraft username (+ email if SellAuth needs it)
             ->  site creates the SellAuth order (server-side, key hidden)
             ->  payment panel on our page: coin choice, address, QR, amount, timer
             ->  status polls until paid
             ->  "Paid!" screen with order ID  (Discord button optional, support only)
```

## Delivery — answering your question

You're right: you don't need the buyer to join Discord. When a payment completes, SellAuth notifies you (email/dashboard, and I'll also set up a **Discord webhook** so a message lands in your channel with the Minecraft username, item, and amount paid). You then deliver in-game — the "Join Discord" button becomes purely optional help/support, not part of the delivery.

## Pricing, including the custom amount

Your existing scale (10% off at 100M rising to 30% at 1B+) keeps living on the site. The server recalculates the price from the requested amount before creating the order, so a tampered page cannot buy 5B for $1. Fixed packages map to fixed SellAuth products; the custom amount uses a variable-price order created through the API.

## Orders

Paid orders are stored (order ID, item, amount, username, status) so you get an admin list of what to deliver, and stock counters can decrease automatically. A SellAuth webhook marks orders paid server-side — the page alone is never trusted for that.

## Technical notes

- Server functions here: `createCheckout` (validates amount, recomputes price, calls SellAuth) and `getOrderStatus` (polls). CORS allows your GitHub Pages domain only.
- Public route `src/routes/api/public/sellauth-webhook.ts` verifies the SellAuth signature, marks the order paid, and fires your Discord webhook with delivery details.
- Lovable Cloud enabled for the `orders` table and secrets.
- Storefront buy buttons swap the current fake order-code modal for the real checkout panel.
- First build step is a verification: confirm SellAuth's API supports custom-price invoices and returns raw crypto address/QR data. If it only returns a hosted link, fallback is that link inside a modal on our domain — I'll tell you before building either way.

## Out of scope

No changes to layout, copy, or animations beyond the checkout area. Tebex remains untouched.
