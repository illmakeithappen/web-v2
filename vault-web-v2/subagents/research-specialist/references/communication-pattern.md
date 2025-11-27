# Research Specialist - Communication Pattern

## Overview

The Research Specialist uses the **direct-invocation** communication pattern. This is a synchronous request-response model where the caller waits for the agent to complete its research before proceeding.

---

## Direct-Invocation Pattern

### Characteristics

- **Synchronous:** Caller blocks until agent completes
- **Request-Response:** Clear input/output contract
- **Stateless:** No persistent connection between calls
- **Isolated:** Each invocation is independent

### Why Direct-Invocation for Research?

1. **Sequential Dependency:** Downstream agents need research results before proceeding
2. **Simplicity:** No message queue or event bus infrastructure needed
3. **Clear Boundaries:** Explicit input and output contracts
4. **Error Handling:** Caller can immediately handle failures

---

## Message Flow

### Standard Research Request

```
┌──────────────┐
│   Caller     │
│ (Human/Agent)│
└──────┬───────┘
       │
       │ 1. invoke_agent(task, scope, format)
       ▼
┌──────────────┐
│  Research    │
│  Specialist  │
└──────┬───────┘
       │
       │ 2. conduct_research()
       │    - web_search()
       │    - evaluate_sources()
       │    - synthesize()
       ▼
┌──────────────┐
│   Findings   │
│   (JSON)     │
└──────┬───────┘
       │
       │ 3. return findings
       ▼
┌──────────────┐
│   Caller     │
│  (receives)  │
└──────────────┘
```

### Multi-Agent Pipeline

```
User Request
     │
     ▼
┌──────────────┐
│ Orchestrator │
└──────┬───────┘
       │
       │ 1. Research Phase
       ├─────────────────────────┐
       │                         │
       ▼                         ▼
┌────────────────┐      ┌────────────────┐
│   Research     │      │   Research     │
│   Specialist   │      │   Specialist   │
│   (Topic A)    │      │   (Topic B)    │
└────────┬───────┘      └────────┬───────┘
       │                         │
       │ findings_a              │ findings_b
       └────────┬────────────────┘
                │
                ▼
       ┌──────────────────┐
       │   Orchestrator   │
       │   (synthesize)   │
       └────────┬─────────┘
                │
                │ 2. Content Phase
                ▼
       ┌──────────────────┐
       │    Content       │
       │    Generator     │
       └────────┬─────────┘
                │
                ▼
           Final Output
```

---

## Input Contract

### Required Fields

```json
{
  "task": "string - research question or topic (required)",
  "scope": {
    "depth": "high-level | detailed | comprehensive",
    "focus": ["array of specific aspects"],
    "constraints": ["time limits, source preferences"]
  },
  "output_format": "summary | detailed | structured"
}
```

### Optional Fields

```json
{
  "context": {
    "purpose": "Why this research is needed",
    "next_steps": "How findings will be used",
    "existing_knowledge": "What caller already knows"
  },
  "preferences": {
    "source_types": ["academic", "technical", "news"],
    "recency": "prefer recent sources",
    "geography": "focus on specific regions"
  }
}
```

---

## Output Contract

### Standard Response

```json
{
  "findings": {
    "summary": "string - 2-3 sentence overview",
    "key_insights": ["array of most important findings"],
    "detailed_findings": {
      "category_name": {
        "summary": "string",
        "points": ["array of detailed points"],
        "sources": ["array of source IDs"]
      }
    },
    "sources": [
      {
        "id": "source_ref_1",
        "url": "https://example.com",
        "title": "Source Title",
        "author": "Author Name",
        "date": "2025-01-27",
        "credibility": "high | medium | low",
        "relevance": "high | medium | low",
        "key_points": ["extracted points"],
        "notes": "contextual information"
      }
    ],
    "gaps": ["identified information gaps"],
    "conflicts": [
      {
        "topic": "conflicting topic",
        "source_1": {"position": "...", "source": "ref"},
        "source_2": {"position": "...", "source": "ref"},
        "resolution": "evaluation of which is more credible"
      }
    ],
    "recommendations": ["next research steps"]
  },
  "status": "complete | partial | needs_clarification",
  "clarifications_needed": ["questions if scope unclear"],
  "metadata": {
    "sources_consulted": 10,
    "time_elapsed": "5 minutes",
    "confidence_level": "high | medium | low",
    "research_method": "approach description"
  }
}
```

### Error Response

```json
{
  "status": "error",
  "error": {
    "type": "invalid_scope | timeout | source_unavailable",
    "message": "Human-readable error description",
    "details": "Additional context about the error"
  },
  "partial_findings": {
    "summary": "What was found before error",
    "sources": ["sources accessed before failure"]
  },
  "metadata": {
    "sources_consulted": 3,
    "time_elapsed": "2 minutes"
  }
}
```

---

## Invocation Patterns

### Pattern 1: Standalone Invocation

**Use Case:** Direct research request from human or single-purpose agent

```pseudocode
research_agent = get_agent("research-specialist")

result = research_agent.invoke({
    "task": "Research deployment options for FastAPI",
    "scope": {
        "depth": "detailed",
        "focus": ["cloud platforms", "containerization"],
        "constraints": ["production-ready"]
    },
    "output_format": "structured"
})

if result.status == "complete":
    process_findings(result.findings)
elif result.status == "needs_clarification":
    clarify_and_retry(result.clarifications_needed)
else:
    handle_error(result.error)
```

### Pattern 2: Sequential Pipeline

**Use Case:** Research feeds into content generation

```pseudocode
# Stage 1: Research
research_result = research_agent.invoke({
    "task": "Research AI agent architectures",
    "scope": {"depth": "comprehensive"}
})

# Stage 2: Content Generation (uses research)
content_result = content_agent.invoke({
    "task": "Write article on agent architectures",
    "research": research_result.findings,
    "style": "technical blog"
})

# Stage 3: Review (validates against research)
final_result = review_agent.invoke({
    "content": content_result.draft,
    "sources": research_result.findings.sources,
    "task": "verify factual accuracy"
})
```

### Pattern 3: Parallel Research

**Use Case:** Research multiple topics simultaneously

```pseudocode
orchestrator = get_agent("orchestrator")

# Decompose task
topics = [
    "Research LangGraph",
    "Research CrewAI",
    "Research AutoGen"
]

# Parallel invocation
results = []
for topic in topics:
    result = research_agent.invoke({
        "task": topic,
        "scope": {"depth": "detailed"}
    })
    results.append(result)

# Synthesize
combined = orchestrator.synthesize(results)
```

### Pattern 4: Iterative Refinement

**Use Case:** Progressive research with clarifications

```pseudocode
initial_result = research_agent.invoke({
    "task": "Research multi-agent systems"
})

if initial_result.status == "needs_clarification":
    # Provide clarifications
    refined_result = research_agent.invoke({
        "task": "Research multi-agent communication patterns",
        "scope": {
            "focus": ["message-passing", "shared-context"],
            "constraints": ["academic sources preferred"]
        }
    })

# Check for gaps
if refined_result.findings.gaps:
    # Address specific gaps
    gap_result = research_agent.invoke({
        "task": refined_result.findings.gaps[0],
        "scope": {"depth": "detailed"}
    })
```

---

## Error Handling

### Timeout Handling

```pseudocode
try:
    result = research_agent.invoke(
        task=research_request,
        timeout=300  # 5 minutes
    )
except TimeoutError as e:
    # Use partial results if available
    if e.partial_findings:
        use_partial_results(e.partial_findings)
    else:
        # Retry with narrower scope
        retry_with_constraints(research_request)
```

### Clarification Loop

```pseudocode
max_retries = 3
attempt = 0

while attempt < max_retries:
    result = research_agent.invoke(request)

    if result.status == "complete":
        return result.findings

    elif result.status == "needs_clarification":
        # Get clarifications from user/system
        clarifications = get_clarifications(
            result.clarifications_needed
        )
        request.update(clarifications)
        attempt += 1

    else:
        raise ResearchError(result.error)

raise MaxRetriesExceeded("Could not clarify scope")
```

---

## State Management

### Stateless Design

- **No Session State:** Each invocation is independent
- **Context in Input:** All necessary information provided in request
- **No Memory:** Agent doesn't remember previous invocations
- **Fresh Start:** Each call starts with clean slate

### Benefits

1. **Scalability:** Can handle parallel requests independently
2. **Reliability:** No state corruption issues
3. **Simplicity:** No state management overhead
4. **Testability:** Each invocation is isolated

### Passing Context Between Invocations

If context is needed, pass it explicitly:

```pseudocode
# First research
result_1 = research_agent.invoke({
    "task": "Research topic A"
})

# Second research (with context from first)
result_2 = research_agent.invoke({
    "task": "Research topic B",
    "context": {
        "existing_knowledge": result_1.findings.summary,
        "related_sources": result_1.findings.sources,
        "purpose": "Build on previous research"
    }
})
```

---

## Performance Characteristics

### Latency

- **Typical:** 2-5 minutes per research task
- **Fast (high-level):** 30-60 seconds
- **Comprehensive:** 5-10 minutes

**Factors:**
- Scope depth
- Number of sources required
- Source availability/latency
- Synthesis complexity

### Throughput

- **Sequential:** One task at a time per agent instance
- **Parallel:** Multiple independent agent instances
- **Horizontal Scaling:** Deploy multiple research agents

### Resource Usage

- **CPU:** Low (mostly I/O bound - web requests)
- **Memory:** Medium (storing sources, findings)
- **Network:** High (multiple web requests)
- **Token Usage:** High (LLM calls for synthesis)

---

## Integration Considerations

### With Orchestrators

Orchestrators can:
- Decompose complex research into subtasks
- Invoke multiple research agents in parallel
- Aggregate results from multiple invocations
- Handle error recovery and retries

### With Content Generators

Content generators:
- Receive research findings as structured input
- Use sources for citation
- Build on key insights
- Verify against research metadata

### With Decision Agents

Decision agents:
- Use research to inform choices
- Cross-reference recommendations
- Assess confidence levels
- Request follow-up research if needed

---

## Comparison with Other Patterns

| Pattern | Research Specialist | Alternative |
|---------|-------------------|-------------|
| **Message-Passing** | ❌ Too complex for synchronous research | ✅ Better for event-driven systems |
| **Shared-Context** | ❌ Research is stateless | ✅ Better for collaborative agents |
| **Event-Driven** | ❌ Research is request-response | ✅ Better for async workflows |
| **Direct-Invocation** | ✅ Perfect fit - simple, clear, synchronous | - |

---

## Best Practices

### Do's ✅

- **Validate Input:** Check task and scope before starting research
- **Timeout Protection:** Set reasonable timeouts (5-10 minutes)
- **Handle Partial Results:** Return what was found if interrupted
- **Clear Error Messages:** Explain what went wrong and how to fix
- **Structure Output:** Always return consistent JSON format

### Don'ts ❌

- **Don't Assume Context:** Treat each invocation as independent
- **Don't Store State:** No session management between calls
- **Don't Block Forever:** Always have timeout protection
- **Don't Return Unstructured Data:** Maintain output contract
- **Don't Ignore Clarifications:** If scope is unclear, request clarification

---

This communication pattern ensures the Research Specialist agent is simple, reliable, and composable with other agents in multi-agent systems.
