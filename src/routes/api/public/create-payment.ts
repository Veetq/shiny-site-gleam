import { createFileRoute } from "@tanstack/react-router";

import { priceFor, makeOrderCode, type CheckoutRequest } from "@/lib/pricing";

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...corsHeaders },
  });
}

export const Route = createFileRoute("/api/public/create-payment")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: corsHeaders }),
      POST: async ({ request }) => {
        let body: CheckoutRequest;
        try {
          body = (await request.json()) as CheckoutRequest;
        } catch {
          return json({ error: "Invalid request" }, 400);
        }

        if (body?.product !== "money" && body?.product !== "spawners") {
          return json({ error: "Invalid product" }, 400);
        }

        const quote = priceFor({
          product: body.product,
          amount: Number(body.amount),
          username: String(body.username ?? ""),
        });
        if (!quote) return json({ error: "Invalid amount or Minecraft username" }, 400);

        const apiKey = process.env["NOWPAYMENTS_API_KEY"];
        if (!apiKey) return json({ error: "Payments are not configured yet" }, 500);

        const orderCode = makeOrderCode();
        const origin = request.headers.get("origin") ?? "https://donutcash.shop";

        const response = await fetch("https://api.nowpayments.io/v1/invoice", {
          method: "POST",
          headers: { "x-api-key": apiKey, "content-type": "application/json" },
          body: JSON.stringify({
            price_amount: quote.price,
            price_currency: "usd",
            order_id: orderCode,
            order_description: `${quote.item} for ${body.username.trim()}`,
            success_url: origin,
            cancel_url: origin,
          }),
        });

        if (!response.ok) {
          console.error("NOWPayments invoice failed", response.status, await response.text());
          return json({ error: "Could not start the payment. Please try again." }, 502);
        }

        const invoice = (await response.json()) as { invoice_url?: string };
        if (!invoice.invoice_url) return json({ error: "Payment provider returned no checkout link" }, 502);

        return json({
          invoiceUrl: invoice.invoice_url,
          orderCode,
          item: quote.item,
          price: quote.price,
        });
      },
    },
  },
});
