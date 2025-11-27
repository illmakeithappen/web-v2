"""
Subagents API endpoints - reads from markdown files with YAML frontmatter
"""
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime
from pathlib import Path
import yaml
import re

router = APIRouter()

# Path to subagents directory (in vault-web)
# Go from endpoints/ -> api/ -> app/ -> backend/ -> web/
SUBAGENTS_DIR = Path(__file__).parent.parent.parent.parent.parent / "vault-web" / "subagents"

def parse_markdown_frontmatter(file_path: Path):
    """
    Parse YAML frontmatter from markdown file
    Returns (frontmatter_dict, content_body, frontmatter_yaml_str)
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if file starts with frontmatter delimiter
        if not content.startswith('---'):
            return None, content, ""

        # Split frontmatter and content
        parts = content.split('---', 2)
        if len(parts) < 3:
            return None, content, ""

        frontmatter_str = parts[1].strip()
        content_body = parts[2].strip()

        # Parse YAML frontmatter
        frontmatter = yaml.safe_load(frontmatter_str)

        return frontmatter, content_body, frontmatter_str

    except Exception as e:
        print(f"Error parsing {file_path}: {e}")
        return None, "", ""

def _get_subagent_directory(subagent_dir_name: str) -> Optional[Path]:
    """
    Get the directory path for a subagent's supporting files.
    Directory name is the subagent subdirectory (e.g., "research-specialist").
    """
    subagent_dir = SUBAGENTS_DIR / subagent_dir_name
    if subagent_dir.exists() and subagent_dir.is_dir():
        return subagent_dir
    return None

def _load_reference_files(subagent_dir: Path) -> List[dict]:
    """Load all markdown files from references/ subdirectory"""
    references = []
    references_dir = subagent_dir / "references"

    if not references_dir.exists():
        return references

    for md_file in sorted(references_dir.glob("*.md")):
        try:
            content = md_file.read_text(encoding='utf-8')
            # Extract title from first heading or use filename
            title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
            title = title_match.group(1) if title_match else md_file.stem.replace('-', ' ').replace('_', ' ').title()

            references.append({
                "filename": md_file.name,
                "title": title,
                "content": content
            })
        except Exception as e:
            print(f"Error loading reference file {md_file}: {e}")

    return references

def load_subagents_from_files():
    """
    Load all subagent files from vault-web/subagents directory
    Looks for SUBAGENT.md files in subdirectories (e.g., research-specialist/SUBAGENT.md)
    """
    subagents = []

    if not SUBAGENTS_DIR.exists():
        print(f"Subagents directory not found: {SUBAGENTS_DIR}")
        return subagents

    # Find all SUBAGENT.md files in subdirectories
    markdown_files = list(SUBAGENTS_DIR.glob("*/SUBAGENT.md"))

    for file_path in markdown_files:
        # Get subagent directory name (e.g., "research-specialist" from "research-specialist/SUBAGENT.md")
        subagent_dir_name = file_path.parent.name

        frontmatter, content, frontmatter_yaml = parse_markdown_frontmatter(file_path)

        if not frontmatter:
            continue

        # Transform frontmatter to API format
        # Use subagent directory name as subagent_id if not specified in frontmatter
        subagent = {
            "subagent_id": frontmatter.get("subagent_id", subagent_dir_name),
            "subagent_name": frontmatter.get("name", frontmatter.get("title", "Untitled Subagent")),
            "description": frontmatter.get("description", ""),
            "agent_type": frontmatter.get("agent_type", "specialist"),
            "category": frontmatter.get("category", "general"),
            "difficulty": frontmatter.get("difficulty", "beginner"),
            "language": frontmatter.get("language", "general"),
            "estimated_setup_time": frontmatter.get("estimated_setup_time", "Unknown"),
            "tags": frontmatter.get("tags", []),
            "status": frontmatter.get("status", "draft"),
            "created_date": frontmatter.get("created_date", ""),
            "created_by": frontmatter.get("author", "Unknown"),
            "version": frontmatter.get("version", "1.0"),
            "model": frontmatter.get("model", ""),
            "primary_use_case": frontmatter.get("primary_use_case", ""),
            "communication_pattern": frontmatter.get("communication_pattern", "direct-invocation"),
            "single_responsibility": frontmatter.get("single_responsibility", ""),
            "prerequisites": frontmatter.get("prerequisites", []),
            "tools_required": frontmatter.get("tools_required", []),
            "supported_platforms": frontmatter.get("supported_platforms", []),
            "usage_count": frontmatter.get("usage_count", 0),
            # Marketplace integration fields (optional)
            "organization": frontmatter.get("organization", ""),
            "repository": frontmatter.get("repository", ""),
            "license": frontmatter.get("license", ""),
            "keywords": frontmatter.get("keywords", []),
            "compatibility": frontmatter.get("compatibility", []),
            "installation_method": frontmatter.get("installation_method", ""),
            "references": frontmatter.get("references", []),
            "file_path": str(file_path),
            "content": content,  # Store full content for detail view
            "frontmatter_yaml": frontmatter_yaml  # Store raw YAML for preview
        }

        subagents.append(subagent)

    # Sort by created_date (newest first)
    subagents.sort(key=lambda x: x.get("created_date", ""), reverse=True)

    return subagents

@router.get("")
async def get_subagents(
    limit: Optional[int] = 100,
    offset: Optional[int] = 0,
    agent_type: Optional[str] = None,
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    communication_pattern: Optional[str] = None,
    status: Optional[str] = None
):
    """
    Get list of subagents from markdown files with optional filtering
    """
    try:
        # Load subagents from files
        subagents = load_subagents_from_files()

        # Apply filters
        if agent_type:
            subagents = [s for s in subagents if s["agent_type"] == agent_type]
        if category:
            subagents = [s for s in subagents if s["category"] == category]
        if difficulty:
            subagents = [s for s in subagents if s["difficulty"] == difficulty]
        if communication_pattern:
            subagents = [s for s in subagents if s["communication_pattern"] == communication_pattern]
        if status:
            subagents = [s for s in subagents if s["status"] == status]

        # Apply pagination
        total = len(subagents)
        subagents = subagents[offset:offset + limit]

        # Remove content from list view (too large)
        for subagent in subagents:
            if "content" in subagent:
                del subagent["content"]

        return {
            "success": True,
            "subagents": subagents,
            "total": total,
            "limit": limit,
            "offset": offset
        }
    except Exception as e:
        print(f"Error in get_subagents: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{subagent_id}")
async def get_subagent(subagent_id: str):
    """
    Get a specific subagent by ID with full content and reference files
    """
    try:
        # Load all subagents
        subagents = load_subagents_from_files()

        # Find the requested subagent
        subagent = next((s for s in subagents if s["subagent_id"] == subagent_id), None)

        if not subagent:
            raise HTTPException(status_code=404, detail="Subagent not found")

        # Get subagent directory using the subagent_id (which is the directory name)
        subagent_dir = _get_subagent_directory(subagent_id)

        # Load reference files if directory exists
        if subagent_dir:
            subagent["reference_files"] = _load_reference_files(subagent_dir)
        else:
            # No subdirectory - backward compatible
            subagent["reference_files"] = []

        return {
            "success": True,
            "subagent": subagent
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_subagent: {e}")
        raise HTTPException(status_code=500, detail=str(e))
