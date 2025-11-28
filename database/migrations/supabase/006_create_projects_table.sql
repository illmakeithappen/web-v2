-- Migration: Create projects table for user project canvas
-- Purpose: Store user projects with nodes, edges, and viewport data
-- Date: 2025-11-27

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- User reference
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Project metadata
  name VARCHAR(255) NOT NULL DEFAULT 'Untitled Project',
  description TEXT,
  provider VARCHAR(50) DEFAULT 'Local',

  -- Canvas data (ReactFlow)
  nodes JSONB DEFAULT '[]'::jsonb,
  edges JSONB DEFAULT '[]'::jsonb,
  viewport JSONB DEFAULT '{"x": 0, "y": 0, "zoom": 1}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_projects_user_id
  ON projects(user_id);

CREATE INDEX IF NOT EXISTS idx_projects_updated_at
  ON projects(user_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_projects_name
  ON projects(user_id, name);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "Users can create own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

-- Create RLS policy: Users can only view their own projects
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

-- Create RLS policy: Users can create their own projects
CREATE POLICY "Users can create own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policy: Users can update their own projects
CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

-- Create RLS policy: Users can delete their own projects
CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_projects_updated_at ON projects;
CREATE TRIGGER trigger_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_projects_updated_at();

-- Add comments to document the table
COMMENT ON TABLE projects IS 'User project canvas for organizing workflows, skills, MCPs, and subagents';
COMMENT ON COLUMN projects.user_id IS 'Reference to auth.users - owner of the project';
COMMENT ON COLUMN projects.nodes IS 'ReactFlow nodes array as JSON';
COMMENT ON COLUMN projects.edges IS 'ReactFlow edges array as JSON';
COMMENT ON COLUMN projects.viewport IS 'ReactFlow viewport state (x, y, zoom)';
