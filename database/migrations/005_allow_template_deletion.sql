-- Migration: Allow authenticated users to delete templates
-- Purpose: Update RLS policies to allow deletion of is_template=true records
-- Date: 2025-11-28

-- =====================================================
-- UPDATE SKILLS TABLE DELETE POLICY
-- =====================================================

-- Drop existing delete policy if exists
DROP POLICY IF EXISTS "Users can delete own skills" ON skills;
DROP POLICY IF EXISTS "Users can delete skills" ON skills;

-- Create new policy: Users can delete their own skills OR any template
CREATE POLICY "Users can delete skills"
  ON skills FOR DELETE
  USING (
    auth.uid() = user_id
    OR is_template = true
  );

-- =====================================================
-- UPDATE WORKFLOWS TABLE DELETE POLICY
-- =====================================================

DROP POLICY IF EXISTS "Users can delete own workflows" ON workflows;
DROP POLICY IF EXISTS "Users can delete workflows" ON workflows;

CREATE POLICY "Users can delete workflows"
  ON workflows FOR DELETE
  USING (
    auth.uid() = user_id
    OR is_template = true
  );

-- =====================================================
-- UPDATE MCP_SERVERS TABLE DELETE POLICY
-- =====================================================

DROP POLICY IF EXISTS "Users can delete own mcp_servers" ON mcp_servers;
DROP POLICY IF EXISTS "Users can delete mcp_servers" ON mcp_servers;

CREATE POLICY "Users can delete mcp_servers"
  ON mcp_servers FOR DELETE
  USING (
    auth.uid() = user_id
    OR is_template = true
  );

-- =====================================================
-- UPDATE SUBAGENTS TABLE DELETE POLICY
-- =====================================================

DROP POLICY IF EXISTS "Users can delete own subagents" ON subagents;
DROP POLICY IF EXISTS "Users can delete subagents" ON subagents;

CREATE POLICY "Users can delete subagents"
  ON subagents FOR DELETE
  USING (
    auth.uid() = user_id
    OR is_template = true
  );

-- =====================================================
-- UPDATE CONTENT_REFERENCES DELETE POLICY
-- =====================================================

-- Drop existing delete policy
DROP POLICY IF EXISTS "Users can delete references for own content" ON content_references;

-- Create new policy: Users can delete references for own content OR templates
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

-- Add comment
COMMENT ON POLICY "Users can delete skills" ON skills IS 'Allows users to delete their own skills and any template skills';
COMMENT ON POLICY "Users can delete workflows" ON workflows IS 'Allows users to delete their own workflows and any template workflows';
COMMENT ON POLICY "Users can delete mcp_servers" ON mcp_servers IS 'Allows users to delete their own MCP servers and any template MCP servers';
COMMENT ON POLICY "Users can delete subagents" ON subagents IS 'Allows users to delete their own subagents and any template subagents';
