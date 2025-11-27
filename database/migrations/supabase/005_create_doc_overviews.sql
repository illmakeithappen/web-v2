-- Migration 005: Create doc_overviews table
-- Stores overview documentation for each section (welcome, workflows, skills, mcp, subagents)

-- Create the doc_overviews table
CREATE TABLE IF NOT EXISTS doc_overviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) NOT NULL UNIQUE,  -- 'welcome', 'workflows', 'skills', 'mcp', 'subagents'
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,             -- Full markdown content
    description TEXT,                  -- Brief description for metadata
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_doc_overviews_slug ON doc_overviews(slug);

-- Enable RLS
ALTER TABLE doc_overviews ENABLE ROW LEVEL SECURITY;

-- Everyone can read doc_overviews (public documentation)
CREATE POLICY "Public read access for doc_overviews"
    ON doc_overviews FOR SELECT
    USING (true);

-- Only authenticated users can update (admin functionality)
CREATE POLICY "Authenticated users can update doc_overviews"
    ON doc_overviews FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Only authenticated users can insert
CREATE POLICY "Authenticated users can insert doc_overviews"
    ON doc_overviews FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Insert initial overview content
INSERT INTO doc_overviews (slug, title, description, content) VALUES
('welcome', 'Welcome to gitthub.org', 'Main overview of gitthub.org platform', '# Welcome to gitthub.org

gitthub.org is a platform for organizing how you work with AI agents. It provides a structured approach to creating, storing, and sharing the instructions that guide AI assistants through complex tasks.

The core problem gitthub solves: **AI agents are powerful but inconsistent**. Without organized instructions, you end up re-explaining the same tasks, getting variable results, and losing track of what worked. gitthub gives you a system to make AI collaboration repeatable and improvable.

---

## The Four Building Blocks

gitthub organizes AI instructions into four types. Each serves a different purpose in how you work with AI.

### Workflows

**Step-by-step guides for humans and AI to follow together.**

Workflows are sequences of instructions that walk you through a process. Unlike automation tools (Zapier, n8n, Make), workflows don''t run automatically - they guide you through decisions, let you adapt to context, and keep the human in control.

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

Model Context Protocol (MCP) servers let AI access databases, files, APIs, and other services. They''re the connective tissue between AI and the real world - enabling database queries, file operations, GitHub interactions, and more.

### Subagents

**Specialized AI agents for delegating specific tasks.**

Subagents are focused AI workers that handle particular domains. A research subagent finds information. A code review subagent checks your work. An orchestrator coordinates multiple subagents for complex tasks.

---

## When to Use What

The boundaries between these building blocks can blur. Here''s how to choose:

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
- You''re connecting to external APIs (GitHub, Slack, etc.)
- You need real-time data that AI can''t access otherwise

**Use Subagents when:**
- Tasks are complex enough to benefit from decomposition
- You need parallel processing of independent subtasks
- Different parts require different expertise

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

**New to gitthub?** Here''s the fastest path:

1. **Browse the Hub** - Go to `/hub` and explore existing workflows
2. **Try a Deploy workflow** - Pick something relevant to your work
3. **Create your first skill** - Document something you explain to AI repeatedly
4. **Upload and iterate** - Refine based on what works

---

## FAQ

### What''s the difference between Skills and MCP?

**Skills** are instructions that shape AI behavior (how it thinks, formats, analyzes). **MCP servers** are connections to external systems (what AI can access). A skill might tell AI how to format SQL queries; an MCP server actually runs them.

### Can I use gitthub without Claude?

gitthub content is plain markdown with structured frontmatter. While designed for Claude (especially Claude Code with skills), the workflows and instructions work with any AI assistant that can read markdown.

### How do I contribute my workflows?

Upload your content through the platform. Public templates are shared with all users. You can also export as ZIP and share directly.

### What if I need to customize a template?

All templates are editable. Copy to your account, modify as needed, and save your version. The original template remains unchanged.

---

**Ready to start?** Head to the [Hub](/hub) to explore workflows, or press `Cmd+K` to search for something specific.')
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    content = EXCLUDED.content,
    updated_at = NOW();

-- Add workflows overview
INSERT INTO doc_overviews (slug, title, description, content) VALUES
('workflows', 'Workflows', 'Step-by-step guides for humans and AI', '# Workflows

**Workflows are step-by-step guides for humans and AI to execute together.**

Unlike automation platforms (Zapier, Make, n8n), gitthub workflows don''t run automatically. They''re designed for collaboration - guiding you through decisions, adapting to your context, and keeping you in control while leveraging AI capabilities.

## Why Workflows?

The challenge with AI isn''t capability - it''s consistency. Without structure, you explain the same processes repeatedly, get variable results, and lose track of what worked. Workflows solve this by:

- **Capturing expertise** - Document successful processes once, reuse forever
- **Enabling iteration** - Improve workflows based on outcomes
- **Bridging tools** - Coordinate across different AI tools and services
- **Teaching through doing** - Learn while executing

## The Three Archetypes

Every workflow on gitthub falls into one of three categories.

---

### Navigate

**Purpose**: Explore possibilities and compare approaches before committing.

Navigate workflows guide you through decision-making. Rather than jumping straight to implementation, they help you understand your options, evaluate trade-offs, and choose the best path forward.

**When to use Navigate:**
- You''re unsure which technology, tool, or approach to use
- The decision has significant consequences
- You want to understand the landscape before building

---

### Educate

**Purpose**: Learn how something works through hands-on execution.

Educate workflows teach you by doing. They break down complex topics into steps you can execute, explaining the "why" along the way.

**When to use Educate:**
- You want to understand a tool, concept, or technique
- You learn better by doing than reading
- You need to train team members on a process

---

### Deploy

**Purpose**: Build and ship something specific with clear, actionable steps.

Deploy workflows are your "how to" guides. They''re optimized for execution - minimal explanation, maximum action.

**When to use Deploy:**
- You know what you want to build
- You need a reliable, repeatable process
- Time matters more than deep understanding

---

## Resources in This Section

Browse the workflow entries below to find:
- **Navigate workflows** - Decision guides for tools and approaches
- **Educate workflows** - Learning paths and tutorials
- **Deploy workflows** - Step-by-step build guides

Use **Cmd+K** to search for specific topics.')
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    content = EXCLUDED.content,
    updated_at = NOW();

-- Add skills overview
INSERT INTO doc_overviews (slug, title, description, content) VALUES
('skills', 'Skills', 'Reusable AI capabilities', '# Skills

**Skills are reusable capabilities that give AI consistent, repeatable behavior.**

A skill is a focused set of instructions that teaches AI how to do something specific. Once loaded, the AI can apply the skill whenever relevant.

## What are Skills?

Skills are:
- **Concentrated instructions** - A single document encoding expertise
- **Context-aware** - AI applies them when the situation matches
- **Composable** - Multiple skills can work together
- **Portable** - Same skill works across sessions and tools

## Why Use Skills?

### Benefits
- **Consistency** - Get the same quality output every time
- **Efficiency** - Stop re-explaining the same requirements
- **Expertise capture** - Turn tribal knowledge into reusable assets
- **Team alignment** - Everyone uses the same standards

### Common Use Cases
- **Code formatting** - Enforce style guides automatically
- **Documentation** - Generate consistent README structures
- **Analysis** - Apply frameworks systematically
- **Content creation** - Maintain brand voice across outputs

## Types of Skills

### Formatting Skills
Transform content into specific formats.

### Analysis Skills
Apply frameworks to evaluate information.

### Generation Skills
Create content following specific patterns.

### Process Skills
Guide multi-step operations.

---

## Resources in This Section

Browse the skill entries below to find:
- **Guides** - How to build effective skills
- **Examples** - Real-world skill implementations
- **Standards** - Best practices and patterns
- **Templates** - Starting points for common skill types

Use **Cmd+K** to search for specific topics.')
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    content = EXCLUDED.content,
    updated_at = NOW();

-- Add MCP overview
INSERT INTO doc_overviews (slug, title, description, content) VALUES
('mcp', 'Model Context Protocol (MCP) Servers', 'Bridges connecting AI to external tools and data', '# Model Context Protocol (MCP) Servers

**Model Context Protocol (MCP)** is an open protocol that standardizes how applications provide context to Large Language Models (LLMs). MCP servers act as bridges between your AI applications and various data sources, tools, and services.

## What is MCP?

MCP enables:
- **Standardized context sharing** - Consistent way to provide data to LLMs
- **Tool integration** - Connect AI models to external services and APIs
- **Resource management** - Organize and access data sources efficiently
- **Prompt templating** - Reusable prompt patterns and workflows

## Why Use MCP Servers?

### Benefits
- **Modularity** - Build once, use across multiple AI applications
- **Interoperability** - Works with any MCP-compatible LLM client
- **Security** - Controlled access to data and services
- **Scalability** - Easy to add new data sources and capabilities

### Common Use Cases
- **Database integration** - Query databases directly from AI conversations
- **File system access** - Read and write files through AI agents
- **API connections** - Connect to external services (GitHub, Slack, etc.)
- **Custom tools** - Build specialized capabilities for your domain

## Getting Started

### Prerequisites
- Basic understanding of JSON-RPC protocol
- Familiarity with your target LLM client
- Programming knowledge (Python, TypeScript, or other supported languages)

### Quick Start
1. Choose a server implementation framework
2. Define your resources (data sources)
3. Implement tools (actions the AI can perform)
4. Configure prompts (reusable templates)
5. Deploy and connect to your AI client

## MCP Architecture

```
┌─────────────────┐
│   AI Client     │  (Claude Desktop, IDEs, etc.)
│  (MCP Client)   │
└────────┬────────┘
         │
         │ MCP Protocol (JSON-RPC)
         │
┌────────┴────────┐
│   MCP Server    │
├─────────────────┤
│  • Resources    │  (Data sources)
│  • Tools        │  (Actions)
│  • Prompts      │  (Templates)
└────────┬────────┘
         │
         │ Server Implementation
         │
┌────────┴────────┐
│   Data Sources  │  (Databases, APIs, Files, etc.)
└─────────────────┘
```

## Resources in This Section

Browse the MCP entries below to find:
- **Guides** - Step-by-step tutorials for building MCP servers
- **Examples** - Real-world MCP implementations you can learn from
- **Standards** - Best practices and protocol specifications
- **Patterns** - Common design patterns and architectures
- **Prompts** - Reusable prompt templates for MCP interactions

## Learn More

- [Official MCP Specification](https://spec.modelcontextprotocol.io/)
- [MCP GitHub Repository](https://github.com/modelcontextprotocol)
- [Community Examples](https://github.com/modelcontextprotocol/servers)

---

**Ready to build your first MCP server?** Select an entry from the navigation to get started, or use **Cmd+K** to search for specific topics.')
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    content = EXCLUDED.content,
    updated_at = NOW();

-- Add Subagents overview
INSERT INTO doc_overviews (slug, title, description, content) VALUES
('subagents', 'Subagents', 'Specialized AI agents for delegating specific tasks', '# Subagents

**Subagents** are specialized AI agents designed to handle specific tasks or domains within a larger AI system. They enable modular, scalable architectures by breaking down complex workflows into focused, manageable components.

## What are Subagents?

Subagents are:
- **Specialized AI agents** - Each focused on a specific domain or task
- **Composable** - Can be combined to create complex behaviors
- **Autonomous** - Operate independently within their scope
- **Contextual** - Maintain their own context and state

## Why Use Subagents?

### Benefits
- **Separation of concerns** - Each agent handles one responsibility
- **Reusability** - Use the same subagent across different workflows
- **Scalability** - Add new capabilities without modifying existing agents
- **Testability** - Easier to test and debug individual components
- **Performance** - Optimize each agent independently

### Common Use Cases
- **Task decomposition** - Break complex tasks into smaller pieces
- **Domain expertise** - Specialized agents for different knowledge areas
- **Pipeline processing** - Chain agents for multi-step workflows
- **Parallel execution** - Run multiple agents concurrently
- **Hierarchical systems** - Orchestrator agents coordinating subagents

## Subagent Architecture

```
┌─────────────────────────────────────┐
│      Orchestrator Agent             │
│   (Coordinates subagents)           │
└──────────┬──────────────────────────┘
           │
     ┌─────┴─────┬─────────┬─────────┐
     │           │         │         │
┌────▼────┐ ┌───▼───┐ ┌───▼───┐ ┌───▼────┐
│Research │ │Analysis│ │Writing│ │Review  │
│Subagent │ │Subagent│ │Subagent│ │Subagent│
└─────────┘ └────────┘ └────────┘ └────────┘
```

## Design Patterns

### 1. Hierarchical Pattern
- **Orchestrator** coordinates multiple specialized subagents
- **Best for**: Complex multi-step workflows

### 2. Pipeline Pattern
- Subagents process data sequentially
- **Best for**: Data transformation and processing

### 3. Parallel Pattern
- Multiple subagents work simultaneously
- **Best for**: Independent tasks that can run concurrently

### 4. Specialist Pattern
- Each subagent handles a specific domain
- **Best for**: Systems requiring deep expertise in multiple areas

## Building Effective Subagents

### Key Principles
1. **Single Responsibility** - Each subagent should do one thing well
2. **Clear Interfaces** - Define inputs, outputs, and communication protocols
3. **State Management** - Decide how subagents share context
4. **Error Handling** - Handle failures gracefully
5. **Monitoring** - Track performance and behavior

### Communication Methods
- **Direct invocation** - Orchestrator calls subagents directly
- **Message passing** - Agents communicate via messages
- **Shared context** - Agents access a common context store
- **Event-driven** - Agents respond to events

## Resources in This Section

Browse the subagent entries below to find:
- **Guides** - How to design and implement subagent architectures
- **Examples** - Real-world subagent implementations
- **Standards** - Best practices for subagent design
- **Patterns** - Common architectural patterns
- **Prompts** - System prompts for creating specialized subagents

## Popular Frameworks

- **LangGraph** - Build stateful, multi-actor applications
- **CrewAI** - Role-based multi-agent systems
- **AutoGen** - Multi-agent conversation framework
- **Claude Agents SDK** - Build agents with Claude

## Learn More

- [Multi-Agent Systems Theory](https://en.wikipedia.org/wiki/Multi-agent_system)
- [Agentic Workflows](https://www.anthropic.com/research/building-effective-agents)
- [Agent Design Patterns](https://python.langchain.com/docs/use_cases/agent)

---

**Ready to build your first subagent system?** Select an entry from the navigation to get started, or use **Cmd+K** to search for specific topics.')
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    content = EXCLUDED.content,
    updated_at = NOW();

-- Verify the table was created
SELECT slug, title, LENGTH(content) as content_length FROM doc_overviews;
