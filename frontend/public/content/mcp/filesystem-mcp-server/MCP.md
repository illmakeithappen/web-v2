---
# Basic Identity
name: Filesystem MCP Server
mcp_id: filesystem-mcp-server
description: |
  Secure file system operations server providing controlled access to directory trees.
  Enables AI assistants to read, write, search, and manage files with configurable permissions.
  Part of the official MCP reference server collection.

# Classification
server_type: reference
category: file-system
difficulty: beginner
language: typescript

# Marketplace Metadata
organization: Anthropic
repository: https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem
npm_package: "@modelcontextprotocol/server-filesystem"
license: MIT

# Metadata
author: MCP Team
created_date: 2024-11-01
last_modified: 2025-01-15
version: "0.5.0"
status: active

# Usage Information
estimated_setup_time: 5-10 minutes
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
  - filesystem
  - file-operations
  - reference-server
  - official
  - read-write
  - search
keywords:
  - file management
  - directory access
  - file search
  - secure operations

# Requirements
prerequisites:
  - Node.js 18+ or compatible runtime
  - File system permissions for target directories
  - Basic understanding of MCP protocol

tools_provided:
  - read_file: Read complete contents of a file
  - read_multiple_files: Read multiple files simultaneously
  - write_file: Create or overwrite files
  - edit_file: Make selective edits using advanced pattern matching
  - create_directory: Create new directories
  - list_directory: List directory contents with file metadata
  - move_file: Move or rename files and directories
  - search_files: Search for files using glob patterns
  - get_file_info: Get detailed file metadata
  - list_allowed_directories: List configured accessible directories

resources_provided:
  - file://{path}: Access individual files
  - directory://{path}: Access directory listings

# Configuration
mcp_config_example: |
  {
    "mcpServers": {
      "filesystem": {
        "command": "npx",
        "args": [
          "-y",
          "@modelcontextprotocol/server-filesystem",
          "/Users/username/Documents",
          "/Users/username/Projects"
        ]
      }
    }
  }

# Security
security_features:
  - Restricted to explicitly allowed directories
  - No access outside configured paths
  - Automatic path traversal prevention
  - Read-only mode available

# References
references:
  - references/setup-guide.md
  - references/configuration-examples.md
  - references/security-best-practices.md
  - references/tool-reference.md
  - references/prompts/file-operations.md

# Analytics
usage_count: 0
downloads: 50000+
---

# Filesystem MCP Server

Secure, controlled file system access for AI assistants through the Model Context Protocol.

---

## Overview

The Filesystem MCP Server is an official reference implementation that provides AI assistants with secure access to your local file system. It enables reading, writing, searching, and managing files within explicitly allowed directories.

**Key Features:**
- 🔒 **Security-first**: Only accesses explicitly allowed directories
- 📁 **Comprehensive operations**: Read, write, edit, search, move, and manage files
- 🔍 **Advanced search**: Glob pattern matching for finding files
- ⚡ **High performance**: Efficient operations with minimal overhead
- 🛡️ **Safe defaults**: Read-only mode and automatic path traversal prevention

---

## When to Use

Use this MCP server when you need:
- AI assistance with file management tasks
- Automated file reading and writing
- Code editing and refactoring across multiple files
- Project organization and cleanup
- File search and discovery

**Example use cases:**
- "Read all markdown files in my docs folder"
- "Create a new configuration file with these settings"
- "Search for all TODO comments in my codebase"
- "Rename all .js files to .ts in this directory"

---

## Installation

### Via NPM (Recommended)

```bash
npx @modelcontextprotocol/server-filesystem [allowed_directory_paths...]
```

### Via Claude Desktop Config

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/Documents",
        "/Users/username/Projects"
      ]
    }
  }
}
```

### Multiple Directory Access

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/work",
        "/Users/username/personal",
        "/Users/username/code"
      ]
    }
  }
}
```

---

## Available Tools

### File Reading
- **read_file**: Read complete file contents
- **read_multiple_files**: Batch read multiple files efficiently

### File Writing
- **write_file**: Create or overwrite files
- **edit_file**: Make targeted edits using pattern matching

### File Management
- **create_directory**: Create directories (including nested)
- **move_file**: Move or rename files and directories
- **get_file_info**: Get detailed metadata (size, modified date, permissions)

### File Discovery
- **list_directory**: List directory contents with metadata
- **search_files**: Find files using glob patterns
- **list_allowed_directories**: See configured accessible paths

---

## Security Considerations

### What's Allowed
✅ Reading files in configured directories
✅ Writing files in configured directories
✅ Creating subdirectories within allowed paths
✅ Moving files within allowed directories
✅ Searching within allowed directories

### What's Blocked
❌ Accessing files outside configured directories
❌ Following symlinks outside allowed paths
❌ Path traversal attacks (../)
❌ System file access without explicit permission

### Best Practices
1. Only grant access to necessary directories
2. Use separate configurations for different projects
3. Regularly review allowed directory list
4. Consider read-only mode for sensitive directories
5. Monitor file operations in Claude Desktop logs

---

## Common Patterns

### Project Setup
```json
{
  "mcpServers": {
    "project": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "${PROJECT_ROOT}/src",
        "${PROJECT_ROOT}/docs",
        "${PROJECT_ROOT}/tests"
      ]
    }
  }
}
```

### Read-Only Mode
For viewing files without modification risk:
```bash
# Coming soon: read-only flag support
npx @modelcontextprotocol/server-filesystem --read-only /Users/username/reference
```

---

## Troubleshooting

### Server Won't Start
- Verify Node.js 18+ is installed
- Check directory paths are absolute (not relative)
- Ensure directories exist before adding to config

### Permission Denied
- Verify you have read/write permissions for directories
- Check directory paths are correctly specified
- On macOS: Grant Full Disk Access to your MCP client

### Files Not Found
- Use `list_allowed_directories` tool to verify configuration
- Check paths are absolute and exist
- Verify no typos in directory paths

---

## Advanced Usage

See the reference guides in the `/references` directory for:
- Detailed tool documentation
- Configuration patterns
- Security hardening
- Performance optimization
- Integration examples

---

## Links

- [GitHub Repository](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem)
- [NPM Package](https://www.npmjs.com/package/@modelcontextprotocol/server-filesystem)
- [MCP Documentation](https://modelcontextprotocol.io/)
- [Report Issues](https://github.com/modelcontextprotocol/servers/issues)
