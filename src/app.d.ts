import type { Auth } from '@repo/auth';

type SessionResult = Awaited<ReturnType<Auth['api']['getSession']>>;

declare global {
	namespace App {
		interface Locals {
			user: NonNullable<SessionResult>['user'] | null;
			session: NonNullable<SessionResult>['session'] | null;
		}
	}
}

export { };
