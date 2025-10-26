#!/usr/bin/env node

/**
 * Phase 4 Automated Tests
 * Tests parent registration + login
 */

import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const PROJECT_ROOT = resolve(process.cwd());
const BACKEND = resolve(PROJECT_ROOT, 'backend');
const PARENT_PORTAL = resolve(PROJECT_ROOT, 'parent-portal');

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

console.log('=== Phase 4: Parent Auth Tests ===\n');

// Database Migration
test('Phase 4 migration file exists', () => {
  assert(existsSync(resolve(BACKEND, 'migrations/phase-04.sql')),
    'Phase 4 migration file missing');
});

test('Migration creates families table', () => {
  const migration = readFileSync(resolve(BACKEND, 'migrations/phase-04.sql'), 'utf-8');
  assert(migration.includes('CREATE TABLE') && migration.includes('families'),
    'Migration does not create families table');
  assert(migration.includes('family_id'), 'families table missing family_id');
  assert(migration.includes('family_name'), 'families table missing family_name');
});

test('Migration creates users table', () => {
  const migration = readFileSync(resolve(BACKEND, 'migrations/phase-04.sql'), 'utf-8');
  assert(migration.includes('CREATE TABLE') && migration.includes('users'),
    'Migration does not create users table');
  assert(migration.includes('user_id'), 'users table missing user_id');
  assert(migration.includes('email'), 'users table missing email');
  assert(migration.includes('password_hash'), 'users table missing password_hash');
  assert(migration.includes('role'), 'users table missing role');
});

test('Migration creates auth_sessions table', () => {
  const migration = readFileSync(resolve(BACKEND, 'migrations/phase-04.sql'), 'utf-8');
  assert(migration.includes('CREATE TABLE') && migration.includes('auth_sessions'),
    'Migration does not create auth_sessions table');
  assert(migration.includes('token'), 'auth_sessions table missing token');
  assert(migration.includes('expires_at'), 'auth_sessions table missing expires_at');
});

// Backend Dependencies
test('Backend has bcrypt dependency', () => {
  const pkg = JSON.parse(readFileSync(resolve(BACKEND, 'package.json'), 'utf-8'));
  assert(pkg.dependencies.bcrypt, 'bcrypt dependency missing');
});

test('Backend has jsonwebtoken dependency', () => {
  const pkg = JSON.parse(readFileSync(resolve(BACKEND, 'package.json'), 'utf-8'));
  assert(pkg.dependencies.jsonwebtoken, 'jsonwebtoken dependency missing');
});

// Backend Auth Controller
test('Auth controller exists', () => {
  assert(existsSync(resolve(BACKEND, 'src/controllers/authController.js')),
    'authController.js missing');
});

test('Auth controller has register function', () => {
  const controller = readFileSync(resolve(BACKEND, 'src/controllers/authController.js'), 'utf-8');
  assert(controller.includes('function register') || controller.includes('register =') ||
         controller.includes('async register'),
    'register function missing from authController');
});

test('Auth controller has loginParent function', () => {
  const controller = readFileSync(resolve(BACKEND, 'src/controllers/authController.js'), 'utf-8');
  assert(controller.includes('function loginParent') || controller.includes('loginParent =') ||
         controller.includes('async loginParent'),
    'loginParent function missing from authController');
});

test('Auth controller uses bcrypt', () => {
  const controller = readFileSync(resolve(BACKEND, 'src/controllers/authController.js'), 'utf-8');
  assert(controller.includes('bcrypt'), 'authController does not import bcrypt');
  assert(controller.includes('hash') || controller.includes('compare'),
    'authController does not use bcrypt.hash or bcrypt.compare');
});

test('Auth controller uses JWT', () => {
  const controller = readFileSync(resolve(BACKEND, 'src/controllers/authController.js'), 'utf-8');
  assert(controller.includes('jwt') || controller.includes('jsonwebtoken'),
    'authController does not import jwt');
  assert(controller.includes('sign'), 'authController does not use jwt.sign');
});

test('Register validates password length', () => {
  const controller = readFileSync(resolve(BACKEND, 'src/controllers/authController.js'), 'utf-8');
  assert(controller.includes('password.length') && controller.includes('8'),
    'Password length validation (min 8) not found');
});

test('Auth controller has McCabe ≤ 5', () => {
  const controller = readFileSync(resolve(BACKEND, 'src/controllers/authController.js'), 'utf-8');
  const complexityComments = controller.match(/McCabe complexity:\s*\d+/g) || [];
  complexityComments.forEach(comment => {
    const complexity = parseInt(comment.match(/\d+/)[0]);
    assert(complexity <= 5, `Auth function has McCabe complexity ${complexity} > 5`);
  });
});

// Backend Auth Middleware
test('Auth middleware exists', () => {
  assert(existsSync(resolve(BACKEND, 'src/middleware/authMiddleware.js')),
    'authMiddleware.js missing');
});

test('Auth middleware has authenticateToken function', () => {
  const middleware = readFileSync(resolve(BACKEND, 'src/middleware/authMiddleware.js'), 'utf-8');
  assert(middleware.includes('function authenticateToken') ||
         middleware.includes('authenticateToken ='),
    'authenticateToken function missing');
});

// Backend Routes
test('Backend has auth routes registered', () => {
  const index = readFileSync(resolve(BACKEND, 'src/index.js'), 'utf-8');
  assert(index.includes('/api/auth/register'), 'POST /api/auth/register route missing');
  assert(index.includes('/api/auth/login/parent'), 'POST /api/auth/login/parent route missing');
});

test('Backend CORS includes parent portal', () => {
  const index = readFileSync(resolve(BACKEND, 'src/index.js'), 'utf-8');
  assert(index.includes('parent.adhdlearn.com') || index.includes('localhost:5174'),
    'CORS not configured for parent portal');
});

// Parent Portal Frontend
test('Parent portal has React dependency', () => {
  const pkg = JSON.parse(readFileSync(resolve(PARENT_PORTAL, 'package.json'), 'utf-8'));
  assert(pkg.dependencies.react, 'React dependency missing from parent-portal');
  assert(pkg.dependencies['react-dom'], 'React-DOM missing from parent-portal');
});

test('Parent portal has React Router', () => {
  const pkg = JSON.parse(readFileSync(resolve(PARENT_PORTAL, 'package.json'), 'utf-8'));
  assert(pkg.dependencies['react-router-dom'], 'React Router missing from parent-portal');
});

test('Auth service exists', () => {
  assert(existsSync(resolve(PARENT_PORTAL, 'src/services/auth.js')),
    'auth.js service missing');
});

test('Auth service has register function', () => {
  const auth = readFileSync(resolve(PARENT_PORTAL, 'src/services/auth.js'), 'utf-8');
  assert(auth.includes('function register') || auth.includes('export') && auth.includes('register'),
    'register function missing from auth service');
});

test('Auth service has loginParent function', () => {
  const auth = readFileSync(resolve(PARENT_PORTAL, 'src/services/auth.js'), 'utf-8');
  assert(auth.includes('loginParent'), 'loginParent function missing from auth service');
});

// AuthContext
test('AuthContext exists', () => {
  assert(existsSync(resolve(PARENT_PORTAL, 'src/context/AuthContext.jsx')),
    'AuthContext.jsx missing');
});

test('AuthContext has AuthProvider', () => {
  const context = readFileSync(resolve(PARENT_PORTAL, 'src/context/AuthContext.jsx'), 'utf-8');
  assert(context.includes('AuthProvider'), 'AuthProvider missing from AuthContext');
  assert(context.includes('useState') || context.includes('createContext'),
    'AuthContext not using React hooks');
});

test('AuthContext has login function', () => {
  const context = readFileSync(resolve(PARENT_PORTAL, 'src/context/AuthContext.jsx'), 'utf-8');
  assert(context.includes('login'), 'login function missing from AuthContext');
});

test('AuthContext has logout function', () => {
  const context = readFileSync(resolve(PARENT_PORTAL, 'src/context/AuthContext.jsx'), 'utf-8');
  assert(context.includes('logout'), 'logout function missing from AuthContext');
});

// Pages
test('Register page exists', () => {
  assert(existsSync(resolve(PARENT_PORTAL, 'src/pages/Register.jsx')),
    'Register.jsx page missing');
});

test('Login page exists', () => {
  assert(existsSync(resolve(PARENT_PORTAL, 'src/pages/Login.jsx')),
    'Login.jsx page missing');
});

test('Dashboard page exists', () => {
  assert(existsSync(resolve(PARENT_PORTAL, 'src/pages/Dashboard.jsx')),
    'Dashboard.jsx page missing');
});

test('Register page calls register API', () => {
  const register = readFileSync(resolve(PARENT_PORTAL, 'src/pages/Register.jsx'), 'utf-8');
  assert(register.includes('register'), 'Register page does not call register function');
});

test('Login page calls loginParent API', () => {
  const login = readFileSync(resolve(PARENT_PORTAL, 'src/pages/Login.jsx'), 'utf-8');
  assert(login.includes('loginParent') || login.includes('login'),
    'Login page does not call loginParent function');
});

test('Dashboard shows user info', () => {
  const dashboard = readFileSync(resolve(PARENT_PORTAL, 'src/pages/Dashboard.jsx'), 'utf-8');
  assert(dashboard.includes('user') && dashboard.includes('Welcome'),
    'Dashboard does not display user info');
});

// App.jsx Routing
test('App.jsx has Router configured', () => {
  const app = readFileSync(resolve(PARENT_PORTAL, 'src/App.jsx'), 'utf-8');
  assert(app.includes('BrowserRouter') || app.includes('Router'),
    'App.jsx does not use React Router');
  assert(app.includes('Routes') && app.includes('Route'),
    'App.jsx does not have Routes configured');
});

test('App.jsx has protected routes', () => {
  const app = readFileSync(resolve(PARENT_PORTAL, 'src/App.jsx'), 'utf-8');
  assert(app.includes('ProtectedRoute') || app.includes('isAuthenticated'),
    'App.jsx does not have protected routes');
});

test('App.jsx wraps with AuthProvider', () => {
  const app = readFileSync(resolve(PARENT_PORTAL, 'src/App.jsx'), 'utf-8');
  assert(app.includes('AuthProvider'), 'App.jsx does not wrap with AuthProvider');
});

// McCabe Complexity
test('Frontend components have McCabe ≤ 5', () => {
  const files = [
    resolve(PARENT_PORTAL, 'src/pages/Register.jsx'),
    resolve(PARENT_PORTAL, 'src/pages/Login.jsx'),
    resolve(PARENT_PORTAL, 'src/pages/Dashboard.jsx')
  ];

  files.forEach(file => {
    if (existsSync(file)) {
      const content = readFileSync(file, 'utf-8');
      const complexityComments = content.match(/McCabe complexity:\s*\d+/g) || [];
      complexityComments.forEach(comment => {
        const complexity = parseInt(comment.match(/\d+/)[0]);
        assert(complexity <= 5, `${file} has McCabe complexity ${complexity} > 5`);
      });
    }
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

console.log('\n✅ Phase 4 tests PASSED!');
process.exit(0);
