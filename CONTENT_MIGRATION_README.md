# Content Migration to Supabase - Implementation Summary

**Date**: November 27, 2025
**Status**: Implementation Complete, Ready for Testing

## Overview

This document describes the implementation of a complete content management system that moves markdown content from the filesystem to Supabase PostgreSQL database, enabling in-browser editing with real-time updates across the entire application.

## Architecture

### Two Display Modes

1. **Docs Section** (`/doc`)
   - Browse and edit all markdown documentation
   - WYSIWYG markdown editor with live preview
   - Edit functionality for workflows, skills, MCP servers, and subagents
   - Backend office for reading and editing detailed documentation

2. **Hub Section** (`/hub`)
   - Execute workflows step-by-step
   - Organize inputs/outputs in projects
   - Execution bench that displays content from the same database source

### Single Source of Truth

All content is now stored in Supabase with three columns per document:
- `content` - Parsed markdown (without frontmatter) for display
- `raw_content` - Original markdown with frontmatter for editing
- `frontmatter` - Parsed YAML frontmatter as JSONB for metadata queries

## Implementation Components

### 1. Database Schema (`/database/migrations/`)

#### Migration 002: Add Content Columns
**File**: `002_add_content_columns.sql`

Adds content storage columns to existing tables:
- `workflows` table: content, raw_content, frontmatter
- `skills` table: raw_content, frontmatter (content already existed)
- `mcp_servers` table: content, raw_content, frontmatter
- `subagents` table: content, raw_content, frontmatter

Also creates full-text search indexes using GIN for future search features.

#### Migration 003: Create Content References Table
**File**: `003_create_content_references.sql`

Creates polymorphic `content_references` table for storing reference documentation:
- Supports workflows, skills, MCP servers, and subagents
- Includes order_index for maintaining file order
- Full Row Level Security (RLS) policies
- Users can only edit their own instances
- Templates are read-only for all users

### 2. Migration Script

**File**: `/scripts/migrate-content-to-supabase.js`

Node.js script that:
1. Reads all markdown files from `/public/content/`
2. Parses frontmatter and content using regex
3. Matches files to existing database records by name/ID
4. Updates workflows, MCP servers, subagents with content
5. Migrates reference files to `content_references` table
6. Provides detailed console output with success/error counts

**Usage**:
```bash
npm run migrate-content
```

**Environment Variables Required**:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 3. Frontend Services

#### Template Service Updates
**File**: `/src/services/template-service.js`

**Changes**:
- `fetchWorkflowById()` - Now reads from database content columns with file fallback
- `fetchSkillById()` - Returns content directly from database
- `fetchMcpServerById()` - NEW: Fetches MCP server with references
- `fetchSubagentById()` - NEW: Fetches subagent with references

All functions now return:
```javascript
{
  success: true,
  [entity]: {
    ...data,
    content: string,      // Parsed markdown
    raw_content: string,  // Original with frontmatter
    frontmatter: object,  // Parsed YAML as JSON
    references: []        // For MCP servers and subagents
  }
}
```

#### Content Edit Service
**File**: `/src/services/content-edit-service.js`

NEW service providing:
- `updateWorkflowContent()` - Update workflow in database
- `updateSkillContent()` - Update skill in database
- `updateMcpServerContent()` - Update MCP server in database
- `updateSubagentContent()` - Update subagent in database
- `updateContentReference()` - Update reference file
- `createContentReference()` - Create new reference file
- `deleteContentReference()` - Delete reference file
- `updateContent()` - Generic router to specific update functions
- `parseFrontmatter()` - Parse YAML frontmatter from markdown
- `serializeMarkdown()` - Combine frontmatter + content to raw markdown

### 4. UI Components

#### Markdown Editor Component
**File**: `/src/components/MarkdownEditor.jsx`

React component wrapping TOAST UI Editor:
- Rich WYSIWYG markdown editing with live preview
- Vertical split view (editor | preview)
- Keyboard shortcuts (Cmd+S / Ctrl+S to save)
- Customizable height
- onChange callback for real-time updates
- onSave callback for save action

**Props**:
```javascript
<MarkdownEditor
  initialValue={string}    // Initial markdown content
  onChange={function}      // Called on content change
  onSave={function}        // Called on Cmd+S / Ctrl+S
  height="70vh"            // Editor height
  placeholder="..."        // Placeholder text
/>
```

#### Docs Page Updates
**File**: `/src/pages/Docs.jsx`

**Changes**:
- Integrated `MarkdownEditor` component for edit mode
- Connected to `content-edit-service` for database updates
- Edit button in document header (sticky positioned)
- Save/Cancel buttons in edit mode
- Unsaved changes indicator
- Keyboard shortcut support (Cmd+S to save)
- Automatic content refresh after save

**Edit Workflow**:
1. User clicks "Edit" button
2. Content loads into TOAST UI Editor
3. User edits with live preview
4. Cmd+S or "Save" button saves to database
5. UI refreshes to show updated content
6. Changes immediately visible in both Docs and Hub sections

## Dependencies

### NPM Packages Added
```json
{
  "@toast-ui/react-editor": "^3.2.3",
  "@toast-ui/editor": "^2.5.2"
}
```

Installed with:
```bash
npm install @toast-ui/react-editor @toast-ui/editor --legacy-peer-deps
```

Note: `--legacy-peer-deps` required due to React 18 compatibility.

## Deployment Steps

### Phase 1: Database Setup

1. **Run SQL Migrations in Supabase Dashboard**
   ```sql
   -- Copy and execute 002_add_content_columns.sql
   -- Copy and execute 003_create_content_references.sql
   ```

2. **Verify Migrations**
   ```sql
   -- Check workflows table columns
   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_name = 'workflows'
   AND column_name IN ('content', 'raw_content', 'frontmatter');

   -- Check content_references table exists
   SELECT table_name
   FROM information_schema.tables
   WHERE table_name = 'content_references';

   -- Check RLS policies
   SELECT policyname, tablename
   FROM pg_policies
   WHERE tablename = 'content_references';
   ```

### Phase 2: Content Migration

1. **Set Environment Variables**
   Create `.env` file in `/web-v2/`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

2. **Run Migration Script**
   ```bash
   cd /Users/gitt/hub/web-v2
   npm run migrate-content
   ```

3. **Verify Upload**
   Check console output for:
   - ✓ Migrated workflow: [name]
   - ✓ Migrated MCP server: [name]
   - ✓ Migrated subagent: [name]
   - ✓ Reference: [filename]

4. **Check Database**
   ```sql
   -- Count uploaded content
   SELECT
     (SELECT COUNT(*) FROM workflows WHERE content IS NOT NULL) as workflows,
     (SELECT COUNT(*) FROM mcp_servers WHERE content IS NOT NULL) as mcp_servers,
     (SELECT COUNT(*) FROM subagents WHERE content IS NOT NULL) as subagents,
     (SELECT COUNT(*) FROM content_references) as references;
   ```

### Phase 3: Frontend Deployment

1. **Deploy Updated Frontend**
   ```bash
   npm run build
   ```

2. **Test Locally First**
   ```bash
   npm run dev
   # Visit http://localhost:3002/doc
   ```

3. **Test Editing**
   - Navigate to Docs section
   - Select a workflow/skill/MCP server/subagent
   - Click "Edit" button
   - Make changes in TOAST UI Editor
   - Press Cmd+S or click "Save"
   - Verify changes display correctly
   - Check Hub section shows same updated content

### Phase 4: Archive Original Files (Optional)

Once verified, archive original markdown files:
```bash
cd /Users/gitt/hub/web-v2
mkdir -p _archived_content
mv public/content/* _archived_content/
# Keep public/content/docs/ for README overviews
mv _archived_content/docs public/content/
```

## Security & Permissions

### Row Level Security (RLS)

All content is protected by RLS policies:

1. **Templates** (`is_template=true, user_id=null`)
   - Read-only for all authenticated users
   - Cannot be edited or deleted
   - Serve as base templates for user instances

2. **User Instances** (`is_template=false, user_id=[uuid]`)
   - Only owner can edit/update/delete
   - Only owner can add/edit/delete references
   - RLS enforced automatically at database level

### Edit Permissions

Users can only edit:
- Workflows they own (`user_id = auth.uid()`)
- Skills they own
- MCP servers they own
- Subagents they own
- References for content they own

Templates cannot be edited - users must clone them first.

## Testing Checklist

### Database Tests
- [ ] Migrations run without errors
- [ ] All tables have new columns
- [ ] content_references table exists
- [ ] RLS policies are active
- [ ] Indexes are created

### Migration Tests
- [ ] Migration script runs successfully
- [ ] All workflows uploaded
- [ ] All MCP servers uploaded
- [ ] All subagents uploaded
- [ ] All references uploaded
- [ ] No duplicate entries
- [ ] Frontmatter parsed correctly

### Frontend Tests
- [ ] Docs page loads without errors
- [ ] Workflows display correctly
- [ ] Skills display correctly
- [ ] MCP servers display correctly
- [ ] Subagents display correctly
- [ ] References load for MCP/subagents
- [ ] Edit button appears
- [ ] Edit mode opens TOAST UI editor
- [ ] Live preview works
- [ ] Save button saves to database
- [ ] Cmd+S shortcut saves
- [ ] Cancel button discards changes
- [ ] Unsaved changes indicator works
- [ ] Content refreshes after save
- [ ] Hub section shows updated content

### Security Tests
- [ ] Users cannot edit templates
- [ ] Users can only edit own instances
- [ ] RLS prevents unauthorized access
- [ ] Database rejects invalid updates

## File Structure

```
web-v2/
├── database/
│   └── migrations/
│       ├── 002_add_content_columns.sql
│       ├── 003_create_content_references.sql
│       └── README.md
├── scripts/
│   └── migrate-content-to-supabase.js
├── src/
│   ├── components/
│   │   └── MarkdownEditor.jsx (NEW)
│   ├── pages/
│   │   └── Docs.jsx (UPDATED)
│   └── services/
│       ├── template-service.js (UPDATED)
│       └── content-edit-service.js (NEW)
├── package.json (UPDATED: added migrate-content script + TOAST UI deps)
└── CONTENT_MIGRATION_README.md (THIS FILE)
```

## Troubleshooting

### Migration Script Errors

**Issue**: "No matching workflow found for: [dir]"
- **Cause**: Directory name doesn't match database record
- **Fix**: Ensure workflows exist in database from seed script first

**Issue**: "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set"
- **Cause**: Missing environment variables
- **Fix**: Create `.env` file with Supabase credentials

### Frontend Errors

**Issue**: "Failed to load workflow"
- **Cause**: Content not yet migrated to database
- **Fix**: Run migration script first

**Issue**: "Failed to save document: Invalid content type"
- **Cause**: Trying to save in unsupported section
- **Fix**: Only workflows, skills, mcp, subagents sections support editing

### Database Errors

**Issue**: RLS policy blocks update
- **Cause**: User doesn't own the content
- **Fix**: Only edit content you own (cloned instances, not templates)

## Future Enhancements

### Planned Features
1. **Real-time Collaboration**: Multiple users editing with live cursors
2. **Version History**: Track all changes with rollback capability
3. **Change Diffs**: Visual diff showing what changed between versions
4. **Comments**: Inline commenting on specific sections
5. **Approval Workflow**: Submit changes for review before publishing
6. **Search**: Full-text search across all content using GIN indexes

### Technical Improvements
1. **Optimistic UI Updates**: Update UI before database confirmation
2. **Auto-save**: Save drafts automatically every 30 seconds
3. **Conflict Resolution**: Handle simultaneous edits gracefully
4. **Image Upload**: Drag-and-drop images with automatic S3 upload
5. **Templates**: Create new content from templates directly in UI

## Support & Contact

For questions or issues:
1. Check this README first
2. Review migration logs for specific errors
3. Verify environment variables are set correctly
4. Test locally before deploying to production

## Changelog

### v1.0.0 - November 27, 2025
- ✅ Initial implementation complete
- ✅ Database schema migrations created
- ✅ Content migration script implemented
- ✅ Frontend services updated
- ✅ TOAST UI editor integrated
- ✅ Edit mode fully functional
- ⏳ Pending: End-to-end testing

---

**Implementation Status**: Ready for Testing
**Last Updated**: November 27, 2025
