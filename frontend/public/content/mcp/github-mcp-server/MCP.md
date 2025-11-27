---
# Basic Identity
name: GitHub MCP Server
mcp_id: github-mcp-server
description: |
  Complete GitHub integration for AI assistants via MCP.
  Manage repositories, issues, pull requests, code search, and workflows.
  Enables automated repository management and collaborative development tasks.

# Classification
server_type: integration
category: version-control
difficulty: intermediate
language: typescript

# Marketplace Metadata
organization: GitHub
repository: https://github.com/modelcontextprotocol/servers/tree/main/src/github
npm_package: "@modelcontextprotocol/server-github"
license: MIT

# Metadata
author: MCP Team
created_date: 2024-11-15
last_modified: 2025-01-20
version: "0.6.1"
status: active

# Usage Information
estimated_setup_time: 10-15 minutes
compatible_clients:
  - Claude Desktop
  - Claude Code
  - Zed
  - Continue
supported_platforms:
  - macOS
  - Windows
  - Linux

# Organization
tags:
  - github
  - git
  - repositories
  - issues
  - pull-requests
  - code-search
keywords:
  - version control
  - repository management
  - issue tracking
  - PR automation
  - code collaboration

# Requirements
prerequisites:
  - GitHub account
  - Personal Access Token (PAT) or GitHub App
  - Node.js 18+
  - Network access to api.github.com

tools_provided:
  - create_repository: Create new GitHub repositories
  - get_file_contents: Read file contents from repositories
  - push_files: Commit and push file changes
  - create_issue: Create new issues
  - create_pull_request: Create PRs
  - fork_repository: Fork repositories
  - create_branch: Create new branches
  - list_commits: List repository commits
  - list_issues: Search and list issues
  - update_issue: Modify existing issues
  - add_issue_comment: Comment on issues
  - search_repositories: Search GitHub repositories
  - search_code: Search code across GitHub
  - search_issues: Advanced issue search
  - search_users: Find GitHub users
  - get_issue: Get issue details
  - get_pull_request: Get PR details
  - list_pull_requests: List repository PRs

resources_provided:
  - repo://{owner}/{repo}: Access repository metadata
  - issue://{owner}/{repo}/issues/{number}: Access issue details
  - pr://{owner}/{repo}/pulls/{number}: Access PR information

# Configuration
mcp_config_example: |
  {
    "mcpServers": {
      "github": {
        "command": "npx",
        "args": [
          "-y",
          "@modelcontextprotocol/server-github"
        ],
        "env": {
          "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
        }
      }
    }
  }

# Security
security_features:
  - Token-based authentication
  - Scoped permissions via PAT
  - Read/write access control
  - API rate limiting respected

# References
references:
  - references/setup-guide.md
  - references/authentication-guide.md
  - references/common-workflows.md
  - references/examples/issue-automation.md
  - references/examples/pr-management.md

# Analytics
usage_count: 0
downloads: 75000+
---

# GitHub MCP Server

Complete GitHub integration enabling AI-powered repository management, issue tracking, and collaborative development.

---

## Overview

The GitHub MCP Server brings the full power of GitHub to your AI assistant through the Model Context Protocol. Manage repositories, track issues, create pull requests, search code, and automate workflows—all through natural language.

**Key Features:**
- 📦 **Repository Management**: Create, fork, and manage repositories
- 🔍 **Code Search**: Search code across all of GitHub
- 🐛 **Issue Tracking**: Create, update, and manage issues
- 🔀 **Pull Requests**: Create and manage PRs programmatically
- 🌳 **Branch Operations**: Create branches and manage workflows
- 📊 **Advanced Search**: Find repositories, users, issues, and code

---

## When to Use

Use this MCP server when you need:
- Automated repository management
- Issue and PR workflows
- Code discovery and search
- Repository operations via AI
- Development workflow automation

**Example use cases:**
- "Create a new issue in my-repo about bug XYZ"
- "Search for all open issues with label 'bug'"
- "Create a PR to merge feature-branch into main"
- "Find repositories using the MCP protocol"
- "Fork the popular-repo and create a new branch"

---

## Installation

### Step 1: Get GitHub Token

Create a Personal Access Token at https://github.com/settings/tokens

**Required Scopes:**
- `repo` - Full repository access
- `read:org` - Read org membership
- `read:user` - Read user profile
- `user:email` - Access user email

### Step 2: Configure MCP Client

Add to your Claude Desktop configuration:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

### Step 3: Restart Client

Restart Claude Desktop to load the server.

---

## Available Tools

### Repository Operations
- **create_repository**: Create new repositories (public or private)
- **fork_repository**: Fork existing repositories
- **get_file_contents**: Read files from repositories
- **push_files**: Commit and push changes

### Branch Management
- **create_branch**: Create new branches
- **list_commits**: View commit history

### Issue Management
- **create_issue**: Create new issues with labels and assignees
- **list_issues**: Search and filter issues
- **get_issue**: Get detailed issue information
- **update_issue**: Modify issue state, labels, assignees
- **add_issue_comment**: Comment on issues

### Pull Requests
- **create_pull_request**: Create PRs between branches
- **list_pull_requests**: List repository PRs
- **get_pull_request**: Get detailed PR information

### Search
- **search_repositories**: Find repositories
- **search_code**: Search code across GitHub
- **search_issues**: Advanced issue and PR search
- **search_users**: Find GitHub users

---

## Quick Start Examples

### Create an Issue
```
"Create a new issue in owner/repo titled 'Bug: Login fails' with description 'Users cannot log in on mobile' and label it as 'bug'"
```

### Search Code
```
"Search GitHub for repositories that use the MCP protocol"
```

### Create Pull Request
```
"Create a PR in my-repo from feature-branch to main with title 'Add new feature'"
```

### Fork and Branch
```
"Fork the repository awesome-project and create a branch called my-feature"
```

---

## Authentication

### Personal Access Token (Recommended)

Create at https://github.com/settings/tokens/new

**Minimum Scopes:**
- `repo` for repository access
- `read:org` for organization access

**Environment Variable:**
```json
"env": {
  "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx"
}
```

### GitHub App (Advanced)

For organization-wide deployments, use GitHub Apps:

```json
"env": {
  "GITHUB_APP_ID": "123456",
  "GITHUB_APP_PRIVATE_KEY_PATH": "/path/to/key.pem",
  "GITHUB_APP_INSTALLATION_ID": "789012"
}
```

---

## Rate Limiting

GitHub API has rate limits:
- **Authenticated**: 5,000 requests/hour
- **Search API**: 30 requests/minute

The server automatically respects these limits and will wait when necessary.

---

## Security Considerations

### Token Security
✅ Store tokens in environment variables
✅ Use tokens with minimum required scopes
✅ Rotate tokens regularly
✅ Never commit tokens to repositories

❌ Don't store tokens in config files
❌ Don't share tokens across users
❌ Don't use tokens with excessive permissions

### Scope Best Practices

**Read-Only Use:**
```
Scopes: repo (read-only), read:org, read:user
```

**Full Repository Management:**
```
Scopes: repo, workflow, admin:org
```

**Issue Management Only:**
```
Scopes: repo:status, repo_deployment, public_repo
```

---

## Common Workflows

### Issue Triage Workflow
1. List open issues with specific labels
2. Add comments to issues
3. Update issue status
4. Assign issues to team members

### PR Review Workflow
1. List open PRs
2. Get PR details and file changes
3. Add review comments
4. Update PR status

### Repository Setup
1. Create new repository
2. Push initial files
3. Create branches for development
4. Set up issue labels

See `/references/common-workflows.md` for detailed examples.

---

## Troubleshooting

### "Bad credentials"
**Solution:** Verify your token is correct and hasn't expired.

### "Not Found"
**Solution:** Check repository name and ensure token has access.

### "Rate limit exceeded"
**Solution:** Wait for rate limit to reset or use authenticated requests.

### "Insufficient permissions"
**Solution:** Add required scopes to your Personal Access Token.

---

## Advanced Configuration

### Organization Access

```json
{
  "mcpServers": {
    "github-org": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_token",
        "GITHUB_ORG": "my-organization"
      }
    }
  }
}
```

### Enterprise GitHub

```json
{
  "mcpServers": {
    "github-enterprise": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_token",
        "GITHUB_API_URL": "https://github.company.com/api/v3"
      }
    }
  }
}
```

---

## Links

- [GitHub Repository](https://github.com/modelcontextprotocol/servers/tree/main/src/github)
- [NPM Package](https://www.npmjs.com/package/@modelcontextprotocol/server-github)
- [GitHub API Docs](https://docs.github.com/en/rest)
- [Report Issues](https://github.com/modelcontextprotocol/servers/issues)
