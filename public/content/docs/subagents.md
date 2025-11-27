# Subagents

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

**Ready to build your first subagent system?** Select an entry from the navigation to get started, or use **Cmd+K** to search for specific topics.
