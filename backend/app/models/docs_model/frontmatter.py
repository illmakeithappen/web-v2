"""YAML frontmatter parsing and validation utilities."""

import re
from typing import Tuple, Dict, Any
from datetime import datetime

import yaml


# Regex to extract YAML frontmatter
FRONTMATTER_PATTERN = re.compile(
    r'^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$',
    re.MULTILINE
)


def parse_frontmatter(content: str) -> Tuple[Dict[str, Any], str]:
    """
    Parse YAML frontmatter from markdown content.

    Args:
        content: Raw markdown file content with frontmatter

    Returns:
        Tuple of (frontmatter_dict, markdown_content)

    Raises:
        ValueError: If frontmatter is missing or invalid YAML
    """
    match = FRONTMATTER_PATTERN.match(content)
    if not match:
        # Return empty frontmatter if none found
        return {}, content.strip()

    yaml_str, markdown = match.groups()

    try:
        frontmatter = yaml.safe_load(yaml_str) or {}
    except yaml.YAMLError as e:
        raise ValueError(f"Invalid YAML frontmatter: {e}")

    return frontmatter, markdown.strip()


def serialize_frontmatter(frontmatter: Dict[str, Any], content: str) -> str:
    """
    Serialize frontmatter and content back to markdown file format.

    Args:
        frontmatter: Dictionary of frontmatter fields
        content: Markdown content (without frontmatter)

    Returns:
        Complete markdown file content with YAML frontmatter
    """
    # Custom representer for cleaner YAML output
    def str_representer(dumper, data):
        if '\n' in data:
            return dumper.represent_scalar('tag:yaml.org,2002:str', data, style='|')
        return dumper.represent_scalar('tag:yaml.org,2002:str', data)

    yaml.add_representer(str, str_representer)

    yaml_str = yaml.dump(
        frontmatter,
        default_flow_style=False,
        allow_unicode=True,
        sort_keys=False,
        width=1000  # Prevent line wrapping
    )

    return f"---\n{yaml_str}---\n\n{content}"


def enrich_frontmatter(
    frontmatter: Dict[str, Any],
    doc_id: str,
    is_new: bool = False
) -> Dict[str, Any]:
    """
    Enrich frontmatter with auto-generated fields.

    Args:
        frontmatter: Existing frontmatter dictionary
        doc_id: Document identifier (should match directory name)
        is_new: Whether this is a new document

    Returns:
        Enriched frontmatter dictionary
    """
    enriched = frontmatter.copy()

    # Ensure ID field exists (various naming conventions)
    if 'id' not in enriched and 'workflow_id' not in enriched and 'skill_id' not in enriched and 'tool_id' not in enriched:
        enriched['id'] = doc_id

    # Set timestamps
    now = datetime.utcnow().isoformat()
    if is_new or 'created_date' not in enriched:
        enriched['created_date'] = now
    enriched['last_modified'] = now

    return enriched


def extract_id_from_frontmatter(frontmatter: Dict[str, Any], fallback_id: str) -> str:
    """
    Extract document ID from frontmatter, handling different naming conventions.

    Args:
        frontmatter: Frontmatter dictionary
        fallback_id: ID to use if none found in frontmatter

    Returns:
        Document ID string
    """
    # Check various ID field names
    for key in ['id', 'workflow_id', 'skill_id', 'tool_id']:
        if key in frontmatter:
            return str(frontmatter[key])
    return fallback_id
