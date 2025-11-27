-- Migration: Create content_references table for reference documentation
-- Purpose: Store additional markdown files (MCP server references, subagent references)
-- Date: 2025-11-27

-- Create content_references table
CREATE TABLE IF NOT EXISTS content_references (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Polymorphic reference to parent content
  parent_type VARCHAR(50) NOT NULL,  -- 'workflow', 'skill', 'mcp_server', 'subagent'
  parent_id UUID NOT NULL,

  -- Reference file details
  name VARCHAR(255) NOT NULL,  -- Original filename (e.g., 'setup-guide.md')
  title VARCHAR(255),          -- Human-readable title (from frontmatter)
  description TEXT,            -- Optional description (from frontmatter)
  order_index INTEGER DEFAULT 0,  -- For maintaining file order

  -- Content
  content TEXT NOT NULL,       -- Parsed markdown content (without frontmatter)
  raw_content TEXT,            -- Original markdown with frontmatter
  frontmatter JSONB DEFAULT '{}'::jsonb,  -- Parsed YAML frontmatter as JSON

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure unique reference per parent
  UNIQUE(parent_type, parent_id, name)
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_content_references_parent
  ON content_references(parent_type, parent_id);

CREATE INDEX IF NOT EXISTS idx_content_references_name
  ON content_references(name);

CREATE INDEX IF NOT EXISTS idx_content_references_order
  ON content_references(parent_type, parent_id, order_index);

-- Enable Row Level Security
ALTER TABLE content_references ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Users can view references for content they can access
CREATE POLICY "Users can view references for accessible content"
  ON content_references FOR SELECT
  USING (
    CASE parent_type
      WHEN 'workflow' THEN EXISTS (
        SELECT 1 FROM workflows
        WHERE id = parent_id
        AND (auth.uid() = user_id OR is_template = true)
      )
      WHEN 'skill' THEN EXISTS (
        SELECT 1 FROM skills
        WHERE id = parent_id
        AND (auth.uid() = user_id OR is_template = true)
      )
      WHEN 'mcp_server' THEN EXISTS (
        SELECT 1 FROM mcp_servers
        WHERE id = parent_id
        AND (auth.uid() = user_id OR is_template = true)
      )
      WHEN 'subagent' THEN EXISTS (
        SELECT 1 FROM subagents
        WHERE id = parent_id
        AND (auth.uid() = user_id OR is_template = true)
      )
      ELSE false
    END
  );

-- Create RLS policy: Users can insert references for their own content
CREATE POLICY "Users can insert references for own content"
  ON content_references FOR INSERT
  WITH CHECK (
    CASE parent_type
      WHEN 'workflow' THEN EXISTS (
        SELECT 1 FROM workflows
        WHERE id = parent_id
        AND auth.uid() = user_id
      )
      WHEN 'skill' THEN EXISTS (
        SELECT 1 FROM skills
        WHERE id = parent_id
        AND auth.uid() = user_id
      )
      WHEN 'mcp_server' THEN EXISTS (
        SELECT 1 FROM mcp_servers
        WHERE id = parent_id
        AND auth.uid() = user_id
      )
      WHEN 'subagent' THEN EXISTS (
        SELECT 1 FROM subagents
        WHERE id = parent_id
        AND auth.uid() = user_id
      )
      ELSE false
    END
  );

-- Create RLS policy: Users can update references for their own content
CREATE POLICY "Users can update references for own content"
  ON content_references FOR UPDATE
  USING (
    CASE parent_type
      WHEN 'workflow' THEN EXISTS (
        SELECT 1 FROM workflows
        WHERE id = parent_id
        AND auth.uid() = user_id
      )
      WHEN 'skill' THEN EXISTS (
        SELECT 1 FROM skills
        WHERE id = parent_id
        AND auth.uid() = user_id
      )
      WHEN 'mcp_server' THEN EXISTS (
        SELECT 1 FROM mcp_servers
        WHERE id = parent_id
        AND auth.uid() = user_id
      )
      WHEN 'subagent' THEN EXISTS (
        SELECT 1 FROM subagents
        WHERE id = parent_id
        AND auth.uid() = user_id
      )
      ELSE false
    END
  );

-- Create RLS policy: Users can delete references for their own content
CREATE POLICY "Users can delete references for own content"
  ON content_references FOR DELETE
  USING (
    CASE parent_type
      WHEN 'workflow' THEN EXISTS (
        SELECT 1 FROM workflows
        WHERE id = parent_id
        AND auth.uid() = user_id
      )
      WHEN 'skill' THEN EXISTS (
        SELECT 1 FROM skills
        WHERE id = parent_id
        AND auth.uid() = user_id
      )
      WHEN 'mcp_server' THEN EXISTS (
        SELECT 1 FROM mcp_servers
        WHERE id = parent_id
        AND auth.uid() = user_id
      )
      WHEN 'subagent' THEN EXISTS (
        SELECT 1 FROM subagents
        WHERE id = parent_id
        AND auth.uid() = user_id
      )
      ELSE false
    END
  );

-- Add comments to document the table
COMMENT ON TABLE content_references IS 'Stores reference documentation files for workflows, skills, MCP servers, and subagents';
COMMENT ON COLUMN content_references.parent_type IS 'Type of parent content (workflow, skill, mcp_server, subagent)';
COMMENT ON COLUMN content_references.parent_id IS 'UUID of parent content record';
COMMENT ON COLUMN content_references.name IS 'Original filename of the reference document';
COMMENT ON COLUMN content_references.order_index IS 'Display order within parent content';
