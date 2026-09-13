import { createFileRoute } from "@tanstack/react-router";
import { Storefront } from "@/components/storefront";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DonutCash — DonutSMP Money & Spawners" },
      { name: "description", content: "Buy DonutSMP money and skeleton spawners with fast manual delivery and live support." },
      { property: "og:title", content: "DonutCash — DonutSMP Money & Spawners" },
      { property: "og:description", content: "DonutSMP money and spawners, priced clearly and delivered manually." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <Storefront />;
}
