# ZIP File Upload Guide

## Overview

You can now upload workflows, skills, MCP servers, and subagents as ZIP files directly to Supabase via the UI. This is especially useful for content with reference files (like MCP servers and subagents).

## Supported File Types

### Option 1: Single Markdown File
- Upload a single `.md` file
- Best for: Workflows and Skills without references

### Option 2: ZIP Archive
- Upload a `.zip` file containing:
  - Main file (`WORKFLOW.md`, `SKILL.md`, `MCP.md`, or `SUBAGENT.md`)
  - Optional `references/` folder with additional `.md` files
- Best for: MCP servers and subagents with documentation

## ZIP File Structure

### Workflows
```
my-workflow.zip
├── WORKFLOW.md          # Required: Main workflow file
└── references/          # Optional: Additional documentation
    ├── guide.md
    └── examples.md
```

### Skills
```
my-skill.zip
├── SKILL.md            # Required: Main skill file
└── references/         # Optional: Additional documentation
    └── usage-guide.md
```

### MCP Servers
```
my-mcp-server.zip
├── MCP.md              # Required: Main MCP server documentation
└── references/         # Optional: Setup guides and examples
    ├── setup-guide.md
    ├── security-best-practices.md
    └── examples.md
```

### Subagents
```
my-subagent.zip
├── SUBAGENT.md         # Required: Main subagent specification
└── references/         # Optional: Implementation guides
    ├── usage-patterns.md
    └── examples.md
```

## How to Upload via UI

### Step 1: Navigate to Docs
1. Open `http://localhost:3002/doc` (or `https://gitthub.org/doc` in production)
2. Log in if required

### Step 2: Open Upload Modal
1. Press `⌘K` (Mac) or `Ctrl+K` (Windows/Linux)
2. Click "Upload New..." at the top of the list

### Step 3: Select Section
Choose what type of content you're uploading:
- Workflows
- Skills
- MCP Servers
- Subagents

### Step 4: Upload File

**Drag & Drop**:
1. Create your ZIP file or prepare your `.md` file
2. Drag it onto the drop zone
3. Modal will automatically detect file type

**Or Click to Browse**:
1. Click the drop zone
2. Select `.md` or `.zip` file

### Step 5: Review Content

The modal will show:
- **File type**: "Markdown file" or "ZIP archive (X files)"
- **Metadata preview**: Title, description, category, tags, etc.
- **Reference files** (if ZIP): List of included reference documents
- **Auto-generated name**: From frontmatter or filename (editable)

### Step 6: Confirm Upload

1. Review/edit the name
2. Click "Upload to Supabase"
3. Wait for success message
4. Content appears immediately in Docs section

## Creating a ZIP File

### On macOS/Linux:
```bash
# Navigate to your content folder
cd /path/to/my-mcp-server/

# Create ZIP with main file and references
zip -r my-mcp-server.zip MCP.md references/
```

### On Windows (PowerShell):
```powershell
# Navigate to your content folder
cd C:\path\to\my-mcp-server

# Create ZIP with main file and references
Compress-Archive -Path MCP.md,references -DestinationPath my-mcp-server.zip
```

### Using File Manager:
1. Select the main file (`WORKFLOW.md`, `MCP.md`, etc.)
2. If you have references, also select the `references/` folder
3. Right-click → "Compress" or "Send to → Compressed folder"
4. Rename to `my-content.zip`

## Example: Upload MCP Server with References

Let's say you have this structure:
```
filesystem-mcp-server/
├── MCP.md
└── references/
    ├── setup-guide.md
    └── security-best-practices.md
```

### Create ZIP:
```bash
cd filesystem-mcp-server/
zip -r ../filesystem-mcp.zip MCP.md references/
cd ..
```

### Upload via UI:
1. Go to `http://localhost:3002/doc`
2. Press `⌘K`
3. Click "Upload New..."
4. Select "MCP Servers" section
5. Drag `filesystem-mcp.zip` onto drop zone
6. Modal shows:
   - ✓ ZIP archive (3 files)
   - Metadata from MCP.md frontmatter
   - Reference files: setup-guide.md, security-best-practices.md
7. Name auto-filled: "Filesystem MCP Server"
8. Click "Upload to Supabase"
9. Success! All 3 files uploaded

### Result in Supabase:
- **mcp_servers table**: 1 new row with MCP.md content
- **content_references table**: 2 new rows (setup-guide.md, security-best-practices.md)

### Result in UI:
- Navigate to MCP Servers section
- Select "Filesystem MCP Server"
- View main documentation (MCP.md)
- References automatically linked and browsable

## Frontmatter Requirements

### All Content Types:
```yaml
---
title: Your Content Title          # Required
description: Brief description     # Required
category: general                  # Required
difficulty: beginner               # Optional (beginner|intermediate|advanced)
tags: [tag1, tag2]                # Optional
---
```

### Additional Workflow Fields:
```yaml
total_steps: 5                     # Optional
workflow_type: deployment          # Optional
```

### Additional MCP Server Fields:
```yaml
npm_package: "@modelcontextprotocol/server-filesystem"  # Optional
capabilities: [tools, resources]   # Optional
```

## What Happens on Upload

1. **Parse File**: Extract main file and references (if ZIP)
2. **Parse Frontmatter**: Extract metadata from YAML
3. **Create Record**: Insert into appropriate Supabase table
4. **Upload References**: If ZIP has references, create in `content_references` table
5. **Link References**: Associate with parent record via `parent_id`
6. **Display**: Content immediately visible in Docs and Hub sections

## Upload vs Migration Script

### Use UI Upload When:
- ✅ Adding a single new workflow/skill/MCP/subagent
- ✅ You want visual feedback and metadata preview
- ✅ You're not technical or prefer GUI
- ✅ Testing/prototyping new content

### Use Migration Script When:
- ✅ Bulk uploading many items at once
- ✅ Initial database setup (migrating existing content)
- ✅ Automating uploads in CI/CD pipeline
- ✅ You're comfortable with command line

```bash
# Migration script for bulk upload
npm run migrate-content
```

## Troubleshooting

### Issue: "ZIP must contain a WORKFLOW.md file"

**Cause**: ZIP doesn't have the required main file

**Solution**:
- Workflows need `WORKFLOW.md`
- Skills need `SKILL.md`
- MCP servers need `MCP.md`
- Subagents need `SUBAGENT.md`

File names are case-sensitive!

### Issue: "Failed to parse ZIP"

**Cause**: Corrupted or invalid ZIP file

**Solution**:
1. Extract ZIP locally to verify contents
2. Re-create ZIP using compression tool
3. Ensure no hidden files or macOS metadata (`__MACOSX` folder)

### Issue: References not showing up

**Cause**: References not in `references/` folder

**Solution**:
- Reference files MUST be in a folder named `references/`
- Path must be `references/your-file.md`, not just `your-file.md`

### Issue: Upload succeeds but content not visible

**Cause**: Browser cache or not refreshed

**Solution**:
1. Refresh page (`⌘R` or `Ctrl+R`)
2. Clear browser cache
3. Check database: `npm run check-db`

## Testing Your Upload

After uploading, verify it worked:

### Check Database:
```bash
npm run check-db
```

Look for:
```
📋 Workflows:
   Total: 4  (was 3)
   With content: 1  ✅ (was 0)
```

### Check UI:
1. Go to Docs section
2. Press `⌘K`
3. Search for your upload
4. Click to view
5. Content should display from database

### Check References:
1. Select your MCP server or subagent
2. Look for reference files in navigation
3. Click on references to view

## Best Practices

1. **Always include frontmatter** - Makes content searchable and filterable
2. **Use descriptive names** - Easier to find in search
3. **Add tags** - Improves discoverability
4. **Test locally first** - Create ZIP, extract, verify structure
5. **Keep references organized** - All in `references/` folder
6. **Use consistent naming** - Lowercase, hyphens, descriptive

## Summary

**Single Markdown File**:
- Drag `.md` file → Upload
- Best for simple workflows/skills

**ZIP Archive**:
- Create ZIP with main file + `references/` folder
- Drag ZIP file → Upload
- Best for MCP servers/subagents with docs

**Both methods**:
- Upload directly to Supabase
- Instant visibility in UI
- Full edit support with TOAST UI
- Changes save to database

---

**Next**: Learn how to [edit uploaded content](CONTENT_MIGRATION_README.md#edit-mode)
