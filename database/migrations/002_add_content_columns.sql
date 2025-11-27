-- Migration: Add content storage columns to existing tables
-- Purpose: Store markdown content directly in database instead of referencing files
-- Date: 2025-11-27

-- Add content columns to workflows table
ALTER TABLE workflows
  ADD COLUMN IF NOT EXISTS content TEXT,
  ADD COLUMN IF NOT EXISTS raw_content TEXT,
  ADD COLUMN IF NOT EXISTS frontmatter JSONB DEFAULT '{}'::jsonb;

-- Add content columns to skills table (content column already exists)
ALTER TABLE skills
  ADD COLUMN IF NOT EXISTS raw_content TEXT,
  ADD COLUMN IF NOT EXISTS frontmatter JSONB DEFAULT '{}'::jsonb;

-- Add content columns to mcp_servers table
ALTER TABLE mcp_servers
  ADD COLUMN IF NOT EXISTS content TEXT,
  ADD COLUMN IF NOT EXISTS raw_content TEXT,
  ADD COLUMN IF NOT EXISTS frontmatter JSONB DEFAULT '{}'::jsonb;

-- Add content columns to subagents table
ALTER TABLE subagents
  ADD COLUMN IF NOT EXISTS content TEXT,
  ADD COLUMN IF NOT EXISTS raw_content TEXT,
  ADD COLUMN IF NOT EXISTS frontmatter JSONB DEFAULT '{}'::jsonb;

-- Create indexes for full-text search (optional, for future search features)
CREATE INDEX IF NOT EXISTS idx_workflows_content_search
  ON workflows USING GIN(to_tsvector('english', content));

CREATE INDEX IF NOT EXISTS idx_skills_content_search
  ON skills USING GIN(to_tsvector('english', content));

CREATE INDEX IF NOT EXISTS idx_mcp_servers_content_search
  ON mcp_servers USING GIN(to_tsvector('english', content));

CREATE INDEX IF NOT EXISTS idx_subagents_content_search
  ON subagents USING GIN(to_tsvector('english', content));

-- Add comments to document the new columns
COMMENT ON COLUMN workflows.content IS 'Parsed markdown content (without frontmatter)';
COMMENT ON COLUMN workflows.raw_content IS 'Original markdown with frontmatter';
COMMENT ON COLUMN workflows.frontmatter IS 'Parsed YAML frontmatter as JSON';

COMMENT ON COLUMN skills.raw_content IS 'Original markdown with frontmatter';
COMMENT ON COLUMN skills.frontmatter IS 'Parsed YAML frontmatter as JSON';

COMMENT ON COLUMN mcp_servers.content IS 'Parsed markdown content (without frontmatter)';
COMMENT ON COLUMN mcp_servers.raw_content IS 'Original markdown with frontmatter';
COMMENT ON COLUMN mcp_servers.frontmatter IS 'Parsed YAML frontmatter as JSON';

COMMENT ON COLUMN subagents.content IS 'Parsed markdown content (without frontmatter)';
COMMENT ON COLUMN subagents.raw_content IS 'Original markdown with frontmatter';
COMMENT ON COLUMN subagents.frontmatter IS 'Parsed YAML frontmatter as JSON';
