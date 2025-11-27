---
title: Claude Code Cheat Sheet
topic: claude-code
type: cheatsheet
source: internal
last_verified: 2025-10-13
relevant_to: [all-projects]
url:
status: current
---

# Claude Code Cheat Sheet

## **Core Concepts**
- **Claude Code** = AI coding assistant with tool-based capabilities
- Uses tool system to read files, run commands, and interact with external systems
- Extensible through MCP servers and custom commands

## **Essential Commands & Shortcuts**

### **Context Management**
- `/init` - Analyze codebase, create Claude.md project summary
- `@filename` - Include specific files in request
- `#` - Memory mode: edit Claude.md files with natural language
- **Escape** - Stop Claude mid-response
- **Double Escape** - Rewind conversation to previous point
- `/compact` - Summarize conversation while preserving knowledge
- `/clear` - Fresh start, delete conversation history

### **Change Management**
- **Ctrl+V** (not Cmd+V) - Paste screenshots for UI context
- **Shift+Tab twice** - Plan Mode: detailed implementation planning
- **"Ultra think"** - Thinking Mode: extended reasoning for complex logic

### **Custom Automation**
- **Custom Commands**: Create `.Claude/commands/filename.md` → `/filename` command
- Use `$arguments` placeholder for runtime parameters
- **Hooks**: `.Claude/settings.local.json` - run scripts before/after tool execution

## **File Structure**
```
project/
├── Claude.md           # Project-level context (committed)
├── .Claude/
│   ├── commands/       # Custom commands
│   └── settings.local.json  # Local settings & hooks
└── .clod/             # Alternative settings location
```

## **Context Files (Claude.md)**
- **Project level** - Shared with team, version controlled
- **Local level** - Personal instructions, not committed  
- **Machine level** - Global instructions for all projects

## **MCP Server Integration**
```bash
# Add MCP server
claude mcp add [name] [start-command]

# Auto-approve permissions
# Add "MCP__[servername]" to settings.local.json allow array
```

## **Hook Configuration**
```json
{
  "hooks": {
    "pre-tool-use": [{
      "matcher": "read|grep",
      "command": "node ./hooks/read_hook.js"
    }],
    "post-tool-use": [{
      "matcher": "edit",
      "command": "tsc --no-emit"
    }]
  }
}
```

**Hook Exit Codes:**
- `0` = Allow tool execution
- `2` = Block tool execution (pre-hooks only)

## **GitHub Integration**
1. `/install GitHub app`
2. Add API key
3. Auto-generates PR review & mention support actions
4. Customize via `.github/workflows/` config files

## **Best Practices**

### **Context Optimization**
- Reference critical files (schemas, configs) in Claude.md
- Use `@` for targeted file inclusion vs. letting Claude search
- Keep context relevant - too much decreases performance

### **Useful Hook Examples**
- **Type Checker**: Run `tsc --no-emit` after TypeScript edits
- **Duplicate Prevention**: Monitor specific directories for code reuse
- **Security**: Block access to sensitive files (.env, secrets)

### **Performance Modes**
- **Planning Mode**: Multi-step tasks, wide codebase understanding
- **Thinking Mode**: Complex logic, debugging specific issues
- Can combine both (increases token usage/cost)

## **SDK Usage**
```typescript
// Default: read-only permissions
// Enable writes via options.allowTools: ["edit"]
```

## **Common Workflow**
1. `/init` to analyze project
2. Screenshot problem area → Ctrl+V
3. Describe desired change
4. Use Plan/Thinking modes for complex tasks
5. Review and accept implementation
6. Git integration handles commits

## **Quick Reference Card**

| Action | Command/Shortcut |
|--------|------------------|
| Initialize project | `/init` |
| Include file | `@filename` |
| Edit context | `#` |
| Stop Claude | **Escape** |
| Rewind conversation | **Double Escape** |
| Paste screenshot | **Ctrl+V** |
| Plan mode | **Shift+Tab** (2x) |
| Thinking mode | "Ultra think" |
| Custom command | `/commandname` |
| GitHub integration | `/install GitHub app` |
| Add MCP server | `claude mcp add [name] [cmd]` |

---
*Generated from Claude Code video course notes*