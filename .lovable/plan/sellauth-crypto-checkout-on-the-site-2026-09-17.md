# SellAuth crypto checkout on the site

Goal: clicking a "Get 1B" (or custom amount) button shows payment on your own site — crypto address, amount, QR, live status — instead of sending people to a SellAuth page. Discord stays as optional support only.

**Status: waiting on you for the SellAuth API key and Shop ID. Nothing is built until you send them.**

## Hosting decision (yours): option 2

The site stays on GitHub Pages with your custom domain (free). The checkout server lives here (also free), and the page calls it when someone buys. I handle the cross-site connection; the GitHub workflow needs no changes.

## Why a server is needed

SellAuth checkouts are created with your secret API key. Anything in the website files is public, so GitHub Pages alone cannot hold that key.

## What I need from you

1. SellAuth **API key** and **Shop ID** (stored as protected secrets, never in code).
2. Your **Discord webhook URL** for the channel where order alerts should land.
3. Which crypto coins you want offered (BTC, LTC, ETH, SOL, USDT…).
4. Confirm buyers must enter their Minecraft username before paying (recommended).

## Flow after the change

```text
pick amount -> enter Minecraft username -> site creates SellAuth order (key hidden)
-> payment panel on our page: coin choice, address, QR, amount, timer
-> status polls until paid
-> progress tracker: Order received -> Delivering -> Delivered
```

## Post-payment progress tracker

Once payment lands, the customer stays on our page and sees a live three-step tracker:

1. **Order received** — thanks for buying, payment confirmed, order ID shown.
2. **Delivering** — we're sending your money/spawners in-game.
3. **Delivered** — done, with a thanks + optional "leave a review / join Discord" link.

The page checks status every few seconds, so the steps advance by themselves as you act.

## Discord alert with a button you press

When a payment completes, a message is posted to your Discord channel with the order ID, Minecraft username, item, amount paid and coin — plus buttons:

- **Delivering** — moves the customer's tracker to step 2.
- **Mark delivered** — moves it to step 3 and edits the Discord message to show "Delivered by <you>".

This needs a Discord application (free, made in Discord's developer portal) so the buttons can call back to our server; I'll walk you through creating it and adding its key. If you'd rather skip that, the fallback is a private admin page on the site with the same two buttons — no Discord app needed.

## SellAuth product setup — answers

- **Category**: yes, "Game top-up" fits fine; the category only affects how it's listed.
- **Deliverables Type**: choose **Service**. You deliver manually in-game, stock is set by you (or infinite), and the order stays "Paid" until you mark it complete — exactly your flow. Not Serials (that's for pre-made codes), not Dynamic (that auto-generates keys from a webhook), not Files/Physical.
- **Instructions field**: something like — "Thanks for your order! Your order ID is shown above. Make sure you're online in DonutSMP as the username you entered; we deliver within minutes. Need help? Join discord.gg/9FHdCBQAx."
- **Variants**: one product "DonutSMP Money" with variants 100M ($3.86), 500M ($17.14), 1B ($30), 2B ($60), 5B ($150); one product "Spawners" priced per unit ($0.40) with Min 1 / Max = stock. Set **Slashed Price** to the "was" price so the discount shows.
- **Stock**: set to your real stock (1,037M money units / 527 spawners) so SellAuth can't oversell.
- **Custom amount**: created through the API at a server-calculated price, so it doesn't need its own variant.
- Leave subscriptions, cashback, files and Discord auto-role off.

## Pricing

Your existing scale (10% off at 100M rising to 30% at 1B+) stays. The server recalculates price from the requested amount before creating the order, so a tampered page cannot buy 5B for $1.

## Technical notes

- Server functions: `createCheckout` (validate amount, recompute price, call SellAuth), `getOrderStatus` (poll). CORS restricted to your GitHub Pages domain.
- `src/routes/api/public/sellauth-webhook.ts` — verifies SellAuth signature, marks order paid, posts the Discord alert.
- `src/routes/api/public/discord-interactions.ts` — verifies Discord's Ed25519 signature, handles the button presses, updates order status.
- Lovable Cloud enabled for the `orders` table (id, code, item, amount, username, price, status, timestamps) and secrets.
- Storefront buy buttons replace the current fake order-code modal with the real checkout + tracker panel.
- First build step verifies SellAuth's API supports custom-price invoices and returns raw crypto address/QR data; if it only returns a hosted link, fallback is that link in a modal on our domain — I'll tell you before building.

## Out of scope

No layout, copy or animation changes beyond the checkout area. Tebex untouched.
