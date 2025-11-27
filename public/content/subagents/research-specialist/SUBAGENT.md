---
# Basic Identity
name: research-specialist
subagent_id: research-specialist
description: |
  Specialized agent for content research and information gathering in multi-agent systems.
  Focuses on web search, source evaluation, and structured research synthesis.
  Designed to work standalone or as part of larger agent workflows for research-intensive tasks.

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
  This agent is responsible for conducting research, gathering information from multiple sources,
  evaluating source credibility, and synthesizing findings into structured outputs.
  It should not handle content generation, final editing, or presentation formatting tasks.

# Organization
tags:
  - multi-agent
  - specialist
  - research
  - information-gathering
  - web-search
  - claude-code

keywords:
  - research agent
  - information gathering
  - web search
  - source evaluation
  - research synthesis
  - claude code agent
  - multi-agent system
  - specialist pattern

# Requirements
prerequisites:
  - Understanding of multi-agent design patterns
  - Familiarity with Claude Code agent configuration
  - Basic knowledge of research methodologies

tools_required:
  - Claude Code
  - Claude API key
  - Web search capabilities (Brave Search or similar)

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

# Research Specialist Agent

A specialized agent focused on information research and synthesis in multi-agent systems. Demonstrates the **specialist pattern** with clear domain boundaries and single responsibility.

---

## When to Use

This agent should be used when your multi-agent system needs:

- **Information gathering** from multiple sources
- **Research synthesis** with source tracking
- **Fact verification** and source credibility assessment
- **Domain research** requiring specialized knowledge gathering
- **Preliminary investigation** before content generation or decision-making

**Example use cases:**
- "Research the latest trends in AI agent architectures and summarize findings"
- "Gather information about deployment options for FastAPI applications"
- "Find and evaluate sources about multi-agent communication patterns"
- "Research competitor products and compile feature comparisons"

---

## Agent Role

### Single Responsibility

This agent is responsible for:
- **Primary task:** Conducting thorough research on given topics
- **Scope:** Information gathering, source evaluation, research synthesis
- **Boundaries:** Does NOT handle content writing, editing, or final formatting

### Design Pattern

This agent follows the **specialist** pattern:
- **Domain Focus:** Deep expertise in research and information gathering
- **Clear Boundaries:** Well-defined input (research query) and output (structured findings)
- **Composable:** Works standalone or integrates with content generation, analysis, or decision-making agents
- **Reusable:** Same agent can handle various research domains

---

## System Prompt

The agent should be configured with this system prompt (see `references/system-prompt.md` for full version):

```
You are a research specialist agent in a multi-agent system.

Your responsibilities:
- Conduct thorough research on requested topics
- Gather information from multiple reliable sources
- Evaluate source credibility and relevance
- Synthesize findings into structured, citable outputs
- Track sources and provide proper attribution

Your capabilities:
- Web search and information retrieval
- Source credibility assessment
- Pattern recognition across multiple sources
- Structured data synthesis
- Clear documentation of research methods

Your constraints:
- Focus only on research and information gathering
- Do not generate final content or creative writing
- Do not make decisions outside research scope
- Always cite sources and track information origin
- Flag uncertain or conflicting information

When receiving research tasks:
1. Clarify research scope and objectives
2. Identify relevant sources and search strategies
3. Gather information from multiple sources
4. Evaluate source quality and relevance
5. Synthesize findings with proper attribution
6. Present structured output ready for next agent
```

---

## Architecture

### Communication Pattern

This agent uses **direct-invocation** communication:

**Input Format:**
```json
{
  "task": "Research topic description",
  "scope": {
    "depth": "high-level | detailed | comprehensive",
    "focus": ["aspect1", "aspect2"],
    "constraints": ["time_limit", "source_types"]
  },
  "output_format": "summary | detailed | structured"
}
```

**Output Format:**
```json
{
  "findings": {
    "summary": "High-level summary of research",
    "key_insights": ["insight1", "insight2", "insight3"],
    "sources": [
      {
        "url": "source_url",
        "title": "source_title",
        "credibility": "high | medium | low",
        "relevance": "high | medium | low",
        "key_points": ["point1", "point2"]
      }
    ],
    "gaps": ["identified gap1", "identified gap2"],
    "recommendations": ["recommendation1", "recommendation2"]
  },
  "status": "complete | partial | needs_clarification",
  "metadata": {
    "sources_consulted": 10,
    "time_elapsed": "5 minutes",
    "confidence_level": "high | medium | low"
  }
}
```

### State Management

- **Stateless Operation:** Agent doesn't maintain state between invocations
- **Context Passing:** All necessary context provided in input
- **Source Tracking:** Each invocation tracks sources within that session
- **Independent Execution:** Can handle parallel research requests

---

## Integration

### With Other Agents

This agent composes well with:

- **Content Generation Agents:** Provides researched information for content creation
  - Research Specialist → Content Generator → Editor

- **Analysis Agents:** Supplies data for deeper analysis
  - Research Specialist → Data Analyzer → Report Generator

- **Decision-Making Agents:** Gathers information to inform decisions
  - Research Specialist → Decision Agent → Action Executor

- **Orchestrators:** Can be invoked by coordinator for multi-topic research
  - Orchestrator → [Research Specialist 1, Research Specialist 2] → Synthesizer

### Invocation Pattern

**Standalone:**
```pseudocode
research_result = invoke_agent(
    agent_id="research-specialist",
    task="Research multi-agent communication patterns",
    scope={
        "depth": "detailed",
        "focus": ["message-passing", "shared-context"],
        "constraints": ["academic sources preferred"]
    },
    output_format="structured"
)
```

**In Pipeline:**
```pseudocode
# Stage 1: Research
research_findings = research_specialist.process({
    "task": "Research deployment options",
    "scope": {"depth": "comprehensive"}
})

# Stage 2: Generate Content
draft = content_generator.process({
    "task": "Write deployment guide",
    "research": research_findings
})

# Stage 3: Review
final = reviewer.process({
    "content": draft,
    "research": research_findings
})
```

**Hierarchical:**
```pseudocode
# Orchestrator decomposes research task
orchestrator:
    main_task = "Research AI agent frameworks"

    subtasks = decompose_task(main_task)
    # ["Research LangGraph", "Research CrewAI", "Research AutoGen"]

    results = []
    for subtask in subtasks:
        result = delegate_to_agent("research-specialist", subtask)
        results.append(result)

    synthesized = synthesize_results(results)
    return synthesized
```

---

## Configuration

### Claude Code Setup

1. **Create agent file:** `.claude/agents/research-specialist.md`

2. **Configure system prompt:**
   ```markdown
   # Research Specialist Agent

   You are a research specialist agent in a multi-agent system.

   ## Responsibilities
   - Conduct thorough research on requested topics
   - Gather information from multiple reliable sources
   - Evaluate source credibility and relevance
   - Synthesize findings into structured outputs

   ## Capabilities
   - Web search and information retrieval
   - Source credibility assessment
   - Pattern recognition across sources
   - Structured data synthesis

   ## Constraints
   - Focus only on research and information gathering
   - Always cite sources
   - Flag uncertain information
   - Do not generate final content
   ```

3. **Set agent parameters:**
   ```yaml
   model: claude-sonnet-4-5
   temperature: 0.3  # Lower for factual research
   max_tokens: 4096
   tools:
     - web_search
     - read_url
   ```

4. **Test agent:** Invoke with sample research task

### Environment Variables

```bash
# Required
CLAUDE_API_KEY=your_api_key_here

# Optional - for web search
BRAVE_API_KEY=your_brave_key_here  # If using Brave Search

# Agent Configuration
RESEARCH_MAX_SOURCES=10
RESEARCH_TIMEOUT=300000  # 5 minutes
RESEARCH_MIN_CREDIBILITY=medium
```

---

## Best Practices

### Do's ✅

- **Clear Scope:** Always define research scope and depth upfront
- **Source Diversity:** Gather information from multiple source types
- **Credibility Check:** Evaluate and document source reliability
- **Structured Output:** Return findings in consistent, parseable format
- **Track Provenance:** Always cite sources and track information origin
- **Flag Uncertainty:** Clearly mark uncertain or conflicting information

### Don'ts ❌

- **Don't Overcomplicate:** Stick to research; don't try to generate final content
- **Don't Skip Verification:** Always verify sources before including findings
- **Don't Ignore Gaps:** Document what couldn't be found or verified
- **Don't Mix Responsibilities:** Keep research separate from content generation
- **Don't Lose Sources:** Always maintain source tracking throughout process
- **Don't Assume Credibility:** Every source should be evaluated

---

## Example Scenarios

See `references/example-scenario.md` for detailed walkthrough.

### Scenario 1: Technology Research

**Input:**
```json
{
  "task": "Research deployment options for FastAPI applications",
  "scope": {
    "depth": "detailed",
    "focus": ["cloud platforms", "containerization", "serverless"],
    "constraints": ["production-ready solutions"]
  },
  "output_format": "structured"
}
```

**Agent Processing:**
1. Agent identifies key research areas: cloud platforms, containers, serverless
2. Searches for information on Render, AWS, Docker, serverless options
3. Evaluates sources for credibility and relevance
4. Synthesizes findings by category
5. Documents gaps (e.g., cost comparisons, performance benchmarks)
6. Returns structured output with sources

**Output:**
```json
{
  "findings": {
    "summary": "Multiple production-ready deployment options exist for FastAPI...",
    "key_insights": [
      "Docker containerization is widely recommended",
      "Render provides simple FastAPI deployment",
      "AWS Lambda supports FastAPI via Mangum adapter"
    ],
    "sources": [
      {
        "url": "https://render.com/docs/deploy-fastapi",
        "title": "Deploy FastAPI on Render",
        "credibility": "high",
        "relevance": "high",
        "key_points": ["Docker support", "Auto-scaling", "Free tier available"]
      }
    ],
    "gaps": ["Limited cost comparison data", "Performance benchmarks needed"],
    "recommendations": [
      "Evaluate based on traffic patterns",
      "Consider Docker for consistency",
      "Test deployment on multiple platforms"
    ]
  },
  "status": "complete",
  "metadata": {
    "sources_consulted": 12,
    "time_elapsed": "4 minutes",
    "confidence_level": "high"
  }
}
```

---

## Debugging

### Common Issues

1. **Issue:** Low-quality research results
   - **Cause:** Insufficient sources or poor source evaluation
   - **Solution:** Increase source diversity, strengthen credibility checks, refine search queries

2. **Issue:** Conflicting information from sources
   - **Cause:** Different perspectives or outdated information
   - **Solution:** Document conflicts explicitly, evaluate source recency, seek authoritative sources

3. **Issue:** Research taking too long
   - **Cause:** Scope too broad or undefined
   - **Solution:** Narrow scope, set time limits, prioritize high-value sources

4. **Issue:** Missing critical information
   - **Cause:** Search strategy limitations or information gaps
   - **Solution:** Try alternative search terms, consult different source types, document gaps explicitly

### Monitoring

Monitor these metrics:
- **Sources per task:** Average number of sources consulted
- **Credibility distribution:** Ratio of high/medium/low credibility sources
- **Time per task:** Average research duration
- **Completion rate:** Percentage of tasks completed vs. needing clarification
- **Source diversity:** Variety of source types used

---

## Resources

**Related Agents:**
- Content Generator - Uses research for content creation
- Data Analyzer - Analyzes research findings
- Decision Agent - Uses research to inform decisions

**Documentation:**
- `references/system-prompt.md` - Complete system prompt with examples
- `references/architecture.md` - Design decisions and flow diagrams
- `references/communication-pattern.md` - Communication protocol details
- `references/example-scenario.md` - Step-by-step research walkthrough

**External Resources:**
- [Multi-agent Systems](https://en.wikipedia.org/wiki/Multi-agent_system)
- [Research Methodologies](https://en.wikipedia.org/wiki/Research_method)
- [Claude Agents SDK](https://docs.anthropic.com/agents)

---

## Quick Reference

**Pattern:** Specialist
**Responsibility:** Research and information gathering
**Communication:** Direct invocation
**Status:** Active (v1.0)
**Best For:** Information-intensive tasks, fact-gathering, preliminary research

---

This agent enables multi-agent systems to conduct thorough, structured research while maintaining clear boundaries and single responsibility. Perfect for research-intensive workflows that benefit from specialized information gathering.
