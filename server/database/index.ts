// import Database from "better-sqlite3";
// import { drizzle } from "drizzle-orm/better-sqlite3";

// import * as schema from "./schema";

// const sqlite = new Database("database.db");

// export const db = drizzle({ client: sqlite, schema });
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { env } from "../utils/env";
console.log('DATABASE_URL:', env.DATABASE_URL);
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
