#!/usr/bin/env python3
"""
Sync workflows from vault-web to frontend/public/content/workflows
and regenerate manifest.json
"""

import os
import json
import shutil
from pathlib import Path
from datetime import datetime


def parse_frontmatter(content):
    """Extract frontmatter from markdown file"""
    if not content.startswith('---'):
        return {}, content

    try:
        # Split on the second ---
        parts = content.split('---', 2)
        if len(parts) < 3:
            return {}, content

        frontmatter_text = parts[1].strip()
        content_text = parts[2].strip()

        # Parse YAML frontmatter
        frontmatter = {}
        current_key = None
        current_list = []

        for line in frontmatter_text.split('\n'):
            line = line.strip()
            if not line:
                continue

            # Check for list item
            if line.startswith('- '):
                if current_key:
                    value = line[2:].strip().strip('"').strip("'")
                    current_list.append(value)
                continue

            # Check for key: value
            if ':' in line:
                # Save previous list if exists
                if current_key and current_list:
                    frontmatter[current_key] = current_list
                    current_list = []

                key, value = line.split(':', 1)
                current_key = key.strip()
                value = value.strip().strip('"').strip("'")

                if value:
                    frontmatter[current_key] = value
                else:
                    # Start of a list
                    current_list = []

        # Save last list if exists
        if current_key and current_list:
            frontmatter[current_key] = current_list

        return frontmatter, content_text

    except Exception as e:
        print(f"Error parsing frontmatter: {e}")
        return {}, content


def sync_workflows():
    """Sync workflows from vault-web to frontend/public/content"""

    # Get project root
    script_dir = Path(__file__).parent
    project_root = script_dir.parent

    source_dir = project_root / 'vault-web' / 'workflows'
    target_dir = project_root / 'frontend' / 'public' / 'content' / 'workflows'

    if not source_dir.exists():
        print(f"Source directory not found: {source_dir}")
        return

    # Create target directory if it doesn't exist
    target_dir.mkdir(parents=True, exist_ok=True)

    # Collect workflow metadata
    entries = []

    # Iterate through workflow directories
    for workflow_dir in sorted(source_dir.glob('workflow_*')):
        if not workflow_dir.is_dir():
            continue

        workflow_id = workflow_dir.name
        workflow_file = workflow_dir / 'WORKFLOW.md'

        if not workflow_file.exists():
            print(f"Warning: No WORKFLOW.md in {workflow_id}")
            continue

        # Read workflow file
        with open(workflow_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Parse frontmatter
        frontmatter, _ = parse_frontmatter(content)

        # Extract metadata
        entry = {
            'id': frontmatter.get('workflow_id', workflow_id),
            'name': frontmatter.get('name', workflow_id.replace('_', ' ').title()),
            'description': frontmatter.get('description', ''),
            'category': frontmatter.get('category', 'workflow'),
            'tags': frontmatter.get('tags', []),
            'difficulty': frontmatter.get('difficulty', 'intermediate')
        }

        # Ensure tags is a list
        if isinstance(entry['tags'], str):
            entry['tags'] = [tag.strip() for tag in entry['tags'].split(',') if tag.strip()]

        entries.append(entry)

        # Copy workflow directory to target
        target_workflow_dir = target_dir / workflow_id
        if target_workflow_dir.exists():
            shutil.rmtree(target_workflow_dir)
        shutil.copytree(workflow_dir, target_workflow_dir)

        print(f"✓ Synced: {workflow_id}")

    # Write manifest.json
    manifest = {'entries': entries}
    manifest_path = target_dir / 'manifest.json'

    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2)

    print(f"\n✓ Synced {len(entries)} workflows")
    print(f"✓ Updated manifest: {manifest_path}")

    return entries


if __name__ == '__main__':
    sync_workflows()
