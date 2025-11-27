-- Migration 004: Add file type metadata columns to content_references
-- Date: 2025-11-27
-- Purpose: Support mixed file types (markdown + binary files) in references

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

-- Add comment for documentation
COMMENT ON COLUMN content_references.file_type IS 'File extension or type (e.g., pdf, png, docx, md)';
COMMENT ON COLUMN content_references.is_markdown IS 'Flag to distinguish markdown files from binary files';
