# Compact DonutCash storefront refresh

## Outcome
Rebuild the uploaded DonutCash homepage as a tighter, more polished storefront that reaches products sooner and feels responsive without becoming visually noisy.

## Changes
- Preserve the dark green brand, product imagery, package pricing, stock counts, reviews, FAQs, and Discord order handoff.
- Compress the header and opening area so pricing and the primary action are visible immediately.
- Combine repetitive trust and feature content into a compact proof strip and a concise three-step section.
- Redesign money packages and the spawner selector for faster scanning on desktop and mobile.
- Add restrained entrance, stagger, tab, card, number, and modal motion with reduced-motion support.
- Keep all controls usable, including product switching, custom amounts, spawner quantities, order creation, copy action, and accordions.
- Add complete page metadata and verify desktop and mobile layouts.

## Visual direction
A crisp game-market terminal: near-black background, vivid cash green, warm gold accents, squared compact panels, strong numeric typography, and subtle grid texture. No decorative blobs or oversized empty sections.

## Technical details
- Implement in the existing TanStack React app and Tailwind v4 design tokens.
- Import uploaded product artwork through the project asset flow.
- Use React state for the storefront controls and order handoff; no new backend or payment integration.
