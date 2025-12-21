# GrindBuddy

SvelteKit app with Neon Auth (email/password) for authentication.

## Required environment

Add to the repo-root `.env` (values below are good dev defaults):

- `DATABASE_URL=postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require`
- `NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth`
- `PUBLIC_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth`

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

```sh
pnpm --filter grind-buddy test
```
