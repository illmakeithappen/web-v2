# Filesystem MCP Server - Security Best Practices

Essential security guidelines for safely using the Filesystem MCP server.

---

## Principle of Least Privilege

**Grant access only to directories you actively need.**

### ✅ Good Practice
```json
{
  "mcpServers": {
    "project": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/projects/myapp/src",
        "/Users/username/projects/myapp/docs"
      ]
    }
  }
}
```

### ❌ Bad Practice
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username"  // Too broad - grants access to everything
      ]
    }
  }
}
```

---

## Never Grant Access To

🚫 **System Directories**
- `/System` (macOS)
- `C:/Windows` (Windows)
- `/etc`, `/usr`, `/var` (Linux)

🚫 **Sensitive Personal Data**
- Browser profiles
- Password managers
- SSH keys (`~/.ssh`)
- API credentials

🚫 **Entire Home Directory**
- Use specific subdirectories instead
- Better: `/Users/username/Documents/work`
- Avoid: `/Users/username`

---

## Directory Access Patterns

### Pattern 1: Project-Specific

Best for working on a single project:
```json
{
  "mcpServers": {
    "myproject": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/projects/myproject"
      ]
    }
  }
}
```

### Pattern 2: Multiple Projects

For working across projects:
```json
{
  "mcpServers": {
    "projects": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/projects/project-a",
        "/Users/username/projects/project-b",
        "/Users/username/projects/project-c"
      ]
    }
  }
}
```

### Pattern 3: Separate Configs

Use different server instances for different security levels:
```json
{
  "mcpServers": {
    "work-projects": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/work"
      ]
    },
    "personal-docs": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/personal/safe-docs"
      ]
    }
  }
}
```

---

## Security Features

### Built-In Protections

The server automatically prevents:

✅ **Path Traversal**
```
# These attacks are blocked:
../../etc/passwd
../../../sensitive-file.txt
```

✅ **Symlink Exploitation**
```
# Symlinks outside allowed directories are blocked
```

✅ **Absolute Path Escapes**
```
# Attempts to access /other/directory are blocked
```

---

## Regular Security Audits

### Monthly Review Checklist

1. ✅ Review allowed directories list
2. ✅ Remove access to completed projects
3. ✅ Check for overly broad permissions
4. ✅ Verify no sensitive directories included
5. ✅ Update server to latest version

### Audit Command

List currently configured directories:
```bash
# In Claude Desktop, ask:
"List all allowed directories for the filesystem server"
```

---

## Handling Secrets

### ❌ Never Store Secrets in Accessible Files

```bash
# Bad: Storing API keys in accessible directory
/Users/username/projects/myapp/.env  # Contains API_KEY=secret123
```

### ✅ Use Environment Variables or Secret Managers

```bash
# Good: Reference secrets from secure storage
API_KEY=${SECURE_API_KEY}  # Loaded from system keychain
```

### .gitignore for Sensitive Files

Always exclude sensitive files:
```
.env
.env.local
secrets.json
config/credentials.json
*.key
*.pem
```

---

## Multi-User Scenarios

### Shared Computers

If multiple users share a computer:

1. Use **separate MCP configs** per user
2. Configure **user-specific directories only**
3. Never grant access to shared directories with others' data

```json
{
  "mcpServers": {
    "my-workspace": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/alice/Documents/work"  // Alice's private workspace
      ]
    }
  }
}
```

---

## Production vs Development

### Development Environment

More permissive for faster iteration:
```json
{
  "mcpServers": {
    "dev": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/projects/myapp"
      ]
    }
  }
}
```

### Production Environment

Minimize access:
```json
{
  "mcpServers": {
    "prod": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/var/app/logs",        // Only logs for debugging
        "/var/app/config"       // Only config for viewing
      ]
    }
  }
}
```

---

## Monitoring and Logging

### Enable Logging

Track all file operations:
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
        "DEBUG": "mcp:*",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

### Review Logs Regularly

Check Claude Desktop logs for:
- Unexpected file access patterns
- Failed permission attempts
- Unusual file modifications

---

## Incident Response

### If You Suspect Unauthorized Access

1. **Immediately remove the MCP server** from config
2. **Restart Claude Desktop**
3. **Review recent file changes**:
   ```bash
   find /path/to/directory -type f -mtime -1
   ```
4. **Check for sensitive data exposure**
5. **Rotate any exposed credentials**

---

## Best Practice Checklist

Before deploying a configuration:

- [ ] Granted minimum necessary access
- [ ] No system directories included
- [ ] No sensitive personal data accessible
- [ ] Specific project directories, not entire home
- [ ] Reviewed all paths for typos
- [ ] Tested with `list_allowed_directories`
- [ ] Documented why each directory is needed
- [ ] Set calendar reminder for monthly review

---

## Additional Resources

- [MCP Security Documentation](https://modelcontextprotocol.io/docs/security)
- [Claude Desktop Security Guide](https://anthropic.com/security)
- [File System Best Practices](https://owasp.org/www-community/vulnerabilities/)

---

## Questions?

If you're unsure about granting access to a directory, **err on the side of caution** and don't include it. You can always add it later if needed.
