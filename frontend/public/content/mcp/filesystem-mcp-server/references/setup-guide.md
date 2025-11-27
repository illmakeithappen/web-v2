# Filesystem MCP Server - Setup Guide

Complete guide to installing and configuring the Filesystem MCP server.

---

## Prerequisites

Before installing, ensure you have:
- Node.js 18 or higher installed
- File system permissions for directories you want to access
- A compatible MCP client (Claude Desktop, Claude Code, Zed, Continue)

---

## Installation Methods

### Method 1: Direct NPX Usage (Quick Start)

The fastest way to test the server:

```bash
npx @modelcontextprotocol/server-filesystem /path/to/directory
```

**Pros:**
- No installation required
- Perfect for testing
- Always uses latest version

**Cons:**
- Slightly slower startup
- Downloaded on each use

---

### Method 2: Claude Desktop Configuration (Recommended)

Add to your Claude Desktop configuration file.

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

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

---

### Method 3: Global Installation

Install once, use everywhere:

```bash
npm install -g @modelcontextprotocol/server-filesystem
```

Then configure:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "server-filesystem",
      "args": [
        "/Users/username/Documents"
      ]
    }
  }
}
```

---

## Configuration Examples

### Single Directory

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/Documents"
      ]
    }
  }
}
```

### Multiple Directories

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

### Project-Specific Access

```json
{
  "mcpServers": {
    "myproject": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/projects/myproject/src",
        "/Users/username/projects/myproject/docs"
      ]
    }
  }
}
```

### Using Environment Variables

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "${HOME}/Documents",
        "${HOME}/Projects"
      ],
      "env": {
        "HOME": "/Users/username"
      }
    }
  }
}
```

---

## Verification

After configuration, verify the server is working:

1. Restart Claude Desktop
2. Open a new conversation
3. Type: "List the allowed directories"
4. Claude should show your configured directories

---

## Platform-Specific Notes

### macOS

**Full Disk Access:**
If you encounter permission errors:
1. Open System Preferences → Security & Privacy
2. Click Privacy tab
3. Select "Full Disk Access"
4. Add Claude Desktop to the list

**Home Directory Shortcut:**
```json
"args": ["${HOME}/Documents"]
```

### Windows

**Path Format:**
Use forward slashes or escaped backslashes:
```json
// Option 1: Forward slashes (recommended)
"args": ["C:/Users/username/Documents"]

// Option 2: Escaped backslashes
"args": ["C:\\Users\\username\\Documents"]
```

**Environment Variables:**
```json
"args": ["${USERPROFILE}/Documents"]
```

### Linux

**Permissions:**
Ensure your user has read/write access:
```bash
chmod -R u+rw /path/to/directory
```

**Home Directory:**
```json
"args": ["${HOME}/documents"]
```

---

## Troubleshooting

### "Command not found"

**Solution:** Ensure Node.js is in your PATH:
```bash
node --version  # Should show v18 or higher
npx --version   # Should show version number
```

### "Permission denied"

**Solution:** Check directory permissions:
```bash
ls -la /path/to/directory
```

Ensure you own the directory or have read/write access.

### "Server won't start"

**Checklist:**
1. ✅ Node.js 18+ installed
2. ✅ Paths are absolute (start with `/` or `C:/`)
3. ✅ Directories exist
4. ✅ Correct JSON syntax in config
5. ✅ Claude Desktop restarted

### "Files not visible"

**Check:**
1. Directory is in allowed list
2. No typos in path
3. Use `list_allowed_directories` tool to verify

---

## Advanced Configuration

### Read-Only Access

Coming soon: limit to read operations only.

### Custom Port

Default MCP communication doesn't require port configuration.

### Logging

Enable debug logging:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/Documents"
      ],
      "env": {
        "DEBUG": "mcp:*"
      }
    }
  }
}
```

---

## Next Steps

Once set up:
1. Try basic file operations: "Read the contents of README.md"
2. Test search: "Find all JavaScript files in my projects"
3. Experiment with edits: "Add a TODO comment to main.js"
4. Review [security best practices](./security-best-practices.md)

---

## Getting Help

- **Documentation**: https://modelcontextprotocol.io/
- **GitHub Issues**: https://github.com/modelcontextprotocol/servers/issues
- **Community**: Join the MCP Discord server
