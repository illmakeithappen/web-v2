# Welcome to gitthub.org

gitthub.org is a platform for organizing how you work with AI agents. It provides a structured approach to creating, storing, and sharing the instructions that guide AI assistants through complex tasks.

The core problem gitthub solves: **AI agents are powerful but inconsistent**. Without organized instructions, you end up re-explaining the same tasks, getting variable results, and losing track of what worked. gitthub gives you a system to make AI collaboration repeatable and improvable.

---

## The Four Building Blocks

gitthub organizes AI instructions into four types. Each serves a different purpose in how you work with AI.

### Workflows

**Step-by-step guides for humans and AI to follow together.**

Workflows are sequences of instructions that walk you through a process. Unlike automation tools (Zapier, n8n, Make), workflows don't run automatically - they guide you through decisions, let you adapt to context, and keep the human in control.

There are three types:
- **Navigate** - Explore possibilities and compare approaches
- **Educate** - Learn how something works through hands-on execution
- **Deploy** - Get something built with clear, actionable steps

### Skills

**Reusable capabilities that AI can invoke when needed.**

Skills are concentrated instructions that give AI a specific ability. Once loaded, the AI can apply the skill whenever relevant - formatting code a certain way, analyzing data with a specific framework, or generating content in a particular style.

Skills are the secret weapon: small documents that produce consistent, repeatable behavior across sessions.

### MCP Servers

**Bridges connecting AI to external tools and data.**

Model Context Protocol (MCP) servers let AI access databases, files, APIs, and other services. They're the connective tissue between AI and the real world - enabling database queries, file operations, GitHub interactions, and more.

### Subagents

**Specialized AI agents for delegating specific tasks.**

Subagents are focused AI workers that handle particular domains. A research subagent finds information. A code review subagent checks your work. An orchestrator coordinates multiple subagents for complex tasks.

---

## When to Use What

The boundaries between these building blocks can blur. Here's how to choose:

| Feature | Workflows | Skills | MCP Servers | Subagents |
|---------|-----------|--------|-------------|-----------|
| **Primary use** | Guide multi-step processes | Add repeatable capabilities | Connect to external tools | Delegate specialized tasks |
| **Who executes** | Human + AI together | AI invokes when needed | AI calls via protocol | AI spawns for subtasks |
| **Best for** | Deployment, learning, exploration | Formatting, analysis, generation | Database, files, APIs | Research, coding, review |
| **Persistence** | Used once per process | Loaded into AI context | Always available when connected | Created and destroyed per task |

### Decision Guide

**Use Workflows when you:**
- Need guided steps through a complex process
- Want to learn or compare different approaches
- Are deploying something new and want structure

**Use Skills when you:**
- Want consistent, repeatable AI behavior
- Need domain-specific capabilities (formatting, analysis patterns)
- Want to encode expertise that persists across sessions

**Use MCP Servers when:**
- AI needs to read/write files or databases
- You're connecting to external APIs (GitHub, Slack, etc.)
- You need real-time data that AI can't access otherwise

**Use Subagents when:**
- Tasks are complex enough to benefit from decomposition
- You need parallel processing of independent subtasks
- Different parts require different expertise

---

## How They Work Together

Here's a concrete example: **Deploying a website with gitthub**

```
┌─────────────────────────────────────────────────────────┐
│  WORKFLOW: Deploy Website                                │
│  (Navigate-style: explore hosting options)               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Step 1: Define requirements                             │
│          └── SKILL: Requirements Gathering               │
│              (structured questions, output format)       │
│                                                          │
│  Step 2: Generate configs                                │
│          └── SKILL: Config Generator                     │
│              (Vercel/Netlify/Render templates)           │
│                                                          │
│  Step 3: Set up repository                               │
│          └── MCP: GitHub Server                          │
│              (create repo, push code, configure)         │
│                                                          │
│  Step 4: Review and deploy                               │
│          └── SUBAGENT: Code Review                       │
│              (check security, suggest improvements)      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

The workflow provides structure. Skills ensure consistent outputs. MCP connects to real services. Subagents handle specialized work.

---

## Using the Platform

### Browse

Navigate using the tabs at the top:
- **Workflows** - Step-by-step guides
- **Skills** - Reusable AI capabilities
- **MCP** - Server configurations
- **Subagents** - Specialized agent prompts

### Search

Press `Cmd+K` (or `Ctrl+K`) to open the command palette. Search across all content instantly.

### Edit

- **Double-click** any paragraph to edit inline
- Use the **edit button** for full document editing
- Changes save automatically

### Upload

Click the upload button to add your own content:
- **Single .md file** - One document
- **ZIP archive** - Document with references (guides, examples, prompts)

### Export

Download any document or collection as a ZIP file for local use or sharing.

---

## Getting Started

**New to gitthub?** Here's the fastest path:

1. **Browse the Hub** - Go to `/hub` and explore existing workflows
2. **Try a Deploy workflow** - Pick something relevant to your work
3. **Create your first skill** - Document something you explain to AI repeatedly
4. **Upload and iterate** - Refine based on what works

---

## FAQ

### What's the difference between Skills and MCP?

**Skills** are instructions that shape AI behavior (how it thinks, formats, analyzes). **MCP servers** are connections to external systems (what AI can access). A skill might tell AI how to format SQL queries; an MCP server actually runs them.

### Can I use gitthub without Claude?

gitthub content is plain markdown with structured frontmatter. While designed for Claude (especially Claude Code with skills), the workflows and instructions work with any AI assistant that can read markdown.

### How do I contribute my workflows?

Upload your content through the platform. Public templates are shared with all users. You can also export as ZIP and share directly.

### What if I need to customize a template?

All templates are editable. Copy to your account, modify as needed, and save your version. The original template remains unchanged.

---

**Ready to start?** Head to the [Hub](/hub) to explore workflows, or press `Cmd+K` to search for something specific.
