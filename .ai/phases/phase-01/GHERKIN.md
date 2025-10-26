# Phase 1: Project Foundation - Test Scenarios

**Project:** ADHDLearn.com
**Phase:** 1 of 36
**Last Updated:** October 26, 2025

---

## Feature: Project Foundation Setup
**As a** developer
**I want to** have an organized monorepo structure
**So that** I can develop all components efficiently

### Scenario: Directory structure created
```gherkin
Given I am in the project root "/home/corey/Desktop/ADHDLearn.com"
When I list the directories
Then I should see:
  | Directory | Exists |
  | .ai/ | Yes |
  | backend/ | Yes |
  | child-portal/ | Yes |
  | parent-portal/ | Yes |
  | marketing-website/ | Yes |
  | shared/ | Yes |
  | tests/ | Yes |
  | scripts/ | Yes |
```

### Scenario: Backend directory structure
```gherkin
Given I am in "/home/corey/Desktop/ADHDLearn.com/backend"
When I list the directories
Then I should see:
  | Directory/File | Exists |
  | src/ | Yes |
  | src/index.js | Yes |
  | package.json | Yes |
  | README.md | Yes |
```

### Scenario: Child portal directory structure
```gherkin
Given I am in "/home/corey/Desktop/ADHDLearn.com/child-portal"
When I list the directories
Then I should see:
  | Directory/File | Exists |
  | src/ | Yes |
  | public/ | Yes |
  | package.json | Yes |
  | vite.config.js | Yes |
  | README.md | Yes |
```

### Scenario: Parent portal directory structure
```gherkin
Given I am in "/home/corey/Desktop/ADHDLearn.com/parent-portal"
When I list the directories
Then I should see:
  | Directory/File | Exists |
  | src/ | Yes |
  | public/ | Yes |
  | package.json | Yes |
  | vite.config.js | Yes |
  | README.md | Yes |
```

### Scenario: Git repository initialized
```gherkin
Given I am in the project root
When I run "git status"
Then I should see "On branch staging"
And I should not see fatal errors
```

### Scenario: Gitignore configured
```gherkin
Given I am in the project root
When I read ".gitignore"
Then it should contain:
  """
  node_modules/
  dist/
  build/
  .env
  .env.local
  *.log
  .DS_Store
  coverage/
  """
```

### Scenario: npm workspaces configured
```gherkin
Given I am in the project root
When I read "package.json"
Then the "workspaces" field should contain:
  | Workspace |
  | backend |
  | child-portal |
  | parent-portal |
  | shared |

And the "scripts" field should contain:
  | Script | Command |
  | dev:backend | npm run dev --workspace=backend |
  | dev:child | npm run dev --workspace=child-portal |
  | dev:parent | npm run dev --workspace=parent-portal |
  | build:all | npm run build --workspaces |
  | test:all | npm run test --workspaces |
  | lint | eslint . --ext .js,.jsx |
  | format | prettier --write "**/*.{js,jsx,json,md}" |
```

### Scenario: npm install works from root
```gherkin
Given I am in the project root
When I run "npm install"
Then it should install dependencies for all workspaces
And I should not see any errors
And "node_modules/" should exist in:
  | Directory |
  | . (root) |
  | backend/ |
  | child-portal/ |
  | parent-portal/ |
```

### Scenario: ESLint configured with McCabe complexity
```gherkin
Given I am in the project root
When I read ".eslintrc.json"
Then it should have a "complexity" rule set to ["error", 5]
And the environments should include:
  | Environment |
  | browser |
  | es2021 |
  | node |
```

### Scenario: ESLint passes
```gherkin
Given I am in the project root
When I run "npm run lint"
Then there should be no errors
```

### Scenario: Prettier configured
```gherkin
Given I am in the project root
When I check for Prettier configuration
Then ".prettierrc" or ".prettierrc.json" should exist
OR prettier config should be in package.json
```

### Scenario: Prettier can format code
```gherkin
Given I am in the project root
When I run "npm run format"
Then it should format all JavaScript, JSX, JSON, and Markdown files
And there should be no errors
```

### Scenario: README files exist
```gherkin
Given the project structure is created
Then README.md should exist in:
  | Directory | Contains Project Info |
  | / (root) | Yes |
  | backend/ | Yes |
  | child-portal/ | Yes |
  | parent-portal/ | Yes |
  | marketing-website/ | Yes |
  | shared/ | Yes |
  | tests/ | Yes |
```

### Scenario: Root README documents structure
```gherkin
Given I read "/home/corey/Desktop/ADHDLearn.com/README.md"
Then it should explain:
  - Project overview
  - Directory structure
  - Setup instructions
  - Development workflow
```

---

## Acceptance Criteria

From PLAN.md - All must pass:

- [ ] All directories created with README files
- [ ] Git repository initialized
- [ ] npm workspaces configured and working
- [ ] ESLint passes with McCabe ≤ 5 rule
- [ ] Prettier configured
- [ ] Can run `npm install` from root (installs all workspaces)
- [ ] README.md documents project structure

---
