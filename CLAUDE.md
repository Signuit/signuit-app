
Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Use `bunx <package> <command>` instead of `npx <package> <command>`
- Bun automatically loads .env, so don't use dotenv.

## APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

## Testing

Use `bun test` to run tests.

```ts#index.test.ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

## Frontend

Use HTML imports with `Bun.serve()`. Don't use `vite`. HTML imports fully support React, CSS, Tailwind.

Server:

```ts#index.ts
import index from "./index.html"

Bun.serve({
  routes: {
    "/": index,
    "/api/users/:id": {
      GET: (req) => {
        return new Response(JSON.stringify({ id: req.params.id }));
      },
    },
  },
  // optional websocket support
  websocket: {
    open: (ws) => {
      ws.send("Hello, world!");
    },
    message: (ws, message) => {
      ws.send(message);
    },
    close: (ws) => {
      // handle close
    }
  },
  development: {
    hmr: true,
    console: true,
  }
})
```

HTML files can import .tsx, .jsx or .js files directly and Bun's bundler will transpile & bundle automatically. `<link>` tags can point to stylesheets and Bun's CSS bundler will bundle.

```html#index.html
<html>
  <body>
    <h1>Hello, world!</h1>
    <script type="module" src="./frontend.tsx"></script>
  </body>
</html>
```

With the following `frontend.tsx`:

```tsx#frontend.tsx
import React from "react";
import { createRoot } from "react-dom/client";

// import .css files directly and it works
import './index.css';

const root = createRoot(document.body);

export default function Frontend() {
  return <h1>Hello, world!</h1>;
}

root.render(<Frontend />);
```

Then, run index.ts

```sh
bun --hot ./index.ts
```

For more information, read the Bun API docs in `node_modules/bun-types/docs/**.mdx`.

---

## SignUIT CollateralRouter — Architecture

### Core Principle
> **"Operator as infrastructure, not gatekeeper"**

### Multi-Party Model

| Party | Role | Description |
|-------|------|-------------|
| **SignUIT** | Operator | Network orchestrator, infrastructure |
| **VantageCapital** | Institution | Asset owner, routing decision-maker |
| **PrimeBank** | Counterparty | Issues margin calls |

### Ownership Model

| Template | Signatory | Observer | Controller |
|----------|----------|----------|------------|
| `JoinRequest` | institution | operator | operator |
| `ServiceAgreement` | institution + operator | — | — |
| `CollateralPolicy` | **institution** | operator | institution |
| `CollateralHolding` | **institution** | operator | institution |
| `MarginCall` | counterparty | institution, operator | counterparty |
| `RoutingSuggestion` | **institution** | operator | — |
| `AllocationRecord` | **institution** | operator | institution |

### Key Design Rules

1. **Onboarding:** Institution applies → Operator accepts (self-service model)
2. **Routing:** Institution-only approval. Operator observes but does NOT gate.
3. **Auto-approve:** Disabled in MVP. Phase 2 only, for low-risk policy-bounded cases.
4. **Co-signatures:** Minimize. Institution owns their own approvals.

### Workflow

```
1. JoinRequest       → Institution submits
2. ServiceAgreement → Operator accepts
3. CollateralHolding→ Institution creates (operator observes)
4. MarginCall       → Counterparty creates
5. RoutingSuggestion→ Institution creates (operator observes)
6. AllocationRecord→ Institution approves (sole decision)
```

### Relevant Files

- `sandbox/daml/CollateralRouter.daml` — Smart contracts
- `sandbox/daml/SeedData.daml` — Demo script
- `apps/web/src/lib/nexus-types.ts` — TypeScript bindings
