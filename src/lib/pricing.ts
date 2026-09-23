export const MONEY_STOCK = 1037; // in millions
export const SPAWNER_STOCK = 527;
export const BASE_RATE = 0.042857; // $ per million before discount (1B = $30 after 30% off)

/** 10% off at 100M, scaling linearly up to 30% off at 1B and above. */
export function discountFor(millions: number) {
  if (millions >= 1000) return 30;
  if (millions <= 100) return 10;
  return Math.round(10 + ((millions - 100) / 900) * 20);
}

export function moneyPrice(millions: number) {
  return Number((millions * BASE_RATE * (1 - discountFor(millions) / 100)).toFixed(2));
}

export function spawnerDiscountFor(count: number) {
  return Math.min(30, Math.round(Math.max(0, count - 20) * 0.375));
}

export function spawnerPrice(count: number) {
  return Number((count * 0.4 * (1 - spawnerDiscountFor(count) / 100)).toFixed(2));
}

export type CheckoutRequest = {
  product: "money" | "spawners";
  amount: number; // millions of money, or spawner count
  username: string;
};

export function priceFor(req: CheckoutRequest): { price: number; item: string } | null {
  const username = req.username.trim();
  if (username.length < 3 || username.length > 16 || !/^[A-Za-z0-9_]+$/.test(username)) return null;
  if (req.product === "money") {
    const m = Math.round(req.amount);
    if (!Number.isFinite(m) || m < 50 || m > 10000) return null;
    const label = m >= 1000 ? `${(m / 1000).toString()}B` : `${m}M`;
    return { price: moneyPrice(m), item: `${label} DonutSMP money` };
  }
  const c = Math.round(req.amount);
  if (!Number.isFinite(c) || c < 1 || c > SPAWNER_STOCK) return null;
  return { price: spawnerPrice(c), item: `${c} skeleton spawner${c === 1 ? "" : "s"}` };
}

export function makeOrderCode() {
  return `DC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
