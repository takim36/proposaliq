# API notes

ProposalIQ is intentionally read/review/compare only. It does not create or send proposals.

Relevant Proposales endpoints:

```text
GET /v3/proposal-search
GET /v3/proposals/{uuid}
```

Authentication:

```http
Authorization: Bearer <PROPOSALES_API_KEY>
```

The Proposales API key and configured company ID stay on the server.
