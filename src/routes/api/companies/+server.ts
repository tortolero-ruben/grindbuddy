import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { companies } from '$lib/server/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
    const allCompanies = await db.select().from(companies).orderBy(asc(companies.name));
    return json(allCompanies);
}
