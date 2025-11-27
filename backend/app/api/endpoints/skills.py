"""
Skills API endpoints - reads from markdown files with YAML frontmatter
"""
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime
from pathlib import Path
import yaml
import re

router = APIRouter()

# Path to skills directory (in vault-web)
# Go from endpoints/ -> api/ -> app/ -> backend/ -> web/
SKILLS_DIR = Path(__file__).parent.parent.parent.parent.parent / "vault-web" / "skills"

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

def _get_skill_directory(skill_dir_name: str) -> Optional[Path]:
    """
    Get the directory path for a skill's supporting files.
    Directory name is the skill subdirectory (e.g., "gitthub-workflow").
    """
    skill_dir = SKILLS_DIR / skill_dir_name
    if skill_dir.exists() and skill_dir.is_dir():
        return skill_dir
    return None

def _detect_language(filename: str) -> str:
    """Detect programming language from file extension for syntax highlighting"""
    ext_map = {
        '.py': 'python',
        '.js': 'javascript',
        '.jsx': 'javascript',
        '.ts': 'typescript',
        '.tsx': 'typescript',
        '.sh': 'bash',
        '.bash': 'bash',
        '.yaml': 'yaml',
        '.yml': 'yaml',
        '.json': 'json',
        '.sql': 'sql',
        '.md': 'markdown',
        '.html': 'html',
        '.css': 'css',
        '.java': 'java',
        '.go': 'go',
        '.rs': 'rust',
        '.c': 'c',
        '.cpp': 'cpp',
        '.rb': 'ruby',
        '.php': 'php',
    }
    ext = Path(filename).suffix.lower()
    return ext_map.get(ext, 'text')

def _load_instruction_files(skill_dir: Path) -> List[dict]:
    """Load all markdown files from instructions/ subdirectory"""
    instructions = []
    instructions_dir = skill_dir / "instructions"

    if not instructions_dir.exists():
        return instructions

    for md_file in sorted(instructions_dir.glob("*.md")):
        try:
            content = md_file.read_text(encoding='utf-8')
            # Extract title from first heading or use filename
            title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
            title = title_match.group(1) if title_match else md_file.stem.replace('_', ' ').title()

            instructions.append({
                "filename": md_file.name,
                "title": title,
                "content": content
            })
        except Exception as e:
            print(f"Error loading instruction file {md_file}: {e}")

    return instructions

def _load_code_files(skill_dir: Path) -> List[dict]:
    """Load all files from code/ subdirectory"""
    code_files = []
    code_dir = skill_dir / "code"

    if not code_dir.exists():
        return code_files

    for code_file in sorted(code_dir.iterdir()):
        if code_file.is_file():
            try:
                content = code_file.read_text(encoding='utf-8')
                language = _detect_language(code_file.name)

                code_files.append({
                    "filename": code_file.name,
                    "language": language,
                    "content": content,
                    "size": len(content)
                })
            except Exception as e:
                print(f"Error loading code file {code_file}: {e}")

    return code_files

def _load_resource_files(skill_dir: Path) -> List[dict]:
    """Load all files from resources/ subdirectory (recursively)"""
    resources = []
    resources_dir = skill_dir / "resources"

    if not resources_dir.exists():
        return resources

    for resource_file in sorted(resources_dir.rglob("*")):
        if resource_file.is_file():
            try:
                # Try to read as text, but handle binary files gracefully
                try:
                    content = resource_file.read_text(encoding='utf-8')
                    is_binary = False
                except UnicodeDecodeError:
                    content = "[Binary file - download to view]"
                    is_binary = True

                # Get relative path from resources/ directory
                rel_path = str(resource_file.relative_to(resources_dir))

                resources.append({
                    "filename": resource_file.name,
                    "path": rel_path,
                    "content": content,
                    "is_binary": is_binary,
                    "size": resource_file.stat().st_size
                })
            except Exception as e:
                print(f"Error loading resource file {resource_file}: {e}")

    return resources

def load_skills_from_files():
    """
    Load all skill files from vault-website/skills directory
    Looks for SKILL.md files in subdirectories (e.g., gitthub-workflow/SKILL.md)
    """
    skills = []

    if not SKILLS_DIR.exists():
        print(f"Skills directory not found: {SKILLS_DIR}")
        return skills

    # Find all SKILL.md files in subdirectories
    markdown_files = list(SKILLS_DIR.glob("*/SKILL.md"))

    for file_path in markdown_files:
        # Get skill directory name (e.g., "gitthub-workflow" from "gitthub-workflow/SKILL.md")
        skill_dir_name = file_path.parent.name

        frontmatter, content, frontmatter_yaml = parse_markdown_frontmatter(file_path)

        if not frontmatter:
            continue

        # Transform frontmatter to API format
        # Use skill directory name as skill_id if not specified in frontmatter
        skill = {
            "skill_id": frontmatter.get("skill_id", skill_dir_name),
            "skill_name": frontmatter.get("name", frontmatter.get("title", "Untitled Skill")),
            "description": frontmatter.get("description", ""),
            "skill_type": frontmatter.get("skill_type", "general"),
            "difficulty": frontmatter.get("difficulty", "beginner"),
            "language": frontmatter.get("language", "general"),
            "estimated_time": frontmatter.get("estimated_time", "Unknown"),
            "tags": frontmatter.get("tags", []),
            "status": frontmatter.get("status", "draft"),
            "created_date": frontmatter.get("created_date", ""),
            "created_by": frontmatter.get("author", "Unknown"),
            "version": frontmatter.get("version", "1.0"),
            "agent": frontmatter.get("agent", ""),
            "model": frontmatter.get("model", ""),
            "category": frontmatter.get("category", "general"),
            "prerequisites": frontmatter.get("prerequisites", []),
            "tools_required": frontmatter.get("tools_required", []),
            "usage_count": frontmatter.get("usage_count", 0),
            # Marketplace integration fields (optional)
            "organization": frontmatter.get("organization", ""),
            "repository": frontmatter.get("repository", ""),
            "homepage": frontmatter.get("homepage", ""),
            "license": frontmatter.get("license", ""),
            "keywords": frontmatter.get("keywords", []),
            "compatibility": frontmatter.get("compatibility", []),
            "installation_method": frontmatter.get("installation_method", ""),
            "file_path": str(file_path),
            "content": content,  # Store full content for detail view
            "frontmatter_yaml": frontmatter_yaml  # Store raw YAML for preview
        }

        skills.append(skill)

    # Sort by created_date (newest first)
    skills.sort(key=lambda x: x.get("created_date", ""), reverse=True)

    return skills

@router.get("")
async def get_skills(
    limit: Optional[int] = 100,
    offset: Optional[int] = 0,
    skill_type: Optional[str] = None,
    difficulty: Optional[str] = None,
    language: Optional[str] = None,
    status: Optional[str] = None
):
    """
    Get list of skills from markdown files with optional filtering
    """
    try:
        # Load skills from files
        skills = load_skills_from_files()

        # Apply filters
        if skill_type:
            skills = [s for s in skills if s["skill_type"] == skill_type]
        if difficulty:
            skills = [s for s in skills if s["difficulty"] == difficulty]
        if language:
            skills = [s for s in skills if s["language"] == language]
        if status:
            skills = [s for s in skills if s["status"] == status]

        # Apply pagination
        total = len(skills)
        skills = skills[offset:offset + limit]

        # Remove content from list view (too large)
        for skill in skills:
            if "content" in skill:
                del skill["content"]

        return {
            "success": True,
            "skills": skills,
            "total": total,
            "limit": limit,
            "offset": offset
        }
    except Exception as e:
        print(f"Error in get_skills: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{skill_id}")
async def get_skill(skill_id: str):
    """
    Get a specific skill by ID with full content and supporting files
    """
    try:
        # Load all skills
        skills = load_skills_from_files()

        # Find the requested skill
        skill = next((s for s in skills if s["skill_id"] == skill_id), None)

        if not skill:
            raise HTTPException(status_code=404, detail="Skill not found")

        # Get skill directory using the skill_id (which is the directory name)
        skill_dir = _get_skill_directory(skill_id)

        # Load supporting files if directory exists
        if skill_dir:
            skill["instructions"] = _load_instruction_files(skill_dir)
            skill["code"] = _load_code_files(skill_dir)
            skill["resources"] = _load_resource_files(skill_dir)
        else:
            # No subdirectory - backward compatible
            skill["instructions"] = []
            skill["code"] = []
            skill["resources"] = []

        return {
            "success": True,
            "skill": skill
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_skill: {e}")
        raise HTTPException(status_code=500, detail=str(e))
