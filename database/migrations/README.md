# Database Migrations for Content Storage

This directory contains SQL migrations to move markdown content from filesystem to Supabase database.

## Migration Files

1. **002_add_content_columns.sql** - Adds `content`, `raw_content`, and `frontmatter` columns to existing tables
2. **003_create_content_references.sql** - Creates `content_references` table for storing reference documentation

## How to Run Migrations

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `002_add_content_columns.sql`
5. Click **Run** to execute
6. Repeat for `003_create_content_references.sql`

### Option 2: Supabase CLI

```bash
# From project root
supabase db push

# Or execute specific file
supabase db execute -f database/migrations/002_add_content_columns.sql
supabase db execute -f database/migrations/003_create_content_references.sql
```

## Verification

After running migrations, verify the changes:

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

## What These Migrations Do

### Migration 002: Add Content Columns

- Adds `content` (TEXT) - Parsed markdown without frontmatter
- Adds `raw_content` (TEXT) - Original markdown with frontmatter
- Adds `frontmatter` (JSONB) - Parsed YAML frontmatter
- Creates full-text search indexes for future search features

### Migration 003: Create References Table

- Creates `content_references` table for storing reference docs
- Polymorphic design supports workflows, skills, MCP servers, subagents
- Includes Row Level Security (RLS) policies
- Users can only edit references for content they own

## Next Steps

After running migrations:

1. Run the content migration script: `node scripts/migrate-content-to-supabase.js`
2. Verify content was uploaded successfully
3. Update frontend to read from database instead of files
