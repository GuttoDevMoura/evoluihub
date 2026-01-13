import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const DATABASE_URL = process.env.DATABASE_URL;
const TENANT_ID = process.env.TENANT_ID;
const ADMIN_USER_ID = process.env.ADMIN_USER_ID;
const ADMIN_PASSWORD_HASH = `'${bcrypt.hashSync('admin123', 10).replace(/'/g, "''")}'`;
const MEMBER_PASSWORD_HASH = `'${bcrypt.hashSync('member123', 10).replace(/'/g, "''")}'`;

if (!DATABASE_URL) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

function applyPlaceholders(sql: string) {
  let replaced = sql;

  if (replaced.includes('{{TENANT_ID}}')) {
    if (!TENANT_ID) {
      throw new Error('TENANT_ID env var is required for this seed.');
    }
    if (!/^[0-9]+$/.test(TENANT_ID)) {
      throw new Error('TENANT_ID must be numeric.');
    }
    replaced = replaced.replaceAll('{{TENANT_ID}}', TENANT_ID);
  }

  if (replaced.includes('{{ADMIN_USER_ID}}')) {
    if (!ADMIN_USER_ID) {
      throw new Error('ADMIN_USER_ID env var is required for this seed.');
    }
    const escaped = ADMIN_USER_ID.replace(/'/g, "''");
    replaced = replaced.replaceAll('{{ADMIN_USER_ID}}', `'${escaped}'`);
  }

  if (replaced.includes('{{ADMIN_PASSWORD_HASH}}')) {
    replaced = replaced.replaceAll('{{ADMIN_PASSWORD_HASH}}', ADMIN_PASSWORD_HASH);
  }

  if (replaced.includes('{{MEMBER_PASSWORD_HASH}}')) {
    replaced = replaced.replaceAll('{{MEMBER_PASSWORD_HASH}}', MEMBER_PASSWORD_HASH);
  }

  return replaced;
}

async function main() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  const seedsDir = path.join(__dirname, '..', 'seed');

  if (!fs.existsSync(seedsDir)) {
    console.log('No seed directory found, skipping.');
    await pool.end();
    return;
  }

  const files = fs
    .readdirSync(seedsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log('No seed files found.');
    await pool.end();
    return;
  }

  const client = await pool.connect();

  try {
    for (const file of files) {
      const rawSql = fs.readFileSync(path.join(seedsDir, file), 'utf-8');
      const sql = applyPlaceholders(rawSql);
      console.log(`Running seed: ${file}`);
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('COMMIT');
        console.log(`Seed applied: ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`Seed failed: ${file}`, err);
        process.exitCode = 1;
        return;
      }
    }

    console.log('Seeds complete.');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Seed run failed', err);
  process.exit(1);
});
