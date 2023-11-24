import type { Config } from 'drizzle-kit';
export default {
  schema: './drizzle.schema.ts',
  out: __dirname + '/../migrations',
} satisfies Config;
