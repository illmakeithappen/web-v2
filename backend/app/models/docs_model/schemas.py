"""Pydantic schemas for docs content management."""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class DocSection(str, Enum):
    """Available documentation sections."""
    WORKFLOWS = "workflows"
    SKILLS = "skills"
    MCP = "mcp"
    SUBAGENTS = "subagents"


class Difficulty(str, Enum):
    """Difficulty levels for content."""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


# Section to filename mapping
SECTION_FILES = {
    DocSection.WORKFLOWS: "WORKFLOW.md",
    DocSection.SKILLS: "SKILL.md",
    DocSection.MCP: "MCP.md",
    DocSection.SUBAGENTS: "SUBAGENT.md",
}


class DocMetadata(BaseModel):
    """Metadata for catalog listing (no content)."""
    id: str
    name: str
    description: str = ""
    category: str = "uncategorized"
    tags: List[str] = Field(default_factory=list)
    difficulty: Optional[str] = None
    section: DocSection
    has_subdirectory: bool = False
    file_count: int = 0
    # Workflow-specific fields (optional, populated from frontmatter)
    estimated_time: Optional[str] = None
    agent: Optional[str] = None
    model: Optional[str] = None
    steps: List[str] = Field(default_factory=list)
    created_date: Optional[str] = None
    author: Optional[str] = None
    status: Optional[str] = None


class DocEntry(BaseModel):
    """Full document entry with content."""
    metadata: DocMetadata
    frontmatter: Dict[str, Any]
    content: str  # Markdown content without frontmatter
    raw: str  # Original file content


class DocFile(BaseModel):
    """Subdirectory file info."""
    name: str
    path: str  # Relative path from doc root
    size: int
    is_directory: bool
    modified_at: datetime


class DocFileContent(BaseModel):
    """Subdirectory file with content."""
    file: DocFile
    content: str


class DocListResponse(BaseModel):
    """Response for listing docs in a section."""
    section: DocSection
    count: int
    items: List[DocMetadata]


class CreateDocRequest(BaseModel):
    """Request to create a new document."""
    id: str = Field(..., pattern=r"^[a-z0-9_-]+$", description="URL-safe identifier")
    frontmatter: Dict[str, Any] = Field(..., description="YAML frontmatter fields")
    content: str = Field(..., description="Markdown content")


class UpdateDocRequest(BaseModel):
    """Request to update an existing document."""
    frontmatter: Optional[Dict[str, Any]] = None
    content: Optional[str] = None


class SyncResponse(BaseModel):
    """Response from sync operations."""
    success: bool
    sections_synced: List[str]
    files_processed: int
    manifest_updated: bool = True
    errors: List[str] = Field(default_factory=list)
