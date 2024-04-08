import { desc } from "drizzle-orm";
import { domain } from "~/server/db/schema";

export default defineEventHandler(async (event) => {
  const db = event.context.db
  try {
    const lastDomain = await db.query.domain.findFirst({orderBy:[desc(domain.createdAt)]});

    if (!lastDomain) {
      return createError({ statusCode: 404, message: 'No domains found' });
    }

    return lastDomain.id; // Return only the ID
  } catch (error) {
    console.error('Error fetching last domain ID:', error);
    throw createError({ statusCode: 500, message: 'Internal server error' });
  }
});
