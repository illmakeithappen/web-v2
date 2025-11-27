# MCP:

The Model Context Protocol (MCP) is an open standard for connecting AI assistants to external systems where data lives—content repositories, business tools, databases, and development environments.

**How MCP works:** MCP provides a standardized way to connect Claude to your tools and data sources. Instead of building custom integrations for each data source, you build against a single protocol. MCP servers expose data and capabilities; MCP clients (like Claude) connect to these servers.

**When to use MCP:** Choose MCP when you need Claude to:

- Access external data: Google Drive, Slack, GitHub, databases
- Use business tools: CRM systems, project management platforms
- Connect to development environments: Local files, IDEs, version control
- Integrate with custom systems: Your proprietary tools and data sources

**Example:** Connect Claude to your company's Google Drive via MCP. Now Claude can search documents, read files, and reference internal knowledge without manual uploads—the connection persists and updates automatically.

**When to use a Skill instead:** MCP connects Claude to data; Skills teach Claude what to do with that data. If you're explaining _how_ to use a tool or follow procedures—like "when querying our database, always filter by date range first" or "format Excel reports with these specific formulas"—that's a Skill. If you need Claude to _access_ the database or Excel files in the first place, that's MCP. Use both together: MCP for connectivity, Skills for procedural knowledge.

[Learn more](https://www.anthropic.com/news/model-context-protocol) about MCP and check out [documentation](https://modelcontextprotocol.io/docs/develop/build-server) on how to build an MCP server.