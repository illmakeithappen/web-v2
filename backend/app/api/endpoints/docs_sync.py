"""
Docs Content Sync Endpoint
Syncs content from vault-web to frontend/public and regenerates manifests
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pathlib import Path
import json
import shutil
import re
from typing import Dict, List, Any

router = APIRouter()


class DocumentContent(BaseModel):
    content: str
    file_path: str | None = None  # Optional: for subdirectory files like "references/deploy-guide.md"

# Base paths
VAULT_WEB_BASE = Path("/Users/gitt/hub/web/vault-web")
FRONTEND_PUBLIC_BASE = Path("/Users/gitt/hub/web/frontend/public/content")


def parse_yaml_frontmatter(content: str) -> Dict[str, Any]:
    """Extract YAML frontmatter from markdown content"""
    frontmatter_pattern = r'^---\s*\n(.*?)\n---\s*\n'
    match = re.search(frontmatter_pattern, content, re.DOTALL)

    if not match:
        return {}

    frontmatter_text = match.group(1)
    metadata = {}

    # Simple YAML parser (handles basic key: value pairs and arrays)
    current_key = None
    current_array = []
    in_array = False

    for line in frontmatter_text.split('\n'):
        line = line.strip()

        if not line:
            continue

        # Handle array items
        if line.startswith('- '):
            if in_array:
                current_array.append(line[2:].strip().strip('"').strip("'"))
            continue

        # Handle key: value pairs
        if ':' in line:
            # Save previous array if exists
            if in_array and current_key:
                metadata[current_key] = current_array
                current_array = []
                in_array = False

            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")

            if value:
                # Check if it's a multiline value marker
                if value in ['|', '>']:
                    current_key = key
                    in_array = False
                    metadata[key] = ""
                else:
                    metadata[key] = value
            else:
                # Empty value, might be start of array
                current_key = key
                in_array = True
                current_array = []

    # Save last array if exists
    if in_array and current_key:
        metadata[current_key] = current_array

    return metadata


def sync_workflows() -> List[Dict[str, Any]]:
    """Sync workflows from vault-web to frontend/public"""
    vault_workflows = VAULT_WEB_BASE / "workflows"
    public_workflows = FRONTEND_PUBLIC_BASE / "workflows"

    entries = []

    if not vault_workflows.exists():
        return entries

    # Ensure public directory exists
    public_workflows.mkdir(parents=True, exist_ok=True)

    # Get list of valid workflow IDs from vault-web
    valid_workflow_ids = set()

    # Process each workflow directory
    for workflow_dir in vault_workflows.iterdir():
        if not workflow_dir.is_dir() or workflow_dir.name.startswith('.'):
            continue

        workflow_md = workflow_dir / "WORKFLOW.md"
        if not workflow_md.exists():
            continue

        valid_workflow_ids.add(workflow_dir.name)

        # Read and parse YAML frontmatter
        try:
            content = workflow_md.read_text(encoding='utf-8')
            metadata = parse_yaml_frontmatter(content)

            # Copy workflow directory to public if it doesn't exist
            target_dir = public_workflows / workflow_dir.name
            if not target_dir.exists():
                shutil.copytree(workflow_dir, target_dir)
            else:
                # Update existing directory
                shutil.rmtree(target_dir)
                shutil.copytree(workflow_dir, target_dir)

            # Create manifest entry
            entry = {
                "id": workflow_dir.name,
                "name": metadata.get('title', workflow_dir.name.replace('_', ' ').title()),
                "description": metadata.get('description', ''),
                "type": metadata.get('type', 'workflow'),
                "difficulty": metadata.get('difficulty', 'intermediate'),
                "category": "workflow"
            }

            # Add optional fields
            if 'estimated_time' in metadata:
                entry['estimated_time'] = metadata['estimated_time']

            if 'tags' in metadata:
                tags = metadata['tags']
                if isinstance(tags, list):
                    entry['tags'] = tags
                elif isinstance(tags, str):
                    entry['tags'] = [tags]

            entries.append(entry)

        except Exception as e:
            print(f"Error processing workflow {workflow_dir.name}: {e}")
            continue

    # Remove directories from public that don't exist in vault-web
    for public_dir in public_workflows.iterdir():
        if public_dir.is_dir() and not public_dir.name.startswith('.'):
            if public_dir.name not in valid_workflow_ids and public_dir.name != 'manifest.json':
                print(f"Removing deleted workflow: {public_dir.name}")
                shutil.rmtree(public_dir)

    return entries


def sync_skills() -> List[Dict[str, Any]]:
    """Sync skills from vault-web to frontend/public"""
    vault_skills = VAULT_WEB_BASE / "skills"
    public_skills = FRONTEND_PUBLIC_BASE / "skills"

    entries = []

    if not vault_skills.exists():
        return entries

    # Ensure public directory exists
    public_skills.mkdir(parents=True, exist_ok=True)

    # Get list of valid skill IDs from vault-web
    valid_skill_ids = set()

    # Process each skill directory
    for skill_dir in vault_skills.iterdir():
        if not skill_dir.is_dir() or skill_dir.name.startswith('.') or skill_dir.name.endswith('.zip'):
            continue

        skill_md = skill_dir / "SKILL.md"
        if not skill_md.exists():
            continue

        valid_skill_ids.add(skill_dir.name)

        # Read and parse YAML frontmatter
        try:
            content = skill_md.read_text(encoding='utf-8')
            metadata = parse_yaml_frontmatter(content)

            # Copy skill directory to public if it doesn't exist
            target_dir = public_skills / skill_dir.name
            if not target_dir.exists():
                shutil.copytree(skill_dir, target_dir)
            else:
                # Update existing directory
                shutil.rmtree(target_dir)
                shutil.copytree(skill_dir, target_dir)

            # Create manifest entry
            entry = {
                "id": skill_dir.name,
                "name": metadata.get('name', skill_dir.name.replace('-', ' ').replace('_', ' ').title()),
                "description": metadata.get('description', ''),
                "category": "skill"
            }

            # Add optional fields
            if 'tags' in metadata:
                tags = metadata['tags']
                if isinstance(tags, list):
                    entry['tags'] = tags
                elif isinstance(tags, str):
                    entry['tags'] = [tags]

            if 'difficulty' in metadata:
                entry['difficulty'] = metadata['difficulty']

            if 'skill_type' in metadata:
                entry['skill_type'] = metadata['skill_type']

            entries.append(entry)

        except Exception as e:
            print(f"Error processing skill {skill_dir.name}: {e}")
            continue

    # Remove directories from public that don't exist in vault-web
    for public_dir in public_skills.iterdir():
        if public_dir.is_dir() and not public_dir.name.startswith('.'):
            if public_dir.name not in valid_skill_ids and public_dir.name != 'manifest.json':
                print(f"Removing deleted skill: {public_dir.name}")
                shutil.rmtree(public_dir)

    return entries


def sync_tools() -> List[Dict[str, Any]]:
    """Sync tools from vault-web to frontend/public"""
    vault_tools = VAULT_WEB_BASE / "tools"
    public_tools = FRONTEND_PUBLIC_BASE / "tools"

    entries = []

    if not vault_tools.exists():
        return entries

    # Ensure public directory exists
    public_tools.mkdir(parents=True, exist_ok=True)

    # Get list of valid tool IDs from vault-web
    valid_tool_ids = set()

    # Process each tool directory
    for tool_dir in vault_tools.iterdir():
        if not tool_dir.is_dir() or tool_dir.name.startswith('.'):
            continue

        tool_md = tool_dir / "TOOL.md"
        if not tool_md.exists():
            continue

        valid_tool_ids.add(tool_dir.name)

        # Read and parse YAML frontmatter
        try:
            content = tool_md.read_text(encoding='utf-8')
            metadata = parse_yaml_frontmatter(content)

            # Copy tool directory to public if it doesn't exist
            target_dir = public_tools / tool_dir.name
            if not target_dir.exists():
                shutil.copytree(tool_dir, target_dir)

            # Create manifest entry
            entry = {
                "id": metadata.get('tool_id', tool_dir.name),
                "name": metadata.get('name', tool_dir.name.replace('-', ' ').replace('_', ' ').title()),
                "description": metadata.get('description', ''),
                "category": metadata.get('category', 'tool')
            }

            # Add optional fields
            if 'tags' in metadata:
                tags = metadata['tags']
                if isinstance(tags, list):
                    entry['tags'] = tags
                elif isinstance(tags, str):
                    entry['tags'] = [tags]

            if 'capabilities' in metadata:
                caps = metadata['capabilities']
                if isinstance(caps, list):
                    entry['capabilities'] = caps

            if 'pricing' in metadata:
                entry['pricing'] = metadata['pricing']

            if 'language' in metadata:
                entry['language'] = metadata['language']

            if 'compatibility' in metadata:
                compat = metadata['compatibility']
                if isinstance(compat, list):
                    entry['compatibility'] = compat

            entries.append(entry)

        except Exception as e:
            print(f"Error processing tool {tool_dir.name}: {e}")
            continue

    # Remove directories from public that don't exist in vault-web
    for public_dir in public_tools.iterdir():
        if public_dir.is_dir() and not public_dir.name.startswith('.'):
            if public_dir.name not in valid_tool_ids and public_dir.name != 'manifest.json':
                print(f"Removing deleted tool: {public_dir.name}")
                shutil.rmtree(public_dir)

    return entries


@router.post("/sync-content")
async def sync_content():
    """
    Sync content from vault-web to frontend/public and regenerate manifests
    """
    try:
        # Sync all content types
        workflow_entries = sync_workflows()
        skill_entries = sync_skills()
        tool_entries = sync_tools()

        # Write updated manifests
        workflows_manifest = {"entries": workflow_entries}
        skills_manifest = {"entries": skill_entries}
        tools_manifest = {"entries": tool_entries}

        # Save manifests
        (FRONTEND_PUBLIC_BASE / "workflows" / "manifest.json").write_text(
            json.dumps(workflows_manifest, indent=2, ensure_ascii=False),
            encoding='utf-8'
        )

        (FRONTEND_PUBLIC_BASE / "skills" / "manifest.json").write_text(
            json.dumps(skills_manifest, indent=2, ensure_ascii=False),
            encoding='utf-8'
        )

        (FRONTEND_PUBLIC_BASE / "tools" / "manifest.json").write_text(
            json.dumps(tools_manifest, indent=2, ensure_ascii=False),
            encoding='utf-8'
        )

        return {
            "success": True,
            "message": "Content synced successfully",
            "workflows": len(workflow_entries),
            "skills": len(skill_entries),
            "tools": len(tool_entries),
            "manifests": {
                "workflows": workflows_manifest,
                "skills": skills_manifest,
                "tools": tools_manifest
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error syncing content: {str(e)}")


@router.put("/{section}/{entry_id}")
async def save_document(section: str, entry_id: str, document: DocumentContent):
    """
    Save a document to both vault-web and frontend/public

    Args:
        section: 'workflows', 'skills', or 'tools'
        entry_id: The document ID (directory name)
        document: The full document content including frontmatter
            - content: The document text
            - file_path: Optional path for subdirectory files (e.g., "references/deploy-guide.md")
    """
    # Validate section
    if section not in ['workflows', 'skills', 'tools']:
        raise HTTPException(status_code=400, detail=f"Invalid section: {section}")

    # Determine file path
    if document.file_path:
        # Subdirectory file (e.g., "references/deploy-guide.md")
        file_path = document.file_path
    else:
        # Main document file
        file_names = {
            'workflows': 'WORKFLOW.md',
            'skills': 'SKILL.md',
            'tools': 'TOOL.md'
        }
        file_path = file_names[section]

    # Build paths
    vault_path = VAULT_WEB_BASE / section / entry_id / file_path
    public_path = FRONTEND_PUBLIC_BASE / section / entry_id / file_path

    # Validate that the parent directory exists
    if not vault_path.parent.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Directory not found: {section}/{entry_id}/{Path(file_path).parent}"
        )

    try:
        # Write to vault-web (source of truth)
        vault_path.write_text(document.content, encoding='utf-8')

        # Ensure public directory exists
        public_path.parent.mkdir(parents=True, exist_ok=True)

        # Write to frontend/public
        public_path.write_text(document.content, encoding='utf-8')

        return {
            "success": True,
            "message": f"Document saved successfully",
            "section": section,
            "entry_id": entry_id,
            "file": file_path
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error saving document: {str(e)}"
        )
