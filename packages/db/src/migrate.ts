import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

async function ensureMigrationsTable(client: Pool) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      run_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function main() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  const migrationsDir = path.join(__dirname, '..', 'migrations');

  if (!fs.existsSync(migrationsDir)) {
    console.log('No migrations directory found, skipping.');
    await pool.end();
    return;
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  const client = await pool.connect();

  try {
    await ensureMigrationsTable(pool);
    const appliedResult = await client.query<{ name: string }>('SELECT name FROM schema_migrations');
    const applied = new Set(appliedResult.rows.map((row) => row.name));

    if (files.length === 0) {
      console.log('No migration files found.');
      return;
    }

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`Skipping already applied: ${file}`);
        continue;
      }

      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      console.log(`Applying migration: ${file}`);
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`Applied: ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`Failed: ${file}`, err);
        process.exitCode = 1;
        return;
      }
    }

    console.log('Migrations complete.');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Migration run failed', err);
  process.exit(1);
});
