import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  Headphones,
  Loader2,
  MessageCircle,
  PackageCheck,
  Sparkles,
  TrendingDown,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type Product = "money" | "spawners";
type Order = { code: string; item: string; total: string };

const DISCORD_URL = "https://discord.gg/9FHdCBQAx";
const MONEY_STOCK = 1037; // in millions
const SPAWNER_STOCK = 527;
const BASE_RATE = 0.042857; // $ per million before discount (1B = $30 after 30% off)

const cashStack = "/images/cash-stack.png";
const spawnerImage = "/images/skeleton-spawner.png";

const packages = [
  { amount: 100, label: "100M", price: 3.86, was: 4.29, discount: 10 },
  { amount: 500, label: "500M", price: 17.14, was: 21.43, discount: 20 },
  { amount: 1000, label: "1B", price: 30, was: 42.86, discount: 30, popular: true },
  { amount: 2000, label: "2B", price: 60, was: 85.71, discount: 30 },
  { amount: 5000, label: "5B", price: 150, was: 214.29, discount: 30 },
];

const reviews = [
  ["k****o", "nice service w", 5],
  ["o****a", "fast and cheapest nice", 4],
  ["j****7", "got my 1b in like 3 minutes, legit", 5],
  ["m*****z", "cheapest prices i found, will buy again", 5],
  ["t****5", "spawners came fast, good support", 4],
];

const faqs = [
  ["How much does DonutSMP money cost?", "Our 1B package is $30. Smaller packages start at $3.86, and the more you buy the bigger the discount, up to 30%."],
  ["How fast is delivery?", "Most orders arrive in a few minutes. At busy times, a team member may need a little longer."],
  ["What do you need from me?", "Your exact Minecraft username and the order code we generate for you."],
  ["Is this safe?", "We never ask for your password. Every order is confirmed and delivered manually."],
];

function makeCode(prefix: string) {
  const chars = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${chars}`;
}

/** 10% off at 100M, scaling linearly up to 30% off at 1B and above. */
function discountFor(millions: number) {
  if (millions >= 1000) return 30;
  if (millions <= 100) return 10;
  return Math.round(10 + ((millions - 100) / 900) * 20);
}

export function Storefront() {
  const [product, setProduct] = useState<Product>("money");
  const [custom, setCustom] = useState("1b");
  const [spawners, setSpawners] = useState(20);
  const [order, setOrder] = useState<Order | null>(null);
  const [loadingStep, setLoadingStep] = useState(-1);
  const [copied, setCopied] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const customAmount = useMemo(() => {
    const match = custom.trim().toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(m|b)?$/);
    if (!match) return null;
    const value = Number(match[1]);
    const millions = match[2] === "b" ? value * 1000 : value;
    return millions >= 50 && millions <= 10000 ? millions : null;
  }, [custom]);
  const customDiscount = customAmount ? discountFor(customAmount) : 0;
  const customPrice = customAmount ? customAmount * BASE_RATE * (1 - customDiscount / 100) : 0;

  const spawnerDiscount = Math.min(30, Math.round(Math.max(0, spawners - 20) * 0.375));
  const spawnerTotal = spawners * 0.4 * (1 - spawnerDiscount / 100);

  function openOrder(item: string, total: string, prefix: string) {
    setCopied(false);
    setOrder(null);
    setLoadingStep(0);
    timers.current.forEach(window.clearTimeout);
    timers.current = [
      window.setTimeout(() => {
        setLoadingStep(-1);
        setOrder({ code: makeCode(prefix), item, total });
      }, 900),
    ];
  }

  function closeModal() {
    timers.current.forEach(window.clearTimeout);
    setLoadingStep(-1);
    setOrder(null);
  }

  async function copyCode() {
    if (!order) return;
    await navigator.clipboard.writeText(order.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <a href="#top" className="flex items-center gap-2 font-display text-base font-extrabold">
            <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">$</span>
            <span>DONUTCASH<span className="text-primary">.SHOP</span></span>
          </a>
          <nav className="hidden items-center gap-6 text-xs font-semibold text-muted-foreground sm:flex">
            <a className="nav-link" href="#shop">SHOP</a>
            <a className="nav-link" href="#why">WHY US</a>
            <a className="nav-link" href="#how">HOW IT WORKS</a>
            <a className="nav-link" href="#reviews">REVIEWS</a>
            <a className="nav-link" href="#faq">FAQ</a>
          </nav>
          <Button asChild size="sm"><a href="#shop">Buy now <ArrowRight /></a></Button>
        </div>
      </header>

      <main>
        <section id="top" className="relative mx-auto grid min-h-[540px] max-w-6xl items-center gap-6 px-4 py-10 md:grid-cols-[1.05fr_.95fr] md:py-14">
          <div className="relative z-10 animate-rise">
            <div className="mb-5 inline-flex items-center gap-2 border border-primary/30 bg-primary/8 px-3 py-1.5 text-xs font-bold text-primary">
              <span className="status-dot" /> {MONEY_STOCK.toLocaleString()}M IN STOCK · UP TO 30% OFF
            </div>
            <h1 className="max-w-3xl font-display text-5xl font-extrabold leading-[.95] md:text-7xl">
              Stack cash.<br /><span className="text-primary">Skip the grind.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              DonutSMP money and spawners delivered manually by real players. No passwords. No waiting around.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg"><a href="#shop">Shop packages <ArrowRight /></a></Button>
              <span className="text-sm text-muted-foreground"><strong className="text-foreground">1B = $20</strong> · instant order code</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-5 text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-2"><PackageCheck className="text-primary" /> 1,200+ delivered</span>
              <span className="flex items-center gap-2"><Clock3 className="text-primary" /> Fast manual delivery</span>
              <span className="flex items-center gap-2"><Headphones className="text-primary" /> 24/7 support</span>
            </div>
          </div>
          <div className="hero-art relative mx-auto w-full max-w-[480px] animate-float">
            <img src={cashStack} alt="Stack of DonutSMP cash and coins" className="relative z-10 aspect-square w-full object-contain" />
            <div className="absolute bottom-[9%] right-[4%] z-20 border border-gold/40 bg-background/90 px-4 py-3 shadow-2xl backdrop-blur-md">
              <span className="block text-[10px] font-bold text-muted-foreground">BEST VALUE</span>
              <strong className="font-display text-xl text-gold">30% OFF</strong>
            </div>
          </div>
        </section>

        <section id="shop" className="border-y border-border bg-panel/55 py-12 md:py-14">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div><p className="eyebrow">STORE</p><h2 className="section-title">Choose your boost</h2></div>
              <div className="flex flex-wrap items-center justify-end gap-3">
                <span className={`stock-pill ${product === "money" ? "" : "stock-pill-hidden"}`}>
                  <span className="status-dot" /> {MONEY_STOCK.toLocaleString()}M in stock
                </span>
                <div className="flex w-full max-w-xs border border-border bg-background p-1 sm:w-auto">
                  {(["money", "spawners"] as Product[]).map((item) => (
                    <Button key={item} size="sm" variant={product === item ? "default" : "ghost"} className="flex-1 sm:w-32" onClick={() => setProduct(item)}>
                      {item === "money" ? "$ Money" : "◆ Spawners"}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="tab-viewport mt-7">
              {product === "money" ? (
                <div className="slide-in-left">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {packages.map((item, index) => (
                      <article key={item.label} style={{ "--delay": `${index * 50}ms` } as React.CSSProperties} className={`product-card stagger-in ${item.popular ? "featured-card" : ""}`}>
                        <div className="flex items-center justify-between"><span className="text-xs font-bold text-muted-foreground">DONUTSMP MONEY</span><span className="sale-tag">-{item.discount}%</span></div>
                        <div className="mt-5 flex items-end justify-between gap-4"><strong className="font-display text-4xl">{item.label}</strong><div className="text-right"><strong className="block font-display text-2xl text-primary">${item.price.toFixed(2)}</strong><span className="text-xs text-muted-foreground line-through">${item.was.toFixed(2)}</span></div></div>
                        <Button className="mt-5 w-full" variant={item.popular ? "default" : "secondary"} onClick={() => openOrder(`${item.label} DonutSMP money`, `$${item.price.toFixed(2)}`, `C${item.amount}`)}>Get {item.label} <ArrowRight /></Button>
                        {item.popular && <span className="popular-flag"><Sparkles /> MOST POPULAR</span>}
                      </article>
                    ))}
                    <article className="product-card border-dashed">
                      <div className="flex items-center justify-between"><span className="text-xs font-bold text-muted-foreground">CUSTOM AMOUNT</span><span className="sale-tag">-{customDiscount || 10}%</span></div>
                      <label className="mt-4 block text-xs font-semibold" htmlFor="custom">50M — 10B · bigger order, bigger discount</label>
                      <input id="custom" className="store-input mt-2" value={custom} onChange={(event) => setCustom(event.target.value)} placeholder="e.g. 2.5b" />
                      <Button className="mt-4 w-full" disabled={!customAmount} onClick={() => customAmount && openOrder(`${custom.toUpperCase()} DonutSMP money`, `$${customPrice.toFixed(2)}`, `C${customAmount}`)}>{customAmount ? `$${customPrice.toFixed(2)} · Continue` : "Enter a valid amount"}</Button>
                    </article>
                  </div>
                </div>
              ) : (
                <div className="slide-in-right grid border border-border bg-card md:grid-cols-[280px_1fr]">
                  <div className="grid min-h-64 place-items-center border-b border-border bg-background/60 p-6 md:border-b-0 md:border-r">
                    <img src={spawnerImage} alt="Minecraft skeleton spawner" className="w-44 animate-float object-contain [image-rendering:pixelated]" />
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex justify-between gap-4">
                      <div><p className="eyebrow">{SPAWNER_STOCK} IN STOCK</p><h3 className="mt-2 font-display text-3xl font-bold">Skeleton spawners</h3></div>
                      <div className="text-right"><strong className="font-display text-3xl text-primary">${spawnerTotal.toFixed(2)}</strong><span className="block text-xs text-muted-foreground">{spawnerDiscount}% bulk discount</span></div>
                    </div>
                    <div className="mt-8 flex items-center gap-4">
                      <input aria-label="Spawner quantity" type="range" min="1" max={SPAWNER_STOCK} value={spawners} onChange={(event) => setSpawners(Number(event.target.value))} className="range-slider min-w-0 flex-1" style={{ "--fill": `${((spawners - 1) / (SPAWNER_STOCK - 1)) * 100}%` } as React.CSSProperties} />
                      <input aria-label="Spawner count" type="number" min="1" max={SPAWNER_STOCK} value={spawners} onChange={(event) => setSpawners(Math.min(SPAWNER_STOCK, Math.max(1, Number(event.target.value) || 1)))} className="store-input w-24 text-center" />
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>1 spawner</span><span>{SPAWNER_STOCK} in stock</span></div>
                    <Button className="mt-7 w-full" onClick={() => openOrder(`${spawners} skeleton spawners`, `$${spawnerTotal.toFixed(2)}`, `S${spawners}`)}>Get {spawners} spawners <ArrowRight /></Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="why" className="mx-auto max-w-6xl px-4 py-12 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="eyebrow">WHY US</p>
              <h2 className="section-title">The cheapest prices<br />on the market.</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                We checked over 100 other DonutSMP shops before setting our prices. Some charge twice what we do, some twenty times, and a few ask more than a hundred times as much for the same in-game money. We priced ourselves at the bottom and stayed there.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary"><TrendingDown /> 1B for $20 — compare it anywhere.</div>
            </div>
            <ul className="grid gap-px border border-border bg-border sm:grid-cols-3">
              {[["2x", "What many shops charge for the same amount"], ["20x", "What the bigger resellers ask on busy days"], ["100x", "What the worst listings we found were priced at"]].map(([figure, copy]) => (
                <li key={figure} className="step bg-background p-6">
                  <strong className="font-display text-4xl text-gold">{figure}</strong>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="how" className="border-y border-border bg-panel/55 py-12 md:py-14">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[.75fr_1.25fr] lg:items-start">
            <div><p className="eyebrow">ZERO FRICTION</p><h2 className="section-title">Three steps.<br />Then you’re stacked.</h2><p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">Pick what you want, keep your order code, and our admins hand it over in-game.</p></div>
            <ol className="grid gap-px border border-border bg-border sm:grid-cols-3">
              {[["01", "Pick your amount", "Choose money or spawners and get an order code instantly."], ["02", "Open a ticket", "Join our Discord and open a ticket with your code and username."], ["03", "Get delivered", "An admin meets you in-game and hands over exactly what you bought."]].map(([number, title, copy]) => (
                <li key={number} className="step bg-background p-5"><span className="font-display text-sm font-bold text-primary">{number}</span><h3 className="mt-8 font-display text-xl font-bold">{title}</h3><p className="mt-2 text-sm text-muted-foreground">{copy}</p></li>
              ))}
            </ol>
          </div>
        </section>

        <section id="reviews" className="py-12">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-end justify-between">
              <div><p className="eyebrow">PLAYER PROOF</p><h2 className="section-title">4.8 / 5 from the community</h2></div>
              <span className="hidden text-gold sm:block">★★★★★</span>
            </div>
          </div>
          <div className="marquee mt-6">
            <div className="marquee-track">
              {[...reviews, ...reviews].map(([name, text, rating], index) => (
                <blockquote key={`${name}-${index}`} className="review-card w-72 shrink-0">
                  <span className="text-gold">{"★".repeat(Number(rating))}</span>
                  <p className="mt-4 text-sm">“{text}”</p>
                  <footer className="mt-4 text-xs font-bold text-muted-foreground">{name}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto grid max-w-6xl gap-8 border-t border-border px-4 py-12 md:grid-cols-[.6fr_1.4fr] md:py-14">
          <div><p className="eyebrow">FAQ</p><h2 className="section-title">Quick answers</h2></div>
          <div className="divide-y divide-border border-y border-border">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold">{question}<ChevronDown className="text-primary transition-transform group-open:rotate-180" /></summary>
                <p className="faq-copy pb-5 pr-10 text-sm leading-relaxed text-muted-foreground">{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 px-4 py-7 text-xs text-muted-foreground sm:flex-row">
          <span className="font-display font-bold text-foreground">DONUTCASH<span className="text-primary">.SHOP</span></span>
          <a className="nav-link" href={DISCORD_URL} target="_blank" rel="noreferrer">Join our Discord</a>
          <span>© 2026 donutcash.shop · Not affiliated with DonutSMP.</span>
        </div>
      </footer>

      {(loadingStep >= 0 || order) && (
        <div className="modal-backdrop fixed inset-0 z-50 grid place-items-center bg-background/85 p-4 backdrop-blur-md" role="dialog" aria-modal="true">
          <div className="modal-card relative w-full max-w-md border border-primary/35 bg-card p-6 shadow-2xl">
            <Button variant="ghost" size="icon" className="absolute right-3 top-3" onClick={closeModal} aria-label="Close order"><X /></Button>

            {loadingStep >= 0 ? (
              <div className="py-6 text-center">
                <Loader2 className="mx-auto size-8 animate-spin text-primary" />
                <h2 className="mt-4 font-display text-xl font-bold">Loading order…</h2>
                <div className="progress-bar mt-5"><span /></div>
              </div>
            ) : order ? (
              <div className="animate-rise">
                <div className="grid size-11 place-items-center rounded-md bg-primary/12 text-primary"><Check /></div>
                <p className="eyebrow mt-5">ORDER CREATED</p>
                <h2 className="mt-2 font-display text-2xl font-bold">Save your order ID</h2>
                <p className="mt-2 text-sm text-muted-foreground">Copy this code, join our Discord and open a ticket with it plus your Minecraft username.</p>
                <div className="mt-5 border border-primary/30 bg-primary/8 p-4 text-center">
                  <span className="text-[10px] font-bold tracking-[.2em] text-muted-foreground">ORDER ID</span>
                  <code className="mt-2 block break-all font-display text-2xl font-bold tracking-wider text-primary">{order.code}</code>
                  <Button size="sm" variant="secondary" className="mt-4" onClick={copyCode}>{copied ? <Check /> : <Copy />}{copied ? "Copied" : "Copy code"}</Button>
                </div>
                <div className="mt-4 flex justify-between border border-border bg-background p-3 text-xs text-muted-foreground">
                  <span>{order.item}</span><strong className="text-foreground">{order.total}</strong>
                </div>
                <Button asChild className="mt-5 w-full"><a href={DISCORD_URL} target="_blank" rel="noreferrer"><MessageCircle /> Join Discord & open a ticket</a></Button>
                <p className="mt-4 text-center text-xs text-muted-foreground">Keep this code until your order is complete.</p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
