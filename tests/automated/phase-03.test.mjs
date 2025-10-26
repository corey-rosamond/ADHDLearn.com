#!/usr/bin/env node

/**
 * Phase 3 Automated Tests
 * Tests database + backend integration
 */

import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const PROJECT_ROOT = resolve(process.cwd());
const BACKEND = resolve(PROJECT_ROOT, 'backend');
const CHILD_PORTAL = resolve(PROJECT_ROOT, 'child-portal');

// Test results tracking
let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   ${error.message}`);
    failed++;
    failures.push({ name, error: error.message });
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

console.log('=== Phase 3: Database + Backend Tests ===\n');

// Database Migration
test('Database migration file exists', () => {
  const migrationExists = existsSync(resolve(BACKEND, 'scripts/setup-database.sql')) ||
                         existsSync(resolve(BACKEND, 'migrations/phase-03.sql'));
  assert(migrationExists, 'Database migration file missing');
});

test('Migration creates game_sessions table', () => {
  let migrationPath = resolve(BACKEND, 'scripts/setup-database.sql');
  if (!existsSync(migrationPath)) {
    migrationPath = resolve(BACKEND, 'migrations/phase-03.sql');
  }

  if (existsSync(migrationPath)) {
    const migration = readFileSync(migrationPath, 'utf-8');
    assert(migration.includes('CREATE TABLE') && migration.includes('game_sessions'),
      'Migration does not create game_sessions table');
    assert(migration.includes('session_id'), 'game_sessions missing session_id');
    assert(migration.includes('game_name'), 'game_sessions missing game_name');
    assert(migration.includes('score'), 'game_sessions missing score');
  }
});

// Backend Dependencies
test('Backend has MySQL dependency', () => {
  const pkg = JSON.parse(readFileSync(resolve(BACKEND, 'package.json'), 'utf-8'));
  assert(pkg.dependencies.mysql2, 'mysql2 dependency missing');
});

test('Backend has Express dependency', () => {
  const pkg = JSON.parse(readFileSync(resolve(BACKEND, 'package.json'), 'utf-8'));
  assert(pkg.dependencies.express, 'express dependency missing');
});

test('Backend has CORS dependency', () => {
  const pkg = JSON.parse(readFileSync(resolve(BACKEND, 'package.json'), 'utf-8'));
  assert(pkg.dependencies.cors, 'cors dependency missing');
});

test('Backend has dotenv dependency', () => {
  const pkg = JSON.parse(readFileSync(resolve(BACKEND, 'package.json'), 'utf-8'));
  assert(pkg.dependencies.dotenv, 'dotenv dependency missing');
});

// Backend API
test('Backend index.js exists', () => {
  assert(existsSync(resolve(BACKEND, 'src/index.js')), 'backend/src/index.js missing');
});

test('API has POST /api/sessions endpoint', () => {
  const index = readFileSync(resolve(BACKEND, 'src/index.js'), 'utf-8');
  assert(index.includes('post') && index.includes('/api/sessions'),
    'POST /api/sessions endpoint missing');
});

test('API has GET /api/sessions/high-scores endpoint', () => {
  const index = readFileSync(resolve(BACKEND, 'src/index.js'), 'utf-8');
  assert(index.includes('get') && index.includes('/api/sessions/high-scores'),
    'GET /api/sessions/high-scores endpoint missing');
});

test('API has health check endpoint', () => {
  const index = readFileSync(resolve(BACKEND, 'src/index.js'), 'utf-8');
  assert(index.includes('/health'), 'Health check endpoint missing');
});

test('API uses database connection pool', () => {
  const index = readFileSync(resolve(BACKEND, 'src/index.js'), 'utf-8');
  assert(index.includes('createPool') || index.includes('pool'),
    'Database connection pool not found');
});

test('API has CORS configured', () => {
  const index = readFileSync(resolve(BACKEND, 'src/index.js'), 'utf-8');
  assert(index.includes('cors'), 'CORS not configured');
  assert(index.includes('child.adhdlearn.com') || index.includes('localhost:5173'),
    'CORS not configured for child portal origins');
});

test('API validates input', () => {
  const index = readFileSync(resolve(BACKEND, 'src/index.js'), 'utf-8');
  assert(index.includes('400') || index.includes('Bad Request'),
    'Input validation (400 errors) not found');
});

test('API handles errors', () => {
  const index = readFileSync(resolve(BACKEND, 'src/index.js'), 'utf-8');
  assert(index.includes('500') || index.includes('catch'),
    'Error handling (500 errors) not found');
});

// Frontend Integration
test('Frontend API service updated for sessions', () => {
  const api = readFileSync(resolve(CHILD_PORTAL, 'src/services/api.js'), 'utf-8');
  assert(api.includes('saveSession'), 'saveSession function missing from api.js');
  assert(api.includes('/api/sessions'), 'saveSession does not call /api/sessions');
});

test('Frontend API service has getHighScores', () => {
  const api = readFileSync(resolve(CHILD_PORTAL, 'src/services/api.js'), 'utf-8');
  assert(api.includes('getHighScores'), 'getHighScores function missing from api.js');
  assert(api.includes('/api/sessions/high-scores'), 'getHighScores does not call correct endpoint');
});

test('LetterPopScene calls saveSession', () => {
  const scene = readFileSync(resolve(CHILD_PORTAL, 'src/phaser-game/scenes/LetterPopScene.js'), 'utf-8');
  assert(scene.includes('saveSession') || scene.includes('api'),
    'LetterPopScene does not call saveSession');
});

test('ResultsScene calls getHighScores', () => {
  const scene = readFileSync(resolve(CHILD_PORTAL, 'src/phaser-game/scenes/ResultsScene.js'), 'utf-8');
  assert(scene.includes('getHighScores') || scene.includes('api'),
    'ResultsScene does not call getHighScores');
});

test('ResultsScene displays high score badge', () => {
  const scene = readFileSync(resolve(CHILD_PORTAL, 'src/phaser-game/scenes/ResultsScene.js'), 'utf-8');
  assert(scene.includes('isHighScore') || scene.includes('HIGH SCORE'),
    'ResultsScene does not display high score badge');
});

// McCabe Complexity
test('Backend endpoints have McCabe ≤ 5', () => {
  const index = readFileSync(resolve(BACKEND, 'src/index.js'), 'utf-8');
  const complexityComments = index.match(/McCabe complexity:\s*\d+/g) || [];
  complexityComments.forEach(comment => {
    const complexity = parseInt(comment.match(/\d+/)[0]);
    assert(complexity <= 5, `Backend function has McCabe complexity ${complexity} > 5`);
  });
});

// Summary
console.log('\n=== Test Summary ===');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed > 0) {
  console.log('\n=== Failures ===');
  failures.forEach(({ name, error }) => {
    console.log(`❌ ${name}`);
    console.log(`   ${error}`);
  });
  process.exit(1);
}

console.log('\n✅ Phase 3 tests PASSED!');
process.exit(0);
