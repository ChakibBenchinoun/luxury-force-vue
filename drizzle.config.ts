import process from 'node:process'
import path from 'node:path'
import type { Config } from 'drizzle-kit'
import { defineConfig } from 'drizzle-kit'

const wranglerConfigPath = path.resolve(__dirname, 'wrangler.toml')

const prodConfig = {
  out: 'server/db/migrations',
  schema: 'server/db/schema.ts',
  driver: 'd1',
  dbCredentials: {
    wranglerConfigPath,
    dbName: 'roobinhoodltd',
  },
} satisfies Config

const devConfig = {
  out: 'server/db/migrations',
  schema: 'server/db/schema.ts',
  driver: 'better-sqlite',
  dbCredentials: {
    url: process.env.LOCAL_DB_PATH!,
  },
} satisfies Config

export default defineConfig(process.env.LOCAL_DB_PATH ? devConfig : prodConfig)
