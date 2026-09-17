# IssueFinder

**Find fresh issues that match your skills. Land your first PR faster.**

IssueFinder helps you find **unassigned** GitHub issues updated in the last 30 days on non-archived repos (100+ stars), mid-size starter projects, and cash bounties — filtered by language.

**Live:** [issuefinder.fun](https://issuefinder.fun)

## What it does

- Browse unassigned issues (updated ≤30 days, non-archived, 100+★)
- Starter repos (100–2500★, pushed in the last 30 days)
- Cash bounties (confirm payout on GitHub/platform)
- Learn guides + beginner path
- Dark / light theme

Search → filter → open on GitHub.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- GitHub REST API (public data)
- Vitest + GitHub Actions CI

## Setup

```bash
git clone https://github.com/sumitjhacodes/IssueFinder.git
cd IssueHub/client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Tests

```bash
cd client
npm test
npm run lint
npm run build
```

### Production build

```bash
cd client
npm run build
```

Output is in `client/dist`.

## CI / merging to main

Every push and pull request to `main` runs `.github/workflows/ci.yml` (lint, unit tests, production build). The job fails if any step fails.

To **block merges** when CI fails, enable branch protection on `main` in GitHub:

1. Repo → **Settings** → **Branches** → **Add branch ruleset** (or classic branch protection)
2. Target: `main`
3. Enable **Require status checks to pass**
4. Require check: **Lint, test, and build**
5. Enable **Require a pull request before merging** (recommended)
6. Optionally **Do not allow bypassing** for admins

Until that rule is on, CI still runs and shows red/green on PRs, but GitHub will not auto-block the merge button.

## Contributing

1. Fork the repo  
2. Create a branch  
3. Ensure `npm test`, `npm run lint`, and `npm run build` pass  
4. Open a pull request  

## Author

**Sumit Jha** · [GitHub](https://github.com/sumitjhacodes) · [LinkedIn](https://www.linkedin.com/in/sumit-jha) · [X](https://x.com/_sumitjha_)
