#!/usr/bin/env node

const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration(migrationFile) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '160.153.180.159',
    user: process.env.DB_USER || 'adhdlearn',
    password: process.env.DB_PASSWORD || 'AuroraLearns2025!',
    database: 'adhdlearn',
    multipleStatements: true
  });

  try {
    console.log('Connected to database');
    console.log(`Running migration: ${migrationFile}`);

    const sql = fs.readFileSync(migrationFile, 'utf8');
    const [results] = await connection.query(sql);

    console.log('Migration completed successfully');
    console.log('Results:', results);
  } catch (error) {
    console.error('Migration failed:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

const migrationFile = process.argv[2];
if (!migrationFile) {
  console.error('Usage: node run-migration.js <path-to-migration.sql>');
  process.exit(1);
}

runMigration(migrationFile)
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
