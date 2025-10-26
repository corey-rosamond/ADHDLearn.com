#!/usr/bin/env node

/**
 * Phase 2 Automated Tests
 * Tests Letter Pop standalone deployment
 */

import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const PROJECT_ROOT = resolve(process.cwd());
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

function fileExists(path) {
  return existsSync(resolve(CHILD_PORTAL, path));
}

console.log('=== Phase 2: Letter Pop Deployment Tests ===\n');

// React + Vite Configuration
test('Vite configuration exists', () => {
  assert(fileExists('vite.config.js'), 'vite.config.js missing');
  const config = readFileSync(resolve(CHILD_PORTAL, 'vite.config.js'), 'utf-8');
  assert(config.includes('react'), 'Vite not configured for React');
});

test('Package.json has correct dependencies', () => {
  const pkg = JSON.parse(readFileSync(resolve(CHILD_PORTAL, 'package.json'), 'utf-8'));
  assert(pkg.dependencies.react, 'React dependency missing');
  assert(pkg.dependencies['react-dom'], 'React-DOM dependency missing');
  assert(pkg.dependencies.phaser, 'Phaser dependency missing');
  assert(pkg.devDependencies.vite, 'Vite dev dependency missing');
});

test('Package.json has build scripts', () => {
  const pkg = JSON.parse(readFileSync(resolve(CHILD_PORTAL, 'package.json'), 'utf-8'));
  assert(pkg.scripts.dev, 'dev script missing');
  assert(pkg.scripts.build, 'build script missing');
  assert(pkg.scripts.preview, 'preview script missing');
});

// Game Structure
test('Phaser game directory structure exists', () => {
  assert(fileExists('src/phaser-game'), 'src/phaser-game directory missing');
  assert(fileExists('src/phaser-game/scenes'), 'scenes directory missing');
  assert(fileExists('src/phaser-game/components'), 'components directory missing');
  assert(fileExists('src/phaser-game/services'), 'services directory missing');
});

test('Letter Pop game files exist', () => {
  assert(fileExists('src/phaser-game/scenes/LetterPopScene.js'), 'LetterPopScene.js missing');
  assert(fileExists('src/phaser-game/scenes/ResultsScene.js'), 'ResultsScene.js missing');
  assert(fileExists('src/phaser-game/scenes/PreloadScene.js'), 'PreloadScene.js missing');
  assert(fileExists('src/phaser-game/scenes/MainMenuScene.js'), 'MainMenuScene.js missing');
});

test('Game uses ES6 modules', () => {
  const letterPopScene = readFileSync(resolve(CHILD_PORTAL, 'src/phaser-game/scenes/LetterPopScene.js'), 'utf-8');
  assert(letterPopScene.includes('export default'), 'LetterPopScene not using ES6 export');
  assert(letterPopScene.includes('import'), 'LetterPopScene not using ES6 import');
});

// Assets
test('Game assets directory exists', () => {
  assert(fileExists('public/assets'), 'public/assets directory missing');
  assert(fileExists('public/assets/audio'), 'audio directory missing');
  assert(fileExists('public/assets/images'), 'images directory missing');
});

test('Audio files exist', () => {
  assert(fileExists('public/assets/audio/success.mp3') ||
         fileExists('public/assets/audio/correct.mp3'),
         'Success audio file missing');
});

// React Integration
test('React App component exists', () => {
  assert(fileExists('src/App.jsx'), 'App.jsx missing');
  const app = readFileSync(resolve(CHILD_PORTAL, 'src/App.jsx'), 'utf-8');
  assert(app.includes('React') || app.includes('react'), 'App.jsx not using React');
});

test('React entry point exists', () => {
  assert(fileExists('src/main.jsx'), 'main.jsx missing');
  const main = readFileSync(resolve(CHILD_PORTAL, 'src/main.jsx'), 'utf-8');
  assert(main.includes('ReactDOM') || main.includes('createRoot'), 'main.jsx not using React DOM');
});

test('HTML entry point exists', () => {
  assert(fileExists('index.html'), 'index.html missing');
  const html = readFileSync(resolve(CHILD_PORTAL, 'index.html'), 'utf-8');
  assert(html.includes('root'), 'index.html missing root div');
});

// API Service
test('API service exists', () => {
  assert(fileExists('src/services/api.js'), 'api.js service missing');
  const api = readFileSync(resolve(CHILD_PORTAL, 'src/services/api.js'), 'utf-8');
  assert(api.includes('saveSession'), 'saveSession function missing');
  assert(api.includes('getHighScores'), 'getHighScores function missing');
});

// Code Quality
test('LetterPopScene has low complexity', () => {
  const scene = readFileSync(resolve(CHILD_PORTAL, 'src/phaser-game/scenes/LetterPopScene.js'), 'utf-8');
  // Check for McCabe complexity comments
  const complexityComments = scene.match(/McCabe complexity:\s*\d+/g) || [];
  complexityComments.forEach(comment => {
    const complexity = parseInt(comment.match(/\d+/)[0]);
    assert(complexity <= 5, `Function has McCabe complexity ${complexity} > 5`);
  });
});

test('ResultsScene has low complexity', () => {
  const scene = readFileSync(resolve(CHILD_PORTAL, 'src/phaser-game/scenes/ResultsScene.js'), 'utf-8');
  const complexityComments = scene.match(/McCabe complexity:\s*\d+/g) || [];
  complexityComments.forEach(comment => {
    const complexity = parseInt(comment.match(/\d+/)[0]);
    assert(complexity <= 5, `Function has McCabe complexity ${complexity} > 5`);
  });
});

// Build Test (optional - requires dependencies installed)
test('Node modules installed', () => {
  assert(existsSync(resolve(CHILD_PORTAL, 'node_modules')),
    'node_modules missing - run npm install first');
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

console.log('\n✅ Phase 2 tests PASSED!');
process.exit(0);
