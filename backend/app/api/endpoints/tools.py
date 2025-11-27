"""
Tools API endpoints - reads from markdown files with YAML frontmatter
"""
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pathlib import Path
import yaml

router = APIRouter()

# Path to tools directory (in vault-web)
# Go from endpoints/ -> api/ -> app/ -> backend/ -> web/
TOOLS_DIR = Path(__file__).parent.parent.parent.parent.parent / "vault-web" / "tools"

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

def load_tools_from_files():
    """
    Load all tool files from vault-web/tools directory
    Looks for TOOL.md files in subdirectories (e.g., langchain/TOOL.md)
    """
    tools = []

    if not TOOLS_DIR.exists():
        print(f"Tools directory not found: {TOOLS_DIR}")
        return tools

    # Find all TOOL.md files in subdirectories
    markdown_files = list(TOOLS_DIR.glob("*/TOOL.md"))

    for file_path in markdown_files:
        # Get tool directory name (e.g., "langchain" from "langchain/TOOL.md")
        tool_dir_name = file_path.parent.name

        frontmatter, content, frontmatter_yaml = parse_markdown_frontmatter(file_path)

        if not frontmatter:
            continue

        # Transform frontmatter to API format
        # Use tool directory name as tool_id if not specified in frontmatter
        tool = {
            "tool_id": frontmatter.get("tool_id", tool_dir_name),
            "name": frontmatter.get("name", "Untitled Tool"),
            "description": frontmatter.get("description", ""),
            "category": frontmatter.get("category", "general"),
            "tags": frontmatter.get("tags", []),
            "capabilities": frontmatter.get("capabilities", []),
            "pricing": frontmatter.get("pricing", "Unknown"),
            "language": frontmatter.get("language", ""),
            "compatibility": frontmatter.get("compatibility", []),
            "install_url": frontmatter.get("install_url", ""),
            "documentation_url": frontmatter.get("documentation_url", ""),
            "github_url": frontmatter.get("github_url", ""),
            "status": frontmatter.get("status", "draft"),
            "version": frontmatter.get("version", "1.0"),
            "created_date": frontmatter.get("created_date", ""),
            "author": frontmatter.get("author", "Unknown"),
            "file_path": str(file_path),
            "content": content,  # Store full content for detail view
            "frontmatter_yaml": frontmatter_yaml  # Store raw YAML for preview
        }

        tools.append(tool)

    # Sort by name alphabetically
    tools.sort(key=lambda x: x.get("name", "").lower())

    return tools

@router.get("")
async def get_tools(
    limit: Optional[int] = 100,
    offset: Optional[int] = 0,
    category: Optional[str] = None,
    status: Optional[str] = None
):
    """
    Get list of tools from markdown files with optional filtering
    """
    try:
        # Load tools from files
        tools = load_tools_from_files()

        # Apply filters
        if category:
            tools = [t for t in tools if t["category"] == category]
        if status:
            tools = [t for t in tools if t["status"] == status]

        # Apply pagination
        total = len(tools)
        tools = tools[offset:offset + limit]

        # Remove content from list view (too large)
        for tool in tools:
            if "content" in tool:
                del tool["content"]

        return {
            "success": True,
            "tools": tools,
            "total": total,
            "limit": limit,
            "offset": offset
        }
    except Exception as e:
        print(f"Error in get_tools: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{tool_id}")
async def get_tool(tool_id: str):
    """
    Get a specific tool by ID with full content
    """
    try:
        # Load all tools
        tools = load_tools_from_files()

        # Find the requested tool
        tool = next((t for t in tools if t["tool_id"] == tool_id), None)

        if not tool:
            raise HTTPException(status_code=404, detail="Tool not found")

        return {
            "success": True,
            "tool": tool
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_tool: {e}")
        raise HTTPException(status_code=500, detail=str(e))
