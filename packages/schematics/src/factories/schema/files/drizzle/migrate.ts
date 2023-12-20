import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { cleanEnv, str } from 'envalid';
import postgres from 'postgres';
dotenv.config({
  path: '../../../../.env',
});

const env = cleanEnv(process.env, {
  CONNECTION_STRING: str(),
  NODE_ENV: str(),
});

const sql = postgres(env.CONNECTION_STRING, {
  max: 1,
  ssl: { rejectUnauthorized: false },
});
const db = drizzle(sql);
async function run() {
  const outDir = process.argv[2];
  await migrate(db, { migrationsFolder: `${outDir}/../migrations` });
  return 0;
}
export default run()
  .then((exitCode) => {
    process.exitCode = exitCode;
    process.exit();
  })
  .catch((e) => {
    throw e;
  });
