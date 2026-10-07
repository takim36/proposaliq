# ProposalIQ

ProposalIQ is a read/review/compare interface for existing Proposales proposals.

## What it does

- Fetches proposals for the configured company through a server-side API.
- Uses React Query and custom hooks for data fetching and mutations.
- Provides a pre-send AI review for an existing proposal.
- Lets a user select exactly two proposals and compare them side by side.
- Shows structured comparison fields plus AI analysis and recommendation.
- Uses meaningful error codes and exponential retry/backoff for transient failures.
- Does not expose Proposales credentials to the browser.

## Run

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

## Environment

```env
DEMO_MODE=true
PROPOSALES_API_KEY=...
PROPOSALES_COMPANY_ID=...
AI_GATEWAY_API_KEY=...
AI_MODEL=openai/gpt-5.6-sol
```

`DEMO_MODE=true` provides two sample proposals so the comparison UI can be tested without Proposales credentials.
