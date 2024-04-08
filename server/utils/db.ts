import type { DrizzleD1Database } from 'drizzle-orm/d1'
import { drizzle } from 'drizzle-orm/d1'
import * as schema from '@/server/db/schema'

export function initializeDrizzle(D1: DrizzleD1Database) {
  return drizzle(D1, { schema })
}
