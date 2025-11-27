# Scripts Directory

Automation scripts for the gitthub.org web application.

---

## Content Addition Pipeline

### add-content.js

Automates adding workflows, skills, and tools to the content system.

**Usage:**

```bash
# From frontend directory
npm run add-workflow path/to/workflow.md
npm run add-skill path/to/skill.md
npm run add-tool path/to/tool.md

# Direct usage
node scripts/add-content.js workflow path/to/workflow.md
node scripts/add-content.js skill path/to/skill.md
node scripts/add-content.js tool path/to/tool.md
```

**What it does:**

1. Parses markdown frontmatter for metadata
2. Validates required fields
3. Generates unique IDs
4. Creates directory structure
5. Updates manifest.json
6. Makes content available in Docs and Hub pages

**Required Frontmatter:**

**Workflows:**
- title
- description
- type
- difficulty

**Skills:**
- title
- description
- category

**Tools:**
- title
- description
- category

**See:** `/vault-website/references/content-pipeline-guide.md` for complete documentation.

---

## Other Scripts

### sync-docs.sh

Syncs documentation from external sources (if configured).

---

## Adding New Scripts

When creating new scripts:

1. Add to this directory: `/web/scripts/`
2. Make executable: `chmod +x scripts/your-script.sh`
3. Add npm script in `frontend/package.json` for convenience
4. Document in this README
5. Add detailed guide in `/vault-website/references/` if complex

---

## Script Conventions

- Use Node.js for cross-platform compatibility
- Include shebang: `#!/usr/bin/env node`
- Provide clear error messages
- Exit with non-zero status on errors
- Include usage instructions in script comments
