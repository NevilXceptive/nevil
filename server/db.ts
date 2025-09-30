import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import pkg from 'pg';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import ws from "ws";
import * as schema from "@shared/schema";

const { Pool: PgPool } = pkg;

// Check if we're running in Docker or with a local PostgreSQL connection
const isLocalPostgres = process.env.DATABASE_URL?.includes('postgresql://') && 
                       !process.env.DATABASE_URL?.includes('neon.tech');

let pool: any;
let db: any;

if (isLocalPostgres) {
  // Use local PostgreSQL configuration
  const url = new URL(process.env.DATABASE_URL!);
  
  pool = new PgPool({
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    database: url.pathname.slice(1), // Remove leading slash
    user: url.username,
    password: url.password,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
  
  db = drizzlePg({ client: pool, schema });
} else {
  // Use Neon serverless configuration
  neonConfig.webSocketConstructor = ws;

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }

  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

export { pool, db };