---
# ============================================================================
# SUBAGENT FRONTMATTER TEMPLATE
# ============================================================================
# This template defines the comprehensive frontmatter structure for subagents.
# Copy this template when creating new subagent configurations and fill in all fields.
# Aligns with skills and workflow frontmatter structure for consistency.
# Focused on Claude Code agent patterns and configurations.
# ============================================================================

# ----------------------------------------------------------------------------
# BASIC IDENTITY (Required)
# ----------------------------------------------------------------------------
name: subagent-name-here                      # Kebab-case identifier (e.g., research-specialist)
subagent_id: subagent-name-here               # Unique identifier (usually matches name)
description: |                                # Comprehensive description (2-3 sentences)
  Brief description of what this subagent does and when to use it.
  Should clearly explain the agent's purpose and role in a multi-agent system.

# ----------------------------------------------------------------------------
# CLASSIFICATION (Required)
# ----------------------------------------------------------------------------
agent_type: specialist                        # specialist | orchestrator | pipeline | hierarchical
category: research                            # research | analysis | automation | generation | coordination
difficulty: beginner                          # beginner | intermediate | advanced
language: general                             # Primary implementation language: general, python, typescript, etc.

# ----------------------------------------------------------------------------
# METADATA (Required)
# ----------------------------------------------------------------------------
author: Claude                                # Creator name or organization
created_date: 2025-01-01                      # YYYY-MM-DD format
last_modified: 2025-01-01                     # YYYY-MM-DD format (update when agent changes)
version: "1.0"                                # Semantic versioning: "major.minor" or "major.minor.patch"
status: draft                                 # draft | active | experimental | deprecated

# ----------------------------------------------------------------------------
# USAGE INFORMATION (Required)
# ----------------------------------------------------------------------------
estimated_setup_time: 10-20 minutes           # Time to understand and configure this agent
supported_platforms:                          # Platforms where this agent can run
  - Claude Code
  - Claude Desktop
  - Claude.ai
  - API
model: claude-sonnet-4-5                      # Recommended/tested model(s)

# ----------------------------------------------------------------------------
# ARCHITECTURE (Subagent-Specific - Required)
# ----------------------------------------------------------------------------
primary_use_case: Domain expertise            # Task decomposition | Domain expertise | Pipeline processing | Coordination
communication_pattern: direct-invocation      # direct-invocation | message-passing | shared-context | event-driven
single_responsibility: |                      # Brief statement of the agent's single responsibility
  This agent is responsible for [specific task].
  It should not handle [out of scope tasks].

# ----------------------------------------------------------------------------
# ORGANIZATION (Required)
# ----------------------------------------------------------------------------
tags:                                         # Array of tags for filtering/search (3-8 tags)
  - multi-agent
  - specialized
  - domain-tag-here

keywords:                                     # Marketplace search terms (5-10 keywords)
  - keyword1
  - keyword2
  - keyword3

# ----------------------------------------------------------------------------
# REQUIREMENTS (Optional but Recommended)
# ----------------------------------------------------------------------------
prerequisites:                                # What users need before using this agent
  - Understanding of multi-agent systems
  - Familiarity with Claude Code
  - Knowledge of [domain]

tools_required:                               # Tools/systems needed for this agent
  - Claude Code
  - Tool/Framework name
  - API access (if needed)

# ----------------------------------------------------------------------------
# REFERENCES (Optional)
# ----------------------------------------------------------------------------
references:                                   # Related files, guides, or resources
  - references/system-prompt.md
  - references/architecture.md
  - references/communication-pattern.md
  - references/example-scenario.md

# ----------------------------------------------------------------------------
# INTEGRATION (Optional but Recommended)
# ----------------------------------------------------------------------------
organization: gitthub                         # Publisher/organization name
repository: https://github.com/gitthub-org/subagents/tree/main/subagent-name-here
license: MIT                                  # License type (MIT, Apache-2.0, etc.)
compatibility:                                # Claude Code compatibility
  - "Claude Code"
  - "Claude.ai"
  - "Claude API"
installation_method: documentation            # documentation | template | framework-specific

# ----------------------------------------------------------------------------
# ANALYTICS (Optional - automatically updated)
# ----------------------------------------------------------------------------
usage_count: 0                                # Number of times agent has been referenced

---

# Subagent Name Here

Brief introduction to the subagent (1-2 sentences explaining its role in a multi-agent system).

---

## When to Use

This subagent should be used when:

- Trigger scenario 1
- Trigger scenario 2
- Trigger scenario 3

**Example use cases:**
- "Example scenario where this agent is needed"
- "Another scenario demonstrating the agent's value"
- "Third example showing practical application"

---

## Agent Role

### Single Responsibility

This agent is responsible for:
- **Primary task:** [What it does]
- **Scope:** [What's included]
- **Boundaries:** [What's excluded]

### Design Pattern

This agent follows the **[specialist/orchestrator/pipeline/hierarchical]** pattern:
- [Key characteristic 1 of this pattern]
- [Key characteristic 2 of this pattern]
- [Key characteristic 3 of this pattern]

---

## System Prompt

The agent should be configured with this system prompt (see `references/system-prompt.md` for full version):

```
You are a [role] agent responsible for [responsibility].

Your capabilities:
- Capability 1
- Capability 2
- Capability 3

Your constraints:
- Constraint 1
- Constraint 2
- Constraint 3

When receiving tasks:
1. Step 1
2. Step 2
3. Step 3
```

---

## Architecture

### Communication Pattern

This agent uses **[direct-invocation/message-passing/shared-context/event-driven]** communication:

**Input Format:**
```
{
  "task": "description",
  "context": {context_data},
  "parameters": {parameter_data}
}
```

**Output Format:**
```
{
  "result": "result_data",
  "status": "success|error",
  "metadata": {metadata}
}
```

### State Management

- **Stateless:** Agent doesn't maintain state between invocations
- **Stateful:** Agent maintains [type of state]
- **Shared State:** Agent accesses shared context via [mechanism]

---

## Integration

### With Other Agents

This agent can be composed with:
- **[Agent Type 1]:** For [purpose]
- **[Agent Type 2]:** To handle [scenario]
- **[Agent Type 3]:** When [condition]

### Invocation Pattern

**Standalone:**
```pseudocode
result = invoke_agent(
    agent_id="subagent-name-here",
    task=task_description,
    context=shared_context
)
```

**In Pipeline:**
```pseudocode
result1 = agent_1.process(input)
result2 = this_agent.process(result1)
result3 = agent_3.process(result2)
```

**Hierarchical:**
```pseudocode
orchestrator:
    task = decompose_task(user_request)
    result = delegate_to_agent("subagent-name-here", task)
    return aggregate_results([result])
```

---

## Configuration

### Claude Code Setup

1. **Create agent file:** `.claude/agents/subagent-name-here.md`
2. **Configure system prompt:** Copy prompt from `references/system-prompt.md`
3. **Set agent parameters:**
   ```yaml
   model: claude-sonnet-4-5
   temperature: 0.7
   max_tokens: 4096
   ```
4. **Test agent:** Invoke with sample task

### Environment Variables

```bash
# Required
CLAUDE_API_KEY=your_api_key_here

# Optional
AGENT_TIMEOUT=30000
AGENT_MAX_RETRIES=3
```

---

## Best Practices

### Do's ✅

- Keep agent focused on single responsibility
- Validate inputs before processing
- Provide clear error messages
- Log agent invocations for debugging
- Test agent with edge cases

### Don'ts ❌

- Don't make agent handle multiple responsibilities
- Don't assume input format without validation
- Don't fail silently (always provide error context)
- Don't create tight coupling with other agents
- Don't skip documentation of expected inputs/outputs

---

## Example Scenarios

See `references/example-scenario.md` for detailed walkthrough.

### Scenario 1: [Scenario Name]

**Input:**
```
User request: [request description]
Context: [context information]
```

**Agent Processing:**
```
1. Agent receives task
2. Agent [processes step 1]
3. Agent [processes step 2]
4. Agent returns result
```

**Output:**
```
Result: [result description]
Status: success
Metadata: [relevant metadata]
```

---

## Debugging

### Common Issues

1. **Issue:** Agent not responding
   - **Cause:** [possible cause]
   - **Solution:** [solution steps]

2. **Issue:** Unexpected output format
   - **Cause:** [possible cause]
   - **Solution:** [solution steps]

3. **Issue:** Performance degradation
   - **Cause:** [possible cause]
   - **Solution:** [solution steps]

### Monitoring

Monitor these metrics:
- Invocation count
- Average response time
- Error rate
- Input validation failures

---

## Resources

**Related Agents:**
- [Related agent 1] - [relationship]
- [Related agent 2] - [relationship]

**Documentation:**
- `references/system-prompt.md` - Complete system prompt
- `references/architecture.md` - Design decisions and diagrams
- `references/communication-pattern.md` - Communication protocol details
- `references/example-scenario.md` - Step-by-step walkthrough

**External Resources:**
- [Link to relevant documentation]
- [Link to framework/tool docs]

---

## Quick Reference

**Pattern:** [specialist/orchestrator/pipeline/hierarchical]
**Responsibility:** [one-line description]
**Communication:** [direct-invocation/message-passing/shared-context/event-driven]
**Status:** [draft/active/experimental]

---

This subagent [summary sentence about what it accomplishes in a multi-agent system].
