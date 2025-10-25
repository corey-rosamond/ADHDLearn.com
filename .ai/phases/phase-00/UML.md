# Phase 0: Server Infrastructure - Architecture Diagrams

**Project:** ADHDLearn.com
**Phase:** 0 of 36
**Last Updated:** October 22, 2025

---

## Overview

**Delivers:** Production and staging environments ready for deployment
**Architecture Changes:** Initial server setup with Apache, SSL, firewall

---

## Server Infrastructure Diagram

```mermaid
graph TB
    subgraph "DNS Layer"
        CloudFlare[CloudFlare DNS<br/>or Domain Registrar]
    end

    subgraph "Server: 160.153.180.159"
        Apache[Apache 2.4<br/>Web Server<br/>Ports 80, 443]
        LetsEncrypt[Let's Encrypt<br/>SSL Certificates<br/>Auto-renewal]

        subgraph "Production Environment"
            ProdMarketing[/var/www/adhdlearn.com/production/www]
            ProdChild[/var/www/adhdlearn.com/production/child]
            ProdParent[/var/www/adhdlearn.com/production/parent]
            ProdAPI[/var/www/adhdlearn.com/production/api]
        end

        subgraph "Staging Environment"
            StagingMarketing[/var/www/adhdlearn.com/staging/www]
            StagingChild[/var/www/adhdlearn.com/staging/child]
            StagingParent[/var/www/adhdlearn.com/staging/parent]
            StagingAPI[/var/www/adhdlearn.com/staging/api]
        end

        Firewall[UFW Firewall<br/>Ports: 22, 80, 443]
    end

    CloudFlare -->|A records| Firewall
    Firewall --> Apache
    Apache -->|VirtualHost| ProdMarketing
    Apache -->|VirtualHost| ProdChild
    Apache -->|VirtualHost| ProdParent
    Apache -->|Reverse Proxy| ProdAPI
    Apache -->|VirtualHost| StagingMarketing
    Apache -->|VirtualHost| StagingChild
    Apache -->|VirtualHost| StagingParent
    Apache -->|Reverse Proxy| StagingAPI

    Apache -.->|SSL/TLS| LetsEncrypt

    style Apache fill:#ff9999
    style LetsEncrypt fill:#99ff99
    style Firewall fill:#ffcc99
```

---

## Apache VirtualHost Routing

```mermaid
graph LR
    subgraph "Production Domains"
        A1[adhdlearn.com<br/>:443]
        A2[child.adhdlearn.com<br/>:443]
        A3[parent.adhdlearn.com<br/>:443]
        A4[api.adhdlearn.com<br/>:443]
    end

    subgraph "Staging Domains"
        B1[staging.adhdlearn.com<br/>:443]
        B2[staging-child.adhdlearn.com<br/>:443]
        B3[staging-parent.adhdlearn.com<br/>:443]
        B4[staging-api.adhdlearn.com<br/>:443]
    end

    subgraph "Document Roots"
        R1[/production/www]
        R2[/production/child]
        R3[/production/parent]
        R4[Reverse Proxy<br/>localhost:5000]
        R5[/staging/www]
        R6[/staging/child]
        R7[/staging/parent]
        R8[Reverse Proxy<br/>localhost:5001]
    end

    A1 --> R1
    A2 --> R2
    A3 --> R3
    A4 --> R4
    B1 --> R5
    B2 --> R6
    B3 --> R7
    B4 --> R8

    style A1 fill:#e1f5ff
    style A2 fill:#ffe1f5
    style A3 fill:#fff4e1
    style A4 fill:#e8f5e8
```

---

## Database Changes

None (database setup happens in Phase 3)

---

## API Endpoints

None (API setup happens in Phase 3)
