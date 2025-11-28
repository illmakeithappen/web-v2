-- =====================================================
-- COMBINED MIGRATIONS 004, 005, 006
-- Run this in Supabase SQL Editor
-- Date: 2025-11-28
-- =====================================================


-- =====================================================
-- MIGRATION 004: Add file type metadata columns
-- =====================================================

-- Add file type columns
ALTER TABLE content_references
  ADD COLUMN IF NOT EXISTS file_type VARCHAR(50),
  ADD COLUMN IF NOT EXISTS is_markdown BOOLEAN DEFAULT false;

-- Make content and raw_content nullable for non-markdown files
ALTER TABLE content_references
  ALTER COLUMN content DROP NOT NULL;

-- Update existing records (assume all current records are markdown)
UPDATE content_references
SET is_markdown = true
WHERE name LIKE '%.md' OR name LIKE '%.MD';

UPDATE content_references
SET file_type = 'markdown'
WHERE is_markdown = true;

-- Create index for file type queries
CREATE INDEX IF NOT EXISTS idx_content_references_file_type
ON content_references(file_type);

CREATE INDEX IF NOT EXISTS idx_content_references_is_markdown
ON content_references(is_markdown);

COMMENT ON COLUMN content_references.file_type IS 'File extension or type (e.g., pdf, png, docx, md)';
COMMENT ON COLUMN content_references.is_markdown IS 'Flag to distinguish markdown files from binary files';


-- =====================================================
-- MIGRATION 005: Allow template deletion
-- =====================================================

-- UPDATE SKILLS TABLE DELETE POLICY
DROP POLICY IF EXISTS "Users can delete own skills" ON skills;
DROP POLICY IF EXISTS "Users can delete skills" ON skills;

CREATE POLICY "Users can delete skills"
  ON skills FOR DELETE
  USING (
    auth.uid() = user_id
    OR is_template = true
  );

-- UPDATE WORKFLOWS TABLE DELETE POLICY
DROP POLICY IF EXISTS "Users can delete own workflows" ON workflows;
DROP POLICY IF EXISTS "Users can delete workflows" ON workflows;

CREATE POLICY "Users can delete workflows"
  ON workflows FOR DELETE
  USING (
    auth.uid() = user_id
    OR is_template = true
  );

-- UPDATE MCP_SERVERS TABLE DELETE POLICY
DROP POLICY IF EXISTS "Users can delete own mcp_servers" ON mcp_servers;
DROP POLICY IF EXISTS "Users can delete mcp_servers" ON mcp_servers;

CREATE POLICY "Users can delete mcp_servers"
  ON mcp_servers FOR DELETE
  USING (
    auth.uid() = user_id
    OR is_template = true
  );

-- UPDATE SUBAGENTS TABLE DELETE POLICY
DROP POLICY IF EXISTS "Users can delete own subagents" ON subagents;
DROP POLICY IF EXISTS "Users can delete subagents" ON subagents;

CREATE POLICY "Users can delete subagents"
  ON subagents FOR DELETE
  USING (
    auth.uid() = user_id
    OR is_template = true
  );

-- UPDATE CONTENT_REFERENCES DELETE POLICY
DROP POLICY IF EXISTS "Users can delete references for own content" ON content_references;
DROP POLICY IF EXISTS "Users can delete references" ON content_references;

CREATE POLICY "Users can delete references"
  ON content_references FOR DELETE
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

COMMENT ON POLICY "Users can delete skills" ON skills IS 'Allows users to delete their own skills and any template skills';
COMMENT ON POLICY "Users can delete workflows" ON workflows IS 'Allows users to delete their own workflows and any template workflows';
COMMENT ON POLICY "Users can delete mcp_servers" ON mcp_servers IS 'Allows users to delete their own MCP servers and any template MCP servers';
COMMENT ON POLICY "Users can delete subagents" ON subagents IS 'Allows users to delete their own subagents and any template subagents';


-- =====================================================
-- MIGRATION 006: Add file_path column
-- =====================================================

-- Add file_path column
ALTER TABLE content_references
  ADD COLUMN IF NOT EXISTS file_path VARCHAR(500);

-- Update existing records: set file_path to name for backward compatibility
UPDATE content_references
SET file_path = 'references/' || name
WHERE file_path IS NULL;

-- Create index for path-based queries
CREATE INDEX IF NOT EXISTS idx_content_references_file_path
ON content_references(file_path);

COMMENT ON COLUMN content_references.file_path IS 'Original relative file path within the skill/workflow bundle (e.g., references/examples/example.md)';


-- =====================================================
-- DONE! All migrations applied successfully.
-- =====================================================
