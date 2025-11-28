-- Migration 006: Add file_path column to content_references
-- Date: 2025-11-28
-- Purpose: Store the original file path to preserve subdirectory structure
--          (e.g., "references/examples/example-workflow.md" vs "references/setup.md")

-- Add file_path column
ALTER TABLE content_references
  ADD COLUMN IF NOT EXISTS file_path VARCHAR(500);

-- Update existing records: set file_path to name for backward compatibility
-- Files directly in references/ will have file_path = "references/{name}"
UPDATE content_references
SET file_path = 'references/' || name
WHERE file_path IS NULL;

-- Create index for path-based queries
CREATE INDEX IF NOT EXISTS idx_content_references_file_path
ON content_references(file_path);

-- Add comment for documentation
COMMENT ON COLUMN content_references.file_path IS 'Original relative file path within the skill/workflow bundle (e.g., references/examples/example.md)';
