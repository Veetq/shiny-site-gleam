const HOSTED_API_BASE = "https://project--2be64f41-81a9-4e9d-9e81-ef3c8164fb51.lovable.app";

/** Same-origin when the app is served by its own server; the hosted API when on GitHub Pages. */
function apiBase() {
  if (typeof window === "undefined") return "";
  const host = window.location.hostname;
  const sameOrigin = host === "localhost" || host === "127.0.0.1" || host.endsWith(".lovable.app");
  return sameOrigin ? "" : HOSTED_API_BASE;
}

export type CheckoutResult = {
  invoiceUrl: string;
  orderCode: string;
  item: string;
  price: number;
};

export async function createPayment(input: {
  product: "money" | "spawners";
  amount: number;
  username: string;
}): Promise<CheckoutResult> {
  const response = await fetch(`${apiBase()}/api/public/create-payment`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = (await response.json()) as Partial<CheckoutResult> & { error?: string };
  if (!response.ok || !data.invoiceUrl) {
    throw new Error(data.error ?? "Could not start the payment.");
  }
  return data as CheckoutResult;
}
