# Subagent Frontmatter Structure

This document defines the comprehensive frontmatter structure for all subagents in the gitthub.org platform. Subagents are educational resources teaching users how to design and configure multi-agent AI systems, particularly for Claude Code.

---

## Overview

**Purpose:** Document agent configuration patterns, system prompts, and multi-agent architectures to help users build sophisticated AI systems.

**Key Difference from Skills:** While skills teach procedures/workflows, subagents teach how to design specialized agents that work together in multi-agent systems.

**Focus:** Claude Code agent patterns and configurations (not framework-specific code like LangGraph or CrewAI).

---

## Frontmatter Sections

### 1. Basic Identity (Required)

**Fields:**
```yaml
name: subagent-name-here
subagent_id: subagent-name-here
description: |
  Multi-line description (2-3 sentences).
  Explains what the agent does and when to use it in a multi-agent system.
```

**Purpose:** Uniquely identifies the agent and provides human-readable summary.

**Guidelines:**
- `name`: Kebab-case identifier (e.g., `research-specialist`, `pipeline-coordinator`)
- `subagent_id`: Usually matches `name`, used for programmatic references
- `description`: Comprehensive 2-3 sentence explanation with use cases and multi-agent context

---

### 2. Classification (Required)

**Fields:**
```yaml
agent_type: specialist
category: research
difficulty: intermediate
language: general
```

**Purpose:** Enables filtering, categorization, and agent discovery.

**Valid Values:**

**agent_type:** (Agent pattern/role)
- `specialist` - Single domain expertise (research, analysis, content generation)
- `orchestrator` - Coordinates other agents (task delegation, coordination)
- `pipeline` - Sequential processing (workflow stages, handoffs)
- `hierarchical` - Supervisor-worker pattern (task decomposition, aggregation)

**category:** (Domain/function)
- `research` - Information gathering, web search, content discovery
- `analysis` - Data analysis, pattern recognition, evaluation
- `automation` - Task automation, workflow execution
- `generation` - Content creation, code generation, artifact production
- `coordination` - Multi-agent coordination, orchestration, routing

**difficulty:**
- `beginner` - Simple single-agent patterns, minimal prerequisites
- `intermediate` - Multi-agent coordination, state management
- `advanced` - Complex orchestration, advanced communication patterns

**language:** (Primary implementation context)
- `general` - Language-agnostic patterns and concepts
- `python` - Python-specific examples/configuration
- `typescript` - TypeScript-specific examples/configuration
- `markdown` - Documentation-focused, Claude Code markdowns

---

### 3. Metadata (Required)

**Fields:**
```yaml
author: Claude
created_date: 2025-01-27
last_modified: 2025-01-27
version: "1.0"
status: active
```

**Purpose:** Attribution, version tracking, lifecycle management.

**Guidelines:**
- `author`: Creator name or organization
- `created_date`: YYYY-MM-DD format
- `last_modified`: Update when agent configuration changes
- `version`: Semantic versioning ("major.minor" or "major.minor.patch")
- `status`: `draft` | `active` | `experimental` | `deprecated`

---

### 4. Usage Information (Required)

**Fields:**
```yaml
estimated_setup_time: 10-20 minutes
supported_platforms:
  - Claude Code
  - Claude Desktop
  - Claude.ai
  - API
model: claude-sonnet-4-5
```

**Purpose:** Helps users understand time commitment and compatibility.

**Guidelines:**
- `estimated_setup_time`: Time to understand and configure the agent
- `supported_platforms`: Where this agent pattern can be implemented
  - `Claude Code` - VS Code extension with agent support
  - `Claude Desktop` - Desktop app
  - `Claude.ai` - Web interface
  - `API` - Direct API integration
- `model`: Recommended or tested model(s)
  - Common: `claude-sonnet-4-5`, `claude-opus-4`, `claude-3-5-sonnet-20241022`

---

### 5. Architecture (Subagent-Specific - Required)

**Fields:**
```yaml
primary_use_case: Domain expertise
communication_pattern: direct-invocation
single_responsibility: |
  This agent is responsible for [specific task].
  It should not handle [out of scope tasks].
```

**Purpose:** Documents the agent's architectural role and boundaries.

**Valid Values:**

**primary_use_case:**
- `Task decomposition` - Breaking complex tasks into smaller units
- `Domain expertise` - Specialized knowledge in a specific domain
- `Pipeline processing` - Sequential workflow stages
- `Coordination` - Managing other agents and workflows
- `Quality assurance` - Review, validation, testing
- `State management` - Maintaining and tracking state

**communication_pattern:**
- `direct-invocation` - Agent called directly with input, returns output
- `message-passing` - Agents communicate via message queues/channels
- `shared-context` - Agents read/write to shared context/state
- `event-driven` - Agents respond to events/triggers

**single_responsibility:**
- Clear statement of what the agent does
- Explicit boundaries of what's in/out of scope
- Helps maintain agent cohesion

---

### 6. Organization (Required)

**Fields:**
```yaml
tags:
  - multi-agent
  - specialized
  - research
  - claude-code

keywords:
  - agent configuration
  - system prompt
  - multi-agent system
  - specialization
  - claude code agents
```

**Purpose:** Enables search, filtering, and related agent discovery.

**Guidelines:**
- `tags`: 3-8 tags for filtering (lowercase kebab-case)
  - Always include `multi-agent` for subagents
  - Include agent pattern: `specialist`, `orchestrator`, `pipeline`, `hierarchical`
  - Include domain: `research`, `analysis`, `generation`, etc.
- `keywords`: 5-10 marketplace search terms
  - More specific than tags
  - Focus on user search intent
  - Include technical terms: "agent configuration", "system prompt", "Claude Code"

**Common Tags:**
- Pattern: `specialist`, `orchestrator`, `pipeline`, `hierarchical`
- Domain: `research`, `analysis`, `automation`, `generation`, `coordination`
- Platform: `claude-code`, `multi-agent`, `agent-system`
- Complexity: `beginner-friendly`, `advanced-pattern`, `production-ready`

---

### 7. Requirements (Optional but Recommended)

**Fields:**
```yaml
prerequisites:
  - Understanding of multi-agent systems
  - Familiarity with Claude Code
  - Knowledge of agent patterns

tools_required:
  - Claude Code
  - Claude API key
  - Optional: Framework/tool name
```

**Purpose:** Communicates what users need before implementing this agent.

**Guidelines:**
- `prerequisites`: Knowledge, understanding, or experience required
  - Focus on conceptual prerequisites
  - "Understanding of X", "Familiarity with Y"
- `tools_required`: Specific tools, platforms, or APIs needed
  - Claude Code, Claude Desktop, Claude API
  - API keys or credentials
  - External frameworks (if applicable)

---

### 8. References (Optional)

**Fields:**
```yaml
references:
  - references/system-prompt.md
  - references/architecture.md
  - references/communication-pattern.md
  - references/example-scenario.md
```

**Purpose:** Links to supporting documentation and detailed resources.

**Guidelines:**
- Relative paths for internal files
- Standard reference files for agents:
  - `system-prompt.md` - Complete agent system prompt
  - `architecture.md` - Design decisions, flow diagrams
  - `communication-pattern.md` - How agent communicates
  - `example-scenario.md` - Step-by-step walkthrough
- Order by importance/relevance

---

### 9. Integration (Optional but Recommended)

**Fields:**
```yaml
organization: gitthub
repository: https://github.com/gitthub-org/subagents/tree/main/agent-name
license: MIT
compatibility:
  - "Claude Code"
  - "Claude.ai"
  - "Claude API"
installation_method: documentation
```

**Purpose:** Provides attribution, licensing, and distribution information.

**Guidelines:**
- `organization`: Publisher/org name (e.g., `gitthub`, `anthropic`)
- `repository`: Link to source documentation on GitHub
- `license`: Open source license (MIT, Apache-2.0, GPL-3.0, BSD-3-Clause)
- `compatibility`: Platforms where pattern is applicable
- `installation_method`:
  - `documentation` - Educational template/pattern
  - `template` - Copy-paste configuration
  - `framework-specific` - Requires specific framework

---

### 10. Analytics (Optional)

**Fields:**
```yaml
usage_count: 0
```

**Purpose:** Track agent reference count for analytics.

**Guidelines:**
- Initialize to `0` for new agents
- Can be incremented programmatically when agent is referenced
- Used for "most popular" features

---

## Complete Example

```yaml
---
# Basic Identity
name: research-specialist
subagent_id: research-specialist
description: |
  Specialized agent for content research and information gathering in multi-agent systems.
  Focuses on web search, source evaluation, and structured research synthesis.
  Designed to work standalone or as part of larger agent workflows.

# Classification
agent_type: specialist
category: research
difficulty: beginner
language: general

# Metadata
author: gitthub
created_date: 2025-01-27
last_modified: 2025-01-27
version: "1.0"
status: active

# Usage Information
estimated_setup_time: 15-20 minutes
supported_platforms:
  - Claude Code
  - Claude Desktop
  - Claude.ai
  - API
model: claude-sonnet-4-5

# Architecture
primary_use_case: Domain expertise
communication_pattern: direct-invocation
single_responsibility: |
  This agent is responsible for conducting research, gathering information,
  and synthesizing findings into structured outputs. It should not handle
  content generation, editing, or final presentation tasks.

# Organization
tags:
  - multi-agent
  - specialist
  - research
  - information-gathering
  - claude-code

keywords:
  - research agent
  - information gathering
  - web search
  - source evaluation
  - claude code agent
  - multi-agent system

# Requirements
prerequisites:
  - Understanding of multi-agent design patterns
  - Familiarity with Claude Code agent configuration
  - Basic knowledge of research methodologies

tools_required:
  - Claude Code
  - Claude API key
  - Web search capabilities

# References
references:
  - references/system-prompt.md
  - references/architecture.md
  - references/communication-pattern.md
  - references/example-scenario.md

# Integration
organization: gitthub
repository: https://github.com/gitthub-org/subagents/tree/main/research-specialist
license: MIT
compatibility:
  - "Claude Code"
  - "Claude.ai"
  - "Claude API"
installation_method: documentation

# Analytics
usage_count: 0
---
```

---

## Comparison with Skills and MCP Servers

Subagents share structural similarities with Skills and MCP servers:

| Section | Subagents | Skills | MCP Servers | Notes |
|---------|-----------|--------|-------------|-------|
| **Basic Identity** | ✅ name, subagent_id, description | ✅ name, skill_id, description | ✅ name, mcp_id, description | Similar structure |
| **Classification** | ✅ agent_type, category, difficulty | ✅ skill_type, category, difficulty | ✅ server_type, category, difficulty | Different type fields |
| **Metadata** | ✅ author, dates, version, status | ✅ author, dates, version, status | ✅ author, dates, version, status | Identical |
| **Usage** | ✅ setup_time, platforms, model | ✅ estimated_time, agent, model | ✅ setup_time, compatible_clients, platforms | Similar |
| **Architecture** | ✅ use_case, pattern, responsibility | ❌ N/A | ✅ tools_provided, resources_provided | Subagent-specific |
| **Organization** | ✅ tags, keywords | ✅ tags, keywords | ✅ tags, keywords | Identical |
| **Requirements** | ✅ prerequisites, tools_required | ✅ prerequisites, tools_required | ✅ prerequisites, tools_provided | Similar |
| **References** | ✅ references | ✅ references | ✅ references | Identical |
| **Integration** | ✅ organization, repository, license | ✅ organization, repository, license | ✅ organization, npm_package, license | Similar |
| **Analytics** | ✅ usage_count | ✅ usage_count | ✅ usage_count, downloads | Similar |

**Key Differences:**
- Subagents use `subagent_id` and `agent_type`
- Subagents have unique `Architecture` section (use_case, pattern, responsibility)
- Subagents focus on agent patterns, not executable code
- MCP servers have `tools_provided` and `resources_provided`
- Skills have `skill_type` for procedure classification

---

## Required vs Optional Fields

### Always Required (11 fields)
1. `name` - Identity
2. `subagent_id` - Programmatic reference
3. `description` - Purpose and use cases
4. `agent_type` - Pattern classification (specialist/orchestrator/pipeline/hierarchical)
5. `difficulty` - Complexity level
6. `author` - Attribution
7. `created_date` - Creation timestamp
8. `status` - Lifecycle state
9. `primary_use_case` - Architectural purpose
10. `communication_pattern` - How agent communicates
11. `single_responsibility` - Agent boundaries

### Recommended (8 fields)
12. `category` - Domain grouping
13. `language` - Implementation context
14. `last_modified` - Update tracking
15. `version` - Version control
16. `estimated_setup_time` - Time expectation
17. `supported_platforms` - Platform compatibility
18. `model` - Model compatibility
19. `tags` - Discoverability

### Optional but Valuable (11 fields)
20. `prerequisites` - Requirements
21. `tools_required` - Tool dependencies
22. `references` - Related resources
23. `usage_count` - Analytics
24. `organization` - Publisher/org name
25. `repository` - Link to source
26. `license` - Legal clarity
27. `keywords` - Search terms
28. `compatibility` - Platform support
29. `installation_method` - Installation guidance
30. Custom fields as needed

---

## Agent Type Guidelines

### Specialist Pattern

**When to Use:** Single domain expertise, focused responsibility

**Characteristics:**
- Deep knowledge in specific domain
- Well-defined input/output
- Minimal dependencies on other agents
- Can work standalone or in composition

**Examples:**
- Research specialist (information gathering)
- Code analysis specialist (code review, bug detection)
- Content generation specialist (writing, summarization)

### Orchestrator Pattern

**When to Use:** Coordinating multiple agents, routing tasks

**Characteristics:**
- Manages other agents
- Routes tasks to appropriate specialists
- Aggregates results from multiple agents
- Maintains workflow state

**Examples:**
- Task router (determines which agent handles request)
- Workflow coordinator (manages multi-step processes)
- Quality orchestrator (coordinates review/validation)

### Pipeline Pattern

**When to Use:** Sequential processing, staged workflows

**Characteristics:**
- Linear flow of processing stages
- Each stage has clear input/output
- State passed between stages
- Enables parallelization of stages

**Examples:**
- Content pipeline (draft → review → edit → publish)
- Data processing (extract → transform → load)
- Analysis pipeline (collect → process → visualize)

### Hierarchical Pattern

**When to Use:** Task decomposition, supervisor-worker architecture

**Characteristics:**
- Supervisor agent delegates to workers
- Task breakdown into subtasks
- Worker agents report back to supervisor
- Supervisor aggregates results

**Examples:**
- Project manager (delegates tasks to specialists)
- Research coordinator (assigns research topics to specialists)
- Build orchestrator (coordinates build/test/deploy)

---

## Communication Pattern Guidelines

### Direct Invocation

**Pattern:**
```
caller → agent(input) → output
```

**Best for:**
- Simple request-response
- Synchronous processing
- Minimal state management

### Message Passing

**Pattern:**
```
agent1 → [message_queue] → agent2
```

**Best for:**
- Asynchronous communication
- Decoupled agents
- Event-driven architecture

### Shared Context

**Pattern:**
```
agent1 → [shared_state] ← agent2
```

**Best for:**
- Collaborative agents
- State persistence
- Multi-agent coordination

### Event Driven

**Pattern:**
```
event → [event_bus] → subscribed_agents
```

**Best for:**
- Reactive systems
- Pub/sub architecture
- Loose coupling

---

## Validation Checklist

Before committing a subagent, verify:

**Required Fields:**
- [ ] `name` and `subagent_id` are kebab-case and unique
- [ ] `description` is 2-3 complete sentences with multi-agent context
- [ ] `agent_type` is a valid type (specialist/orchestrator/pipeline/hierarchical)
- [ ] `difficulty` is beginner/intermediate/advanced
- [ ] `author` is specified
- [ ] `created_date` and `last_modified` are YYYY-MM-DD format
- [ ] `version` uses semantic versioning
- [ ] `status` is draft/active/experimental/deprecated
- [ ] `primary_use_case` is specified
- [ ] `communication_pattern` is specified
- [ ] `single_responsibility` is clearly defined

**Recommended Fields:**
- [ ] `category` is specified
- [ ] `estimated_setup_time` is realistic
- [ ] `supported_platforms` lists all applicable platforms
- [ ] `model` specifies recommended model
- [ ] `tags` has 3-8 relevant tags including `multi-agent`
- [ ] `keywords` has 5-10 search terms

**Optional but Valuable:**
- [ ] `prerequisites` lists essential requirements
- [ ] `tools_required` lists necessary tools
- [ ] `references` includes system-prompt.md and architecture.md
- [ ] `organization`, `repository`, and `license` are specified
- [ ] `compatibility` lists supported platforms

**Content Quality:**
- [ ] System prompt is well-defined (see references/system-prompt.md)
- [ ] Architecture is documented (see references/architecture.md)
- [ ] Communication pattern is explained
- [ ] Example scenario demonstrates usage
- [ ] Agent boundaries are clear (what it does/doesn't do)

---

## Backend Integration

The backend API (`backend/app/api/endpoints/subagents.py`) expects these frontmatter fields. Missing fields will use defaults:

```python
subagent = {
    "subagent_id": frontmatter.get("subagent_id", subagent_dir_name),
    "subagent_name": frontmatter.get("name", "Untitled Subagent"),
    "description": frontmatter.get("description", ""),
    "agent_type": frontmatter.get("agent_type", "specialist"),
    "category": frontmatter.get("category", "general"),
    "difficulty": frontmatter.get("difficulty", "beginner"),
    "language": frontmatter.get("language", "general"),
    "estimated_setup_time": frontmatter.get("estimated_setup_time", "Unknown"),
    "tags": frontmatter.get("tags", []),
    "keywords": frontmatter.get("keywords", []),
    "status": frontmatter.get("status", "draft"),
    "created_date": frontmatter.get("created_date", ""),
    "created_by": frontmatter.get("author", "Unknown"),
    "version": frontmatter.get("version", "1.0"),
    "supported_platforms": frontmatter.get("supported_platforms", []),
    "model": frontmatter.get("model", ""),
    "primary_use_case": frontmatter.get("primary_use_case", ""),
    "communication_pattern": frontmatter.get("communication_pattern", ""),
    "single_responsibility": frontmatter.get("single_responsibility", ""),
    "prerequisites": frontmatter.get("prerequisites", []),
    "tools_required": frontmatter.get("tools_required", []),
    "usage_count": frontmatter.get("usage_count", 0),
    # Integration fields
    "organization": frontmatter.get("organization", ""),
    "repository": frontmatter.get("repository", ""),
    "license": frontmatter.get("license", ""),
    "compatibility": frontmatter.get("compatibility", []),
    "installation_method": frontmatter.get("installation_method", ""),
}
```

**Providing complete frontmatter ensures:**
- Accurate UI display instead of defaults
- Working filters and search
- Proper attribution and tracking
- Complete user information
- Clear agent architecture documentation

---

## Resources

**Templates:**
- `_SUBAGENT_TEMPLATE.md` - Complete agent template with all fields

**Examples:**
- `research-specialist/SUBAGENT.md` - Specialist pattern example
- `pipeline-coordinator/SUBAGENT.md` - Pipeline pattern example
- `orchestrator/SUBAGENT.md` - Hierarchical pattern example

**Related Documentation:**
- Skills frontmatter structure (similar pattern)
- MCP server structure (similar pattern)
- Backend API expectations (`subagents.py`)
- Frontend display components

**External Resources:**
- [Multi-agent Systems](https://en.wikipedia.org/wiki/Multi-agent_system)
- [Claude Agents Documentation](https://docs.anthropic.com/agents)
- [Agent Design Patterns](https://www.anthropic.com/research/agents)

---

## Summary

**Comprehensive frontmatter transforms subagents from simple documents into rich, discoverable, well-documented educational resources.**

Minimum viable subagent: 11 required fields
Well-structured subagent: 30 fields with complete metadata
Best practice: Follow this guide and use `_SUBAGENT_TEMPLATE.md`

The investment in comprehensive frontmatter pays dividends in:
- Better user experience
- Improved discoverability
- Proper attribution
- Clear architectural documentation
- System consistency
- Educational value
