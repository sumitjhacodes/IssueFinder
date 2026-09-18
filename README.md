# IssueFinder

Find unassigned GitHub issues, starter repos, and cash bounties — then open them on GitHub.

**Live:** [issuefinder.fun](https://issuefinder.fun)  
**Repo:** [github.com/sumitjhacodes/IssueFinder](https://github.com/sumitjhacodes/IssueFinder)

> Local folder name may be `IssueHub` on your machine; the product and GitHub repo are **IssueFinder**.

## What it does

- Browse unassigned issues (updated ≤30 days, non-archived, 100+★)
- Starter repos (100–2500★, pushed in the last 30 days)
- Cash bounties (confirm payout on GitHub/platform)
- Learn guides + beginner path
- Dark / light theme

## Stack

- React + TypeScript + Vite (SPA in `client/`)
- Tailwind CSS
- GitHub REST API (public data)
- Vitest + GitHub Actions CI

## Setup

```bash
git clone https://github.com/sumitjhacodes/IssueFinder.git
cd IssueFinder/client
# if your clone folder is still named IssueHub:
# cd IssueHub/client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Tests & build

```bash
cd client
npm test
npm run lint
npm run build
```

Output is in `client/dist` (includes prerendered SEO routes).

## Deploy

- **Vercel:** use the repo-root [`vercel.json`](vercel.json) (`install` / `build` / `outputDirectory` point at `client/`).
- **Netlify:** publish `client/dist`; SPA fallback is [`client/public/_redirects`](client/public/_redirects).

## CI / merging to main

Every push and pull request to `main` runs `.github/workflows/ci.yml` (lint, unit tests, production build).

Enable a branch ruleset on `main` that requires a PR and the **Lint, test, and build** check.

## Contributing

1. Fork the repo  
2. Create a branch  
3. Ensure `npm test`, `npm run lint`, and `npm run build` pass in `client/`  
4. Open a pull request  

You can also practice your first PR on IssueFinder itself — browse [open issues](https://github.com/sumitjhacodes/IssueFinder/issues), create one, or ship a fix.

## Author

**Sumit Jha** · [GitHub](https://github.com/sumitjhacodes) · [LinkedIn](https://www.linkedin.com/in/sumit-jha) · [X](https://x.com/_sumitjha_)
