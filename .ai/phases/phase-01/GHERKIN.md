# Phase 1: Project Foundation - BDD Scenarios

**Project:** ADHDLearn.com
**Phase:** 1 of 36
**Last Updated:** October 22, 2025

---

## Feature: Directory Structure Creation

**As a** developer
**I want to** have an organized project structure
**So that** code is maintainable and scalable

### Scenario: Root directory structure exists

```gherkin
Given I am in the project root
When I run "tree -L 1 -d"
Then I should see:
  | Directory | Purpose |
  | /api | Backend Node.js + Express API |
  | /child-portal | Child-facing React application |
  | /parent-portal | Parent-facing React application |
  | /marketing-site | Public marketing website (static) |
  | /shared | Shared utilities, types, constants |
  | /games | Phaser 3 games (Letter Pop, etc.) |
  | /database | SQL migrations and seeds |
  | /.ai | AI-generated plans and documentation |
  | /docs | Technical documentation |
  | /scripts | Deployment and utility scripts |
```

### Scenario: API directory structure

```gherkin
Given I am in "/api"
When I run "tree -L 2 -d"
Then I should see:
  | Directory | Purpose |
  | /src | Source code |
  | /src/routes | Express route handlers |
  | /src/controllers | Business logic controllers |
  | /src/models | Database models |
  | /src/middleware | Express middleware |
  | /src/utils | Utility functions |
  | /src/config | Configuration files |
  | /tests | Test files |

And I should see configuration files:
  | File | Purpose |
  | package.json | Node dependencies |
  | tsconfig.json | TypeScript configuration |
  | .env.example | Environment variable template |
  | jest.config.js | Test configuration |
```

### Scenario: Child portal directory structure

```gherkin
Given I am in "/child-portal"
When I run "tree -L 2 -d src"
Then I should see:
  | Directory | Purpose |
  | /src/components | React components |
  | /src/pages | Page-level components |
  | /src/hooks | Custom React hooks |
  | /src/contexts | React context providers |
  | /src/services | API service functions |
  | /src/utils | Utility functions |
  | /src/assets | Images, fonts, icons |
  | /src/styles | Global styles, theme |

And I should see configuration files:
  | File | Purpose |
  | package.json | React dependencies |
  | vite.config.ts | Vite build configuration |
  | tsconfig.json | TypeScript configuration |
  | index.html | HTML entry point |
```

### Scenario: Games directory structure

```gherkin
Given I am in "/games"
When I run "tree -L 2 -d"
Then I should see:
  | Directory | Purpose |
  | /letter-pop | Letter Pop game source |
  | /word-builder | Word Builder game source |
  | /sight-words | Sight Words game source |
  | /counting-game | Counting game source |
  | /shapes-game | Shapes game source |
  | /addition-game | Addition game source |
  | /shared | Shared game assets and utilities |

And each game should have:
  | Directory | Purpose |
  | /scenes | Phaser 3 scene classes |
  | /assets | Game-specific images, audio |
  | /config | Game configuration |
```

### Scenario: Database directory structure

```gherkin
Given I am in "/database"
When I run "tree -L 2"
Then I should see:
  | Directory/File | Purpose |
  | /migrations | SQL migration files |
  | /seeds | SQL seed data files |
  | schema.sql | Complete database schema |
  | README.md | Database documentation |
```

### Scenario: Git repository initialized

```gherkin
Given I am in the project root
When I run "git status"
Then I should see "On branch staging"
And I should see a .gitignore file containing:
  """
  node_modules/
  dist/
  build/
  .env
  .env.local
  *.log
  .DS_Store
  coverage/
  .vscode/
  .idea/
  *.swp
  *.swo
  """
```

### Scenario: Package.json workspaces configured

```gherkin
Given I am in the project root
When I read "package.json"
Then I should see workspaces configuration:
  """json
  {
    "name": "adhdlearn-monorepo",
    "private": true,
    "workspaces": [
      "api",
      "child-portal",
      "parent-portal",
      "marketing-site",
      "games/*",
      "shared"
    ],
    "scripts": {
      "install:all": "npm install",
      "build:all": "npm run build --workspaces",
      "test:all": "npm run test --workspaces",
      "dev:api": "npm run dev --workspace=api",
      "dev:child": "npm run dev --workspace=child-portal",
      "dev:parent": "npm run dev --workspace=parent-portal"
    }
  }
  """
```

### Scenario: README files exist

```gherkin
Given I am in the project root
Then I should see README.md with content explaining:
  - Project overview
  - Directory structure
  - Setup instructions
  - Development workflow
  - Deployment process

And each subdirectory should have its own README.md:
  | Directory | README content |
  | /api | API documentation, endpoints, setup |
  | /child-portal | Child portal features, components |
  | /parent-portal | Parent portal features, components |
  | /games | Game development guide |
  | /database | Database schema, migrations |
```

---

## Acceptance Criteria

- [ ] All directories created with correct structure
- [ ] package.json configured with workspaces
- [ ] .gitignore excludes node_modules, .env, dist
- [ ] Git repository initialized on staging branch
- [ ] README.md files exist at root and in major subdirectories
- [ ] TypeScript configured in all TypeScript projects
- [ ] No dependencies installed yet (that happens in subsequent phases)
- [ ] Directory structure supports monorepo approach
- [ ] All paths use forward slashes (cross-platform compatible)
