# Workflow Sync Script

## Overview

Workflows are stored in two locations:
- **Source of truth**: `vault-web/workflows/` - Obsidian vault with editable workflows
- **Frontend static files**: `frontend/public/content/workflows/` - Served by Vite dev server

## Syncing Workflows

When workflows are added or updated in `vault-web/workflows/`, run the sync script to copy them to the frontend:

```bash
# From project root
python3 scripts/sync_workflows.py
```

This script:
1. Copies all `workflow_*` directories from `vault-web/workflows/` to `frontend/public/content/workflows/`
2. Reads frontmatter from each `WORKFLOW.md` file
3. Generates `manifest.json` with metadata for all workflows
4. Reports which workflows were synced

## Manifest Format

The `manifest.json` file contains an array of workflow entries:

```json
{
  "entries": [
    {
      "id": "workflow_20251115_008_deploy_gitthub_workflow_skill_to_claude_ai",
      "name": "Deploy Gitthub-Workflow Skill to Claude Ai",
      "description": "install and configure the gitthub-workflow skill...",
      "category": "workflow",
      "tags": ["deploy", "claude-skills", "claude-ai"],
      "difficulty": "beginner"
    }
  ]
}
```

## Workflow Frontmatter

Each `WORKFLOW.md` should have YAML frontmatter:

```yaml
---
workflow_id: workflow_20251115_008_deploy_gitthub_workflow_skill_to_claude_ai
name: Deploy Gitthub-Workflow Skill to Claude Ai
description: install and configure the gitthub-workflow skill in claude.ai
category: workflow
difficulty: beginner
tags:
  - deploy
  - claude-skills
  - claude-ai
---
```

## How Workflows Load in the Frontend

1. **API First**: `docs-service.js` tries to fetch from `/api/v1/docs/workflows`
2. **Static Fallback**: If API fails, falls back to `/content/workflows/manifest.json`
3. **Component**: `CourseCatalog.jsx` fetches via `docsService.listSection('workflows')`
4. **Display**: Workflows appear in the Hub page at `/hub` or `/courses`

## Troubleshooting

If workflows aren't loading:

1. **Check files exist**:
   ```bash
   ls -la frontend/public/content/workflows/
   ```

2. **Verify manifest is valid**:
   ```bash
   cat frontend/public/content/workflows/manifest.json | python3 -m json.tool
   ```

3. **Test manifest is accessible**:
   ```bash
   curl http://localhost:3001/content/workflows/manifest.json
   ```

4. **Resync workflows**:
   ```bash
   python3 scripts/sync_workflows.py
   ```

5. **Check browser console** for fetch errors

## Adding New Workflows

1. Create new workflow directory in `vault-web/workflows/`:
   ```
   vault-web/workflows/workflow_YYYYMMDD_NNN_workflow_name/
   ```

2. Create `WORKFLOW.md` with frontmatter and content

3. Run sync script:
   ```bash
   python3 scripts/sync_workflows.py
   ```

4. Refresh browser to see new workflow in Hub

## Future Enhancement: Backend API

The frontend is designed to work with a backend API at `/api/v1/docs/workflows` but currently falls back to static files. To implement the backend:

1. Create `backend/app/api/endpoints/docs.py`
2. Add routes for:
   - `GET /api/v1/docs/workflows` - List all workflows
   - `GET /api/v1/docs/workflows/{workflow_id}` - Get workflow content
3. Register router in `backend/app/api/router.py`
4. Read from `vault-web/workflows/` or database
