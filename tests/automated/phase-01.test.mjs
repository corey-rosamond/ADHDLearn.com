#!/usr/bin/env node

/**
 * Phase 1 Automated Tests
 * Tests project foundation setup
 */

import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const PROJECT_ROOT = resolve(process.cwd());

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
  return existsSync(resolve(PROJECT_ROOT, path));
}

console.log('=== Phase 1: Project Foundation Tests ===\n');

// Directory Structure Tests
test('Root directories exist', () => {
  assert(fileExists('.ai'), '.ai/ directory missing');
  assert(fileExists('backend'), 'backend/ directory missing');
  assert(fileExists('child-portal'), 'child-portal/ directory missing');
  assert(fileExists('parent-portal'), 'parent-portal/ directory missing');
  assert(fileExists('marketing-website'), 'marketing-website/ directory missing');
  assert(fileExists('shared'), 'shared/ directory missing');
  assert(fileExists('tests'), 'tests/ directory missing');
  assert(fileExists('scripts'), 'scripts/ directory missing');
});

test('Backend structure exists', () => {
  assert(fileExists('backend/src'), 'backend/src/ missing');
  assert(fileExists('backend/src/index.js'), 'backend/src/index.js missing');
  assert(fileExists('backend/package.json'), 'backend/package.json missing');
  assert(fileExists('backend/README.md'), 'backend/README.md missing');
});

test('Child portal structure exists', () => {
  assert(fileExists('child-portal/src'), 'child-portal/src/ missing');
  assert(fileExists('child-portal/public'), 'child-portal/public/ missing');
  assert(fileExists('child-portal/package.json'), 'child-portal/package.json missing');
  assert(fileExists('child-portal/vite.config.js'), 'child-portal/vite.config.js missing');
  assert(fileExists('child-portal/README.md'), 'child-portal/README.md missing');
});

test('Parent portal structure exists', () => {
  assert(fileExists('parent-portal/src'), 'parent-portal/src/ missing');
  assert(fileExists('parent-portal/public'), 'parent-portal/public/ missing');
  assert(fileExists('parent-portal/package.json'), 'parent-portal/package.json missing');
  assert(fileExists('parent-portal/vite.config.js'), 'parent-portal/vite.config.js missing');
  assert(fileExists('parent-portal/README.md'), 'parent-portal/README.md missing');
});

// Git Tests
test('Git repository initialized', () => {
  assert(fileExists('.git'), '.git directory missing - git not initialized');
});

test('.gitignore configured', () => {
  assert(fileExists('.gitignore'), '.gitignore missing');
  const content = readFileSync(resolve(PROJECT_ROOT, '.gitignore'), 'utf-8');
  assert(content.includes('node_modules/'), '.gitignore missing node_modules/');
  assert(content.includes('dist/'), '.gitignore missing dist/');
  assert(content.includes('.env'), '.gitignore missing .env');
});

// npm Workspaces Tests
test('Root package.json exists', () => {
  assert(fileExists('package.json'), 'package.json missing');
});

test('npm workspaces configured', () => {
  const pkg = JSON.parse(readFileSync(resolve(PROJECT_ROOT, 'package.json'), 'utf-8'));
  assert(pkg.workspaces, 'workspaces field missing');
  assert(pkg.workspaces.includes('backend'), 'backend not in workspaces');
  assert(pkg.workspaces.includes('child-portal'), 'child-portal not in workspaces');
  assert(pkg.workspaces.includes('parent-portal'), 'parent-portal not in workspaces');
  assert(pkg.workspaces.includes('shared'), 'shared not in workspaces');
});

test('npm scripts configured', () => {
  const pkg = JSON.parse(readFileSync(resolve(PROJECT_ROOT, 'package.json'), 'utf-8'));
  assert(pkg.scripts, 'scripts field missing');
  assert(pkg.scripts['dev:backend'], 'dev:backend script missing');
  assert(pkg.scripts['dev:child'], 'dev:child script missing');
  assert(pkg.scripts['dev:parent'], 'dev:parent script missing');
  assert(pkg.scripts['lint'], 'lint script missing');
});

// ESLint Tests
test('ESLint configuration exists', () => {
  assert(fileExists('.eslintrc.json') || fileExists('.eslintrc.js'), 'ESLint config missing');
});

test('ESLint McCabe complexity rule configured', () => {
  if (fileExists('.eslintrc.json')) {
    const config = JSON.parse(readFileSync(resolve(PROJECT_ROOT, '.eslintrc.json'), 'utf-8'));
    assert(config.rules, 'ESLint rules missing');
    assert(config.rules.complexity, 'McCabe complexity rule missing');
    assert(Array.isArray(config.rules.complexity) && config.rules.complexity[1] === 5,
      'McCabe complexity should be ["error", 5]');
  }
});

// README Tests
test('README files exist', () => {
  assert(fileExists('README.md'), 'Root README.md missing');
  assert(fileExists('backend/README.md'), 'backend/README.md missing');
  assert(fileExists('child-portal/README.md'), 'child-portal/README.md missing');
  assert(fileExists('parent-portal/README.md'), 'parent-portal/README.md missing');
  assert(fileExists('tests/README.md'), 'tests/README.md missing');
});

test('Root README has content', () => {
  const readme = readFileSync(resolve(PROJECT_ROOT, 'README.md'), 'utf-8');
  assert(readme.length > 100, 'Root README.md appears empty');
  assert(readme.toLowerCase().includes('adhd'), 'README missing project description');
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

console.log('\n✅ Phase 1 tests PASSED!');
process.exit(0);
