# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (hot reload via nodemon + tsx)
npm run dev

# Production build
npm run build
npm start

# Prisma — run directly (prisma-env.ts has been removed)
npx prisma generate
npx prisma migrate dev
npx prisma migrate deploy
```

> Note: The `package.json` scripts for `prisma:generate`, `prisma:migrate`, and `prisma:deploy` reference a deleted file (`src/prisma-env.ts`). Use `npx prisma ...` directly instead.

## Environment Variables

Required in `.env`:

```
DATABASE_URL=mysql://user:pass@host:port/dbname
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
ACCESS_TOKEN_TTL=5m
REFRESH_TOKEN_TTL=7d

# Also needed for MySQL session store (separate from DATABASE_URL)
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

NODE_ENV=production|development
```

## Architecture

This is a social media REST API (Facebook-like) built with **Express 5 + TypeScript + Prisma + MySQL**.

### Request Flow

```
HTTP Request
  → CORS → Session → Passport → Router
  → Controller
  → DAO (Data Access Object)
  → Prisma Client → MySQL
```

WebSocket connections are handled by a custom `ws` server mounted on the same HTTP server (`src/controller/Post/socket.ts`). Authentication uses a JWT token passed as a URL query param (`/?token=...`).

### Layer Responsibilities

| Layer | Path | Role |
|-------|------|------|
| Entry | `src/index.ts` | Express setup, middleware, session store, WebSocket init |
| Routers | `src/router/` | Route definitions; multer configured here for file uploads |
| Controllers | `src/controller/` | Request handling, response shaping |
| DAOs | `src/DAO/` | All Prisma queries; each DAO file creates its own `PrismaClient` instance |
| Auth | `src/controller/Authen/` | JWT signing/verification, PBKDF2 hashing, Passport strategy |

### Authentication Strategy

Two-token hybrid system:
- **Access Token** (JWT, 5 min) — sent as `Authorization: Bearer <token>` on protected routes; validated by `authenticateToken()` middleware in `src/controller/Authen/auth.ts`
- **Refresh Token** (JWT, 7 days) — stored in DB (`User.refreshToken`) and in the MySQL session; client sends `userId` + `refreshToken` in the body to `/user/refreshToken`

Password storage: PBKDF2-SHA256, 310,000 iterations, random 16-byte salt per user (`src/controller/Authen/crypto.ts`).

### Key Patterns

- **Friendship model is bidirectional**: accepting a friend request creates two `Friendship` rows (`userId→friendId` and `friendId→userId`).
- **Search excludes existing relations**: `searchUserName()` in `src/DAO/userDAO.ts` uses Prisma `none` conditions to filter out users with pending requests or existing friendships.
- **`nameNoSign`** is a stored, accent-stripped version of the user's name used for search queries.
- **Static file uploads** are stored locally under `src/uploads/` and served at `/uploads/*`. Firebase storage is configured but not actively used for post images.
- **Messaging** (`Room`, `Mess`, `MemberRoom` models) is partially implemented — `src/DAO/messDAO.ts` is mostly commented out.

### Port Mismatch (Docker)

The app listens on **8080** (`src/index.ts`) but the `Dockerfile` exposes **3000**. Map accordingly when running in Docker.
