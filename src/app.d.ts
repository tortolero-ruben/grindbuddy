declare global {
	namespace App {
		interface Locals {
			user: {
				id: string;
				email: string;
				name: string | null;
				image: string | null;
				emailVerified: boolean;
				createdAt: Date;
				updatedAt: Date;
			} | null;
			session: {
				id: string;
				expiresAt: Date;
				token: string;
				createdAt: Date;
				updatedAt: Date;
				userId: string;
			} | null;
		}
	}
}

export { };
