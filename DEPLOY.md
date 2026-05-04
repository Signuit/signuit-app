# SignUIT — Production Deployment

**Server:** 38.49.213.142  
**Domain:** signuit.com  
**Stack:** TanStack Start + Canton Sandbox (H2 persistent) + Traefik (SSL)

---

## One-time Setup

### 1. Server prerequisites

```bash
ssh root@38.49.213.242
apt-get update && apt-get install -y docker.io docker-compose-plugin git
```

### 2. Clone repo

```bash
git clone <your-repo-url> /opt/signuit
cd /opt/signuit
```

### 3. Configure environment

```bash
cp .env.production .env
```

Edit `.env` and fill in:

```bash
DOMAIN=signuit.com
ACME_EMAIL=your@email.com

# Generate secrets:
# openssl rand -hex 32
BETTER_AUTH_SECRET=<32 char random>
SESSION_SECRET=<32 char random>
SANDBOX_SECRET=secret
```

### 4. Point DNS

At your DNS provider, add an A record:
```
signuit.com → 38.49.213.142
```

Wait for DNS propagation (~5 minutes).

### 5. Build & start

```bash
cd /opt/signuit
docker compose up -d --build
```

First startup takes ~5-10 minutes (Canton sandbox Daml SDK install).

### 6. Seed demo users

```bash
# Run once to create the 3 demo accounts in the database
docker compose exec web node packages/db/src/seed.ts
```

### 7. Verify

```bash
docker compose ps          # all services should be "healthy"
docker compose logs web    # should see "DAR uploaded successfully"
```

Open https://signuit.com — login with demo buttons.

---

## Demo Accounts

| Button | Email | Role |
|--------|-------|------|
| Vantage Capital | demo-vantage@signuit.app | institution |
| Prime Bank | demo-primebank@signuit.app | counterparty |
| SignUIT | demo-operator@signuit.app | operator |

Password for all: `demo-password-123` (handled automatically by demo buttons)

---

## Demo Flow

1. **VantageCapital**: Dashboard → **Initialize Demo Data**
2. **PrimeBank**: Margin Calls → **New Margin Call** ($15M)
3. **VantageCapital**: Bell icon in header → **Respond** → Generate Route → **Approve & Execute**
4. All 3 parties: **Audit Trail** → see the immutable allocation record

---

## Data Persistence

- **Canton ledger** (holdings, policies, suggestions, allocations): stored in Docker volume `canton-data` → persists across restarts
- **Auth database** (users, sessions): stored in Docker volume `db-data` → persists across restarts
- DAR file is auto-uploaded by the web server on startup

---

## Updates

```bash
cd /opt/signuit
git pull
docker compose up -d --build
```

## Logs

```bash
docker compose logs -f web           # web app
docker compose logs -f canton-sandbox # Canton ledger
```

## Reset demo data (Canton ledger only)

```bash
docker compose restart canton-sandbox
# Wait for healthy, then VantageCapital clicks "Initialize Demo Data"
```
