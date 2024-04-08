import { Lucia } from "lucia"
import { D1Adapter } from "@lucia-auth/adapter-sqlite"
import { DrizzleD1Database } from "drizzle-orm/d1"

export function initializeLucia(D1: DrizzleD1Database) {
  const adapter = new D1Adapter(D1, {
    user: "user",
    session: "session",
  })
  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        secure: !import.meta.dev,
      },
    },
    getUserAttributes: (attributes) => {
      return {
        email: attributes.email,
        name: attributes.name,
      }
    },
  })
}

declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof initializeLucia>
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

interface DatabaseUserAttributes {
  name: string
  email: string
}
