# Phase 1: Project Foundation - Architecture Diagrams

**Project:** ADHDLearn.com
**Phase:** 1 of 36
**Last Updated:** October 22, 2025

---

## Overview

**Delivers:** Clean directory structure and git repository
**Architecture Changes:** Local development environment setup

---

## Project Directory Structure

```mermaid
graph TB
    Root[ADHDLearn.com/<br/>Root Directory]

    Root --> AI[.ai/<br/>Planning & Documentation]
    Root --> Backend[backend/<br/>Node.js API]
    Root --> ChildPortal[child-portal/<br/>React + Phaser]
    Root --> ParentPortal[parent-portal/<br/>React]
    Root --> Marketing[marketing-website/<br/>Static HTML]
    Root --> Shared[shared/<br/>Shared utilities]
    Root --> Tests[tests/<br/>E2E tests]
    Root --> Scripts[scripts/<br/>Deployment]
    Root --> Config[package.json<br/>Root workspace]

    AI --> AIPlan[plan/<br/>PLAN, GHERKIN, UML, WIREFRAMES]
    AI --> AIPhases[phases/<br/>phase-00 through phase-36]

    Backend --> BackendSrc[src/<br/>API code]
    Backend --> BackendTests[tests/<br/>Unit tests]

    ChildPortal --> ChildSrc[src/<br/>React components]
    ChildPortal --> ChildGames[src/games/<br/>Phaser games]

    ParentPortal --> ParentSrc[src/<br/>React components]
    ParentPortal --> ParentPages[src/pages/<br/>Dashboard, etc.]

    style Root fill:#e1f5ff
    style AI fill:#ffe1f5
    style Backend fill:#e8f5e8
    style ChildPortal fill:#fff4e1
```

---

## npm Workspace Configuration

```mermaid
graph LR
    RootPkg[Root package.json<br/>Workspaces config]

    RootPkg --> Workspace1[backend/<br/>API workspace]
    RootPkg --> Workspace2[child-portal/<br/>Child workspace]
    RootPkg --> Workspace3[parent-portal/<br/>Parent workspace]
    RootPkg --> Workspace4[shared/<br/>Shared workspace]

    Workspace1 --> Deps1[Dependencies:<br/>express, mysql2, cors]
    Workspace2 --> Deps2[Dependencies:<br/>react, phaser, vite]
    Workspace3 --> Deps3[Dependencies:<br/>react, recharts, vite]
    Workspace4 --> Deps4[Dependencies:<br/>joi, date-fns]

    style RootPkg fill:#e1f5ff
```

---

## Database Changes

None

---

## API Endpoints

None
