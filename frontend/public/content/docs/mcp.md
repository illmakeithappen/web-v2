# Model Context Protocol (MCP) Servers

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

**Ready to build your first MCP server?** Select an entry from the navigation to get started, or use **Cmd+K** to search for specific topics.
