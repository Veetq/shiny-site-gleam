# Putting donutcash.shop on GitHub Pages

The site can be exported as plain static files — no server needed.

## One-time setup

1. Push this project to your GitHub repository.
2. In the repository: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Still in **Settings → Pages**, set the custom domain to `donutcash.shop`
   (the `CNAME` file is already included in the build).

That's it. Every push to `main` rebuilds and publishes automatically.

## Building it yourself instead

If you'd rather drag the files in manually:

```bash
bun install
bun run build:static
```

The finished site lands in `dist/client/` — upload the whole contents of that
folder. It already contains `index.html`, images, `CNAME` and `.nojekyll`.
Copy `index.html` to `404.html` too if you add more pages later.
