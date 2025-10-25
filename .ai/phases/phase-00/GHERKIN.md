# Phase 0: Server Infrastructure - BDD Scenarios

**Project:** ADHDLearn.com
**Phase:** 0 of 36
**Last Updated:** October 22, 2025

---

## Feature: Apache Virtual Host Configuration

**As a** system administrator
**I want to** configure 8 Apache virtual hosts
**So that** all subdomains route correctly to their directories

### Scenario: Production domains resolve correctly

```gherkin
Given I have configured Apache virtual hosts
When I navigate to "https://adhdlearn.com"
Then I should see the placeholder page from "/var/www/adhdlearn.com/production/marketing"
And the SSL certificate should be valid (Let's Encrypt)
And the connection should be HTTPS

When I navigate to "https://child.adhdlearn.com"
Then I should see the placeholder page from "/var/www/adhdlearn.com/production/child"
And the SSL certificate should be valid

When I navigate to "https://parent.adhdlearn.com"
Then I should see the placeholder page from "/var/www/adhdlearn.com/production/parent"
And the SSL certificate should be valid

When I navigate to "https://api.adhdlearn.com/health"
Then I should see a JSON response: {"status": "ok"}
And the SSL certificate should be valid
```

### Scenario: Staging domains resolve correctly

```gherkin
Given I have configured Apache virtual hosts
When I navigate to "https://staging.adhdlearn.com"
Then I should see the placeholder page from "/var/www/adhdlearn.com/staging/marketing"
And the SSL certificate should be valid

When I navigate to "https://child-staging.adhdlearn.com"
Then I should see the placeholder page from "/var/www/adhdlearn.com/staging/child"

When I navigate to "https://parent-staging.adhdlearn.com"
Then I should see the placeholder page from "/var/www/adhdlearn.com/staging/parent"

When I navigate to "https://api-staging.adhdlearn.com/health"
Then I should see a JSON response: {"status": "ok", "environment": "staging"}
```

### Scenario: Directory structure created

```gherkin
Given I have SSH access to the server
When I run "ls -la /var/www/adhdlearn.com"
Then I should see directories:
  | Directory | Owner | Permissions |
  | production | www-data | 755 |
  | staging | www-data | 755 |

When I run "ls -la /var/www/adhdlearn.com/production"
Then I should see subdirectories:
  | Subdirectory |
  | marketing |
  | child |
  | parent |
  | api |

When I run "ls -la /var/www/adhdlearn.com/staging"
Then I should see subdirectories:
  | Subdirectory |
  | marketing |
  | child |
  | parent |
  | api |
```

### Scenario: Git repository initialized

```gherkin
Given I am in "/var/www/adhdlearn.com"
When I run "git branch"
Then I should see:
  | Branch |
  | * main |
  | staging |

When I run "git remote -v"
Then I should see a remote origin configured

When I run "git log"
Then I should see initial commit: "Initial repository setup"
```

### Scenario: Git hooks configured

```gherkin
Given I have git hooks in ".git/hooks"
When I run "ls -la .git/hooks"
Then I should see:
  | Hook | Executable |
  | post-receive | Yes |

Given the post-receive hook contains deployment logic
When I push to "staging" branch
Then the hook should:
  - Check out code to "/var/www/adhdlearn.com/staging"
  - Run "npm install" in each subdirectory
  - Run "npm run build" in each subdirectory
  - Restart PM2 processes for staging API

When I push to "main" branch
Then the hook should:
  - Check out code to "/var/www/adhdlearn.com/production"
  - Run "npm install" in each subdirectory
  - Run "npm run build" in each subdirectory
  - Restart PM2 processes for production API
```

### Scenario: SSL certificates configured

```gherkin
Given I have Let's Encrypt installed
When I run "certbot certificates"
Then I should see valid certificates for:
  | Domain | Expiration |
  | adhdlearn.com | (future date) |
  | staging.adhdlearn.com | (future date) |
  | child.adhdlearn.com | (future date) |
  | child-staging.adhdlearn.com | (future date) |
  | parent.adhdlearn.com | (future date) |
  | parent-staging.adhdlearn.com | (future date) |
  | api.adhdlearn.com | (future date) |
  | api-staging.adhdlearn.com | (future date) |

And certbot auto-renewal should be configured in cron
And certificates should auto-renew 30 days before expiration
```

### Scenario: Apache configuration valid

```gherkin
Given I have modified Apache configuration
When I run "apache2ctl configtest"
Then I should see "Syntax OK"

When I run "systemctl status apache2"
Then Apache should be "active (running)"
And no errors should appear in the logs
```

### Scenario: Placeholder pages deployed

```gherkin
Given I have created placeholder index.html files
When I navigate to "https://adhdlearn.com"
Then I should see HTML content containing:
  """
  <h1>ADHDLearn.com - Coming Soon</h1>
  <p>Learning Adventures for Curious Minds</p>
  """

When I navigate to "https://child.adhdlearn.com"
Then I should see HTML content containing:
  """
  <h1>Child Portal - Coming Soon</h1>
  """

When I navigate to "https://parent.adhdlearn.com"
Then I should see HTML content containing:
  """
  <h1>Parent Portal - Coming Soon</h1>
  """
```

---

## Acceptance Criteria

- [ ] All 8 subdomains resolve correctly
- [ ] All connections use HTTPS (HTTP redirects to HTTPS)
- [ ] SSL certificates valid and auto-renewing
- [ ] Directory structure exists with correct permissions
- [ ] Git repository initialized with main and staging branches
- [ ] Git hooks deploy on push
- [ ] Apache configuration has no syntax errors
- [ ] Placeholder pages load successfully
- [ ] Server firewall allows ports 80, 443, 22
