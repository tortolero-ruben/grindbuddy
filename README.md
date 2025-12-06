# GrindBuddy

SvelteKit app with Better Auth (email/password) wired through `@repo/auth`.

## Required environment

Add to the repo-root `.env` (values below are good dev defaults):

- `DATABASE_URL=postgres://auth:auth@localhost:5432/auth`
- `AUTH_SECRET=changeme-please-32chars` (32+ chars)
- `AUTH_URL=http://localhost:5173` (use `http://localhost:4173` when running `npm run preview` or docker)
- Optional tuning:
  - `AUTH_COOKIE_NAME=ba_session`
  - `AUTH_COOKIE_DOMAIN=localhost`
  - `AUTH_SESSION_MAX_AGE=604800`
- Optional client override: `PUBLIC_AUTH_URL` (defaults to same origin)

## Running

```sh
# install deps
pnpm install

# app dev server
pnpm --filter grind-buddy dev

# preview build (matches docker-compose defaults)
pnpm --filter grind-buddy preview
```

## Auth flows

- Login: `/login`
- Register: `/register`
- Logout: POST to `/logout`

## Tests

Auth service unit tests live in `packages/auth`:

```sh
pnpm --filter @repo/auth test
```
