"""Conversational Workflow Generator API endpoint.

Two-phase workflow generation:
- Phase 1: Conversational outline (flexible, creative)
- Phase 2: Structured expansion (deterministic, evaluable)
"""

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Literal, AsyncGenerator
import json
import os
import logging
from datetime import datetime
from pathlib import Path
import re

logger = logging.getLogger(__name__)

# Import from anthropic-api package
from workflow_generator import (
    ConversationalWorkflowGenerator,
    WorkflowType,
    WorkflowRequest,
)

router = APIRouter()


class WorkflowGenerateRequest(BaseModel):
    """Request model for workflow generation."""
    workflow_type: Literal["navigate", "educate", "deploy"] = Field(
        ...,
        description="Type of workflow to generate"
    )
    task_description: str = Field(
        ...,
        min_length=10,
        description="Clear description of what you want to accomplish"
    )
    context: str = Field(
        default="",
        description="Optional context about your environment or constraints"
    )


class WorkflowRefineRequest(BaseModel):
    """Request model for workflow refinement."""
    message: str = Field(
        ...,
        min_length=1,
        description="Your feedback or refinement request"
    )


class WorkflowAnswerRequest(BaseModel):
    """Request model for answering discovery questions."""
    answers: str = Field(
        ...,
        min_length=1,
        description="Your answers to the discovery questions"
    )


class WorkflowSaveRequest(BaseModel):
    """Request model for saving a workflow to file."""
    title: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Workflow title"
    )
    workflow_type: Literal["navigate", "educate", "deploy"] = Field(
        ...,
        description="Type of workflow"
    )
    markdown: str = Field(
        ...,
        min_length=1,
        description="Complete workflow markdown content"
    )
    context: str = Field(
        default="",
        description="Optional context about the workflow"
    )
    description: str = Field(
        default="",
        description="Short description of the workflow"
    )
    step_names: list[str] = Field(
        default_factory=list,
        description="List of step names extracted from the workflow"
    )
    estimated_time: str = Field(
        default="",
        description="Estimated completion time"
    )
    difficulty: str = Field(
        default="intermediate",
        description="Difficulty level: beginner, intermediate, advanced"
    )


class WorkflowStepUpdateRequest(BaseModel):
    """Request model for updating a workflow step."""
    title: str = Field(
        ...,
        min_length=1,
        description="Step title"
    )
    instruction: str = Field(
        default="",
        description="Step instruction"
    )
    skills: str = Field(
        default="",
        description="Required skills"
    )
    tools: str = Field(
        default="",
        description="Required tools"
    )
    resources: str = Field(
        default="",
        description="Additional resources"
    )
    deliverable: str = Field(
        default="",
        description="Expected deliverable"
    )


# Store active generators (in production, use Redis or similar)
_active_generators: dict[str, ConversationalWorkflowGenerator] = {}


def _get_api_key() -> str:
    """Get Anthropic API key from environment."""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="ANTHROPIC_API_KEY not configured"
        )
    return api_key


async def _stream_events(generator, method_name: str, *args) -> AsyncGenerator[str, None]:
    """Stream events from generator method as SSE."""
    method = getattr(generator, method_name)

    # Call the method to get the async generator
    if args:
        event_generator = method(*args)
    else:
        event_generator = method()

    # The event_generator should be an async generator
    # If it's a coroutine, await it first
    import inspect
    if inspect.iscoroutine(event_generator):
        event_generator = await event_generator

    async for event in event_generator:
        # Send as Server-Sent Events format
        yield f"data: {json.dumps(event)}\n\n"

    # Send completion event
    yield f"data: {json.dumps({'type': 'done'})}\n\n"


async def _stream_events_websocket(websocket: WebSocket, generator, method_name: str, *args):
    """Stream events from generator method over WebSocket."""
    try:
        method = getattr(generator, method_name)

        # Call the method to get the async generator
        if args:
            event_generator = method(*args)
        else:
            event_generator = method()

        # The event_generator should be an async generator
        # If it's a coroutine, await it first
        import inspect
        if inspect.iscoroutine(event_generator):
            event_generator = await event_generator

        # Stream events directly to WebSocket
        async for event in event_generator:
            await websocket.send_json(event)

        # Send completion event
        await websocket.send_json({'type': 'done'})

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected during streaming")
        raise
    except Exception as e:
        logger.error(f"Error streaming events: {e}")
        await websocket.send_json({'type': 'error', 'error': str(e)})
        raise


@router.post("/workflow/discover")
async def discover_workflow(
    request: WorkflowGenerateRequest,
    session_id: str = "default"
):
    """Phase 1a: Discover - Analyze task and ask clarifying questions.

    Uses extended thinking and web search to understand the task.
    Returns 1-2 clarifying questions.
    """
    try:
        api_key = _get_api_key()

        # Create workflow request
        # Note: WorkflowRequest expects 'type' and 'task', not 'workflow_type' and 'task_description'
        workflow_request = WorkflowRequest(
            type=WorkflowType(request.workflow_type),
            task=request.task_description,
            context=request.context or None,
        )

        # Create generator
        generator = ConversationalWorkflowGenerator(api_key=api_key)
        _active_generators[session_id] = generator

        # Stream discovery process
        return StreamingResponse(
            _stream_events(generator, "discover", workflow_request),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/workflow/generate-outline")
async def generate_outline(
    request: WorkflowAnswerRequest,
    session_id: str = "default"
):
    """Phase 1c: Generate initial outline after answering questions."""
    try:
        generator = _active_generators.get(session_id)
        if not generator:
            raise HTTPException(
                status_code=400,
                detail="No active session. Call /discover first."
            )

        # Stream outline generation
        return StreamingResponse(
            _stream_events(generator, "generate_outline", request.answers),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/workflow/refine")
async def refine_workflow(
    request: WorkflowRefineRequest,
    session_id: str = "default"
):
    """Phase 1d: Refine the outline based on user feedback.

    Interactive refinement loop with conditional extended thinking.
    """
    try:
        generator = _active_generators.get(session_id)
        if not generator:
            raise HTTPException(
                status_code=400,
                detail="No active session. Call /discover first."
            )

        # Stream refinement
        return StreamingResponse(
            _stream_events(generator, "refine", request.message),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/workflow/finalize")
async def finalize_workflow(session_id: str = "default"):
    """Phase 2: Finalize - Extract structure and expand to detailed workflow.

    Executes:
    - Phase 2a: Tool-forced JSON extraction
    - Phase 2b: Tool-forced detailed expansion
    - Phase 2c: Template-based markdown conversion

    Returns the final markdown workflow.
    """
    try:
        generator = _active_generators.get(session_id)
        if not generator:
            raise HTTPException(
                status_code=400,
                detail="No active session. Call /discover first."
            )

        # Stream finalization
        return StreamingResponse(
            _stream_events(generator, "finalize_streaming"),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/workflow/session/{session_id}")
async def delete_session(session_id: str):
    """Delete an active workflow generation session."""
    if session_id in _active_generators:
        del _active_generators[session_id]
        return {"message": "Session deleted"}

    raise HTTPException(status_code=404, detail="Session not found")


@router.get("/workflow/session/{session_id}")
async def get_session_status(session_id: str):
    """Get the status of a workflow generation session."""
    if session_id in _active_generators:
        generator = _active_generators[session_id]
        return {
            "exists": True,
            "workflow_type": generator.request.workflow_type.value if generator.request else None,
            "finalized": generator.final_workflow is not None,
        }

    return {"exists": False}


# WebSocket Endpoints for real-time streaming


@router.websocket("/workflow/ws/discover/{session_id}")
async def websocket_discover(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for workflow discovery.

    Real-time streaming with lower latency than SSE.

    Protocol:
    1. Client connects
    2. Client sends: {"workflow_type": "...", "task_description": "...", "context": "..."}
    3. Server streams discovery events
    4. Server sends {"type": "done"} when complete
    5. Connection closes
    """
    await websocket.accept()

    try:
        # Receive initial request
        data = await websocket.receive_json()

        # Validate and create workflow request
        api_key = _get_api_key()
        workflow_request = WorkflowRequest(
            type=WorkflowType(data['workflow_type']),
            task=data['task_description'],
            context=data.get('context') or None,
        )

        # Create generator
        generator = ConversationalWorkflowGenerator(api_key=api_key)
        _active_generators[session_id] = generator

        # Stream discovery events
        await _stream_events_websocket(websocket, generator, "discover", workflow_request)

    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected: {session_id}")
    except Exception as e:
        logger.error(f"WebSocket error in discover: {e}")
        try:
            await websocket.send_json({"type": "error", "error": str(e)})
        except:
            pass
    finally:
        try:
            await websocket.close()
        except:
            pass


@router.websocket("/workflow/ws/generate-outline/{session_id}")
async def websocket_generate_outline(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for outline generation."""
    await websocket.accept()

    try:
        # Get existing generator
        generator = _active_generators.get(session_id)
        if not generator:
            await websocket.send_json({
                "type": "error",
                "error": "No active session. Call discover first."
            })
            await websocket.close()
            return

        # Receive answers
        data = await websocket.receive_json()
        answers = data['answers']

        # Stream outline generation
        await _stream_events_websocket(websocket, generator, "generate_outline", answers)

    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected: {session_id}")
    except Exception as e:
        logger.error(f"WebSocket error in generate_outline: {e}")
        try:
            await websocket.send_json({"type": "error", "error": str(e)})
        except:
            pass
    finally:
        try:
            await websocket.close()
        except:
            pass


@router.websocket("/workflow/ws/refine/{session_id}")
async def websocket_refine(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for outline refinement."""
    await websocket.accept()

    try:
        # Get existing generator
        generator = _active_generators.get(session_id)
        if not generator:
            await websocket.send_json({
                "type": "error",
                "error": "No active session. Call discover first."
            })
            await websocket.close()
            return

        # Receive refinement feedback
        data = await websocket.receive_json()
        message = data['message']

        # Stream refinement
        await _stream_events_websocket(websocket, generator, "refine", message)

    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected: {session_id}")
    except Exception as e:
        logger.error(f"WebSocket error in refine: {e}")
        try:
            await websocket.send_json({"type": "error", "error": str(e)})
        except:
            pass
    finally:
        try:
            await websocket.close()
        except:
            pass


@router.websocket("/workflow/ws/finalize/{session_id}")
async def websocket_finalize(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for workflow finalization."""
    await websocket.accept()

    try:
        # Get existing generator
        generator = _active_generators.get(session_id)
        if not generator:
            await websocket.send_json({
                "type": "error",
                "error": "No active session. Call discover first."
            })
            await websocket.close()
            return

        # Stream finalization
        await _stream_events_websocket(websocket, generator, "finalize_streaming")

    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected: {session_id}")
    except Exception as e:
        logger.error(f"WebSocket error in finalize: {e}")
        try:
            await websocket.send_json({"type": "error", "error": str(e)})
        except:
            pass
    finally:
        try:
            await websocket.close()
        except:
            pass


# Save Workflow Endpoint


def _get_vault_workflows_dir() -> Path:
    """Get the vault-web/workflows directory path."""
    current_file = Path(__file__)
    # Go from endpoints/ -> api/ -> app/ -> backend/ -> web/
    web_dir = current_file.parent.parent.parent.parent.parent
    vault_workflows_dir = web_dir / "vault-web" / "workflows"
    return vault_workflows_dir


def _parse_workflow_metadata(content: str) -> dict:
    """Parse metadata from workflow markdown content.

    Supports both YAML frontmatter and legacy markdown metadata.
    """
    metadata = {
        'title': '',
        'type': '',
        'created': '',
        'context': '',
        'description': '',
        'difficulty': 'intermediate',
        'estimated_time': '',
        'agent': 'Claude Code',
        'steps': [],
        'skills': [],
        'tools': []
    }

    # Check for YAML frontmatter
    if content.startswith('---'):
        try:
            # Extract YAML block
            end_marker = content.find('---', 3)
            if end_marker > 0:
                yaml_content = content[3:end_marker].strip()

                # Simple YAML parser (handles the specific format we generate)
                in_steps_section = False
                in_skills_section = False
                in_tools_section = False
                in_multiline_section = False
                for line in yaml_content.split('\n'):
                    original_line = line
                    line = line.strip()

                    # Skip comments
                    if line.startswith('#'):
                        continue

                    # Handle multiline content (indicated by | or >)
                    # Skip indented lines when in a multiline section
                    if in_multiline_section:
                        if original_line.startswith('  ') or not line:
                            # Still in multiline content, skip it
                            continue
                        else:
                            # Hit a new field, exit multiline mode
                            in_multiline_section = False

                    if line.startswith('title:'):
                        metadata['title'] = line.split(':', 1)[1].strip().strip('"')
                        in_steps_section = False
                        in_skills_section = False
                        in_tools_section = False
                    elif line.startswith('description:'):
                        metadata['description'] = line.split(':', 1)[1].strip().strip('"')
                        in_steps_section = False
                        in_skills_section = False
                        in_tools_section = False
                    elif line.startswith('type:'):
                        metadata['type'] = line.split(':', 1)[1].strip().strip('"')
                        in_steps_section = False
                        in_skills_section = False
                        in_tools_section = False
                    elif line.startswith('difficulty:'):
                        metadata['difficulty'] = line.split(':', 1)[1].strip().strip('"')
                        in_steps_section = False
                        in_skills_section = False
                        in_tools_section = False
                    elif line.startswith('estimated_time:'):
                        metadata['estimated_time'] = line.split(':', 1)[1].strip().strip('"')
                        in_steps_section = False
                        in_skills_section = False
                        in_tools_section = False
                    elif line.startswith('agent:'):
                        metadata['agent'] = line.split(':', 1)[1].strip().strip('"')
                        in_steps_section = False
                        in_skills_section = False
                        in_tools_section = False
                    elif line.startswith('created_date:'):
                        metadata['created'] = line.split(':', 1)[1].strip().strip('"')
                        in_steps_section = False
                        in_skills_section = False
                        in_tools_section = False
                    elif line.startswith('context:'):
                        value = line.split(':', 1)[1].strip().strip('"')
                        metadata['context'] = value
                        # Check if this is a multiline field (starts with | or >)
                        if value in ('|', '>'):
                            in_multiline_section = True
                            metadata['context'] = ''  # Reset, we'll skip the actual content
                        in_steps_section = False
                        in_skills_section = False
                        in_tools_section = False
                    elif line.startswith('references:'):
                        # Skip references section (we don't need to parse it)
                        # Just treat it as entering an ignored list section
                        in_steps_section = False
                        in_skills_section = False
                        in_tools_section = False
                    elif line.startswith('steps:'):
                        # Enter steps section
                        in_steps_section = True
                        in_skills_section = False
                        in_tools_section = False
                    elif line.startswith('skills:'):
                        # Enter skills section
                        in_skills_section = True
                        in_steps_section = False
                        in_tools_section = False
                    elif line.startswith('tools:'):
                        # Enter tools section
                        in_tools_section = True
                        in_steps_section = False
                        in_skills_section = False
                    elif in_steps_section and line.startswith('- '):
                        # Step name in list (only when in steps section)
                        # Handle both quoted and unquoted values
                        step_name = line[2:].strip().strip('"')
                        metadata['steps'].append(step_name)
                    elif in_skills_section and line.startswith('- '):
                        # Skill name in list (only when in skills section)
                        # Handle both quoted and unquoted values
                        skill_name = line[2:].strip().strip('"')
                        metadata['skills'].append(skill_name)
                    elif in_tools_section and line.startswith('- '):
                        # Tool name in list (only when in tools section)
                        # Handle both quoted and unquoted values
                        tool_name = line[2:].strip().strip('"')
                        metadata['tools'].append(tool_name)
                    elif not line.startswith('-') and ':' in line:
                        # Hit a new section, exit all list sections
                        in_steps_section = False
                        in_skills_section = False
                        in_tools_section = False

                return metadata
        except Exception as e:
            logger.warning(f"Failed to parse YAML frontmatter: {e}")

    # Fallback to legacy markdown metadata parsing
    lines = content.split('\n')

    # Extract title (first line with #)
    for line in lines:
        if line.strip().startswith('# '):
            metadata['title'] = line.strip()[2:]
            break

    # Extract metadata fields
    for line in lines[:30]:  # Check first 30 lines for metadata
        if line.startswith('**Type:**'):
            metadata['type'] = line.replace('**Type:**', '').strip()
        elif line.startswith('**Created:**'):
            metadata['created'] = line.replace('**Created:**', '').strip()
        elif line.startswith('**Context:**'):
            metadata['context'] = line.replace('**Context:**', '').strip()
            if metadata['context'] == 'N/A':
                metadata['context'] = ''
        elif line.startswith('**Target Completion Time:**'):
            metadata['estimated_time'] = line.replace('**Target Completion Time:**', '').strip()

    return metadata


@router.get("/workflow/list")
async def list_workflows():
    """List all workflows from vault-website/workflows directory.

    Returns a list of workflows with metadata extracted from WORKFLOW.md files in subdirectories.
    """
    try:
        vault_workflows_dir = _get_vault_workflows_dir()

        if not vault_workflows_dir.exists():
            return {"success": True, "workflows": []}

        workflows = []

        # Read all WORKFLOW.md files in workflow_* subdirectories
        for filepath in sorted(vault_workflows_dir.glob("workflow_*/WORKFLOW.md"), reverse=True):
            try:
                content = filepath.read_text(encoding='utf-8')
                metadata = _parse_workflow_metadata(content)

                # Debug logging
                if 'schwarzenbach' in filepath.parent.name.lower():
                    logger.info(f"DEBUG: Schwarzenbach metadata: steps={len(metadata['steps'])}, skills={len(metadata['skills'])}, tools={len(metadata['tools'])}")
                    logger.info(f"DEBUG: Skills={metadata['skills']}")
                    logger.info(f"DEBUG: Tools={metadata['tools']}")

                # Extract workflow ID from directory name
                workflow_id = filepath.parent.name

                workflows.append({
                    'workflow_id': workflow_id,
                    'filename': filepath.name,
                    'title': metadata['title'] or workflow_id.replace('_', ' ').title(),
                    'description': metadata['description'] or metadata['context'],
                    'type': metadata['type'] or 'unknown',
                    'difficulty': metadata['difficulty'],
                    'estimated_time': metadata['estimated_time'],
                    'agent': metadata['agent'],
                    'created': metadata['created'],
                    'context': metadata['context'],
                    'steps': metadata['steps'],
                    'skills': metadata['skills'],
                    'tools': metadata['tools'],
                    'path': str(filepath.parent.relative_to(vault_workflows_dir.parent))
                })
            except Exception as e:
                logger.error(f"Error parsing workflow {filepath.parent.name}: {e}")
                continue

        return {
            "success": True,
            "workflows": workflows,
            "count": len(workflows)
        }

    except Exception as e:
        logger.error(f"Error listing workflows: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list workflows: {str(e)}"
        )


@router.get("/workflow/{workflow_id}")
async def get_workflow(workflow_id: str):
    """Get a single workflow by ID.

    Returns the full workflow content and metadata from WORKFLOW.md in subdirectory.
    """
    try:
        vault_workflows_dir = _get_vault_workflows_dir()

        # Sanitize workflow_id to prevent directory traversal
        workflow_id = re.sub(r'[^a-zA-Z0-9_\-]', '', workflow_id)
        workflow_dir = vault_workflows_dir / workflow_id
        filepath = workflow_dir / "WORKFLOW.md"

        if not filepath.exists():
            raise HTTPException(
                status_code=404,
                detail=f"Workflow not found: {workflow_id}"
            )

        content = filepath.read_text(encoding='utf-8')
        metadata = _parse_workflow_metadata(content)

        return {
            "success": True,
            "workflow": {
                'workflow_id': workflow_id,
                'filename': filepath.name,
                'title': metadata['title'] or workflow_id.replace('_', ' ').title(),
                'description': metadata['description'] or metadata['context'],
                'type': metadata['type'] or 'unknown',
                'difficulty': metadata['difficulty'],
                'estimated_time': metadata['estimated_time'],
                'created': metadata['created'],
                'context': metadata['context'],
                'steps': metadata['steps'],
                'content': content,
                'path': str(workflow_dir.relative_to(vault_workflows_dir.parent))
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting workflow {workflow_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get workflow: {str(e)}"
        )


@router.post("/workflow/save")
async def save_workflow(request: WorkflowSaveRequest):
    """Save a workflow to the vault-website/workflows directory.

    Creates a workflow directory with structure:
    workflow_YYYYMMDD_NNN_sanitized_title/
    ├── WORKFLOW.md
    └── references/

    Returns the workflow ID and path.
    """
    try:
        # Get the vault-website/workflows directory
        vault_workflows_dir = _get_vault_workflows_dir()

        # Create directory if it doesn't exist
        vault_workflows_dir.mkdir(parents=True, exist_ok=True)

        # Generate workflow directory name
        today = datetime.now().strftime("%Y%m%d")

        # Sanitize title for directory name (keep only alphanumeric, spaces, hyphens, underscores)
        sanitized_title = re.sub(r'[^a-zA-Z0-9\s\-_]', '', request.title)
        sanitized_title = re.sub(r'\s+', '_', sanitized_title.strip())
        sanitized_title = sanitized_title.lower()[:50]  # Limit length

        # Find next available number for today
        existing_dirs = list(vault_workflows_dir.glob(f"workflow_{today}_*"))
        if existing_dirs:
            # Extract numbers and find max
            numbers = []
            for d in existing_dirs:
                match = re.search(r'workflow_\d{8}_(\d{3})_', d.name)
                if match:
                    numbers.append(int(match.group(1)))
            next_num = max(numbers) + 1 if numbers else 1
        else:
            next_num = 1

        dirname = f"workflow_{today}_{next_num:03d}_{sanitized_title}"
        workflow_dir = vault_workflows_dir / dirname
        workflow_id = f"workflow_{today}_{next_num:03d}"

        # Extract step count from markdown
        step_count = len(request.step_names)

        # Build YAML frontmatter
        yaml_frontmatter = f"""---
# Workflow Metadata
title: "{request.title}"
description: "{request.description or request.context or 'AI-generated workflow'}"
type: "{request.workflow_type}"
difficulty: "{request.difficulty}"
status: "active"

# Agent/Model Information
agent: "Claude Code"
model: "claude-sonnet-4-5"

# Time & Effort
estimated_time: "{request.estimated_time or 'Not specified'}"
total_steps: {step_count}

# Categorization
tags:
  - "{request.workflow_type}"
  - "ai-generated"
category: "workflow"

# Tracking
created_date: "{datetime.now().strftime('%Y-%m-%d')}"
last_modified: "{datetime.now().strftime('%Y-%m-%d')}"
workflow_id: "{workflow_id}"

# Optional Metadata
author: "AI Workflow Generator"
version: "1.0"
prerequisites: []
tools_required: []
budget_constraint: null

# Step Names
steps:"""

        # Add step names as YAML list
        if request.step_names:
            for step_name in request.step_names:
                # Escape quotes in step names
                escaped_name = step_name.replace('"', '\\"')
                yaml_frontmatter += f'\n  - "{escaped_name}"'
        else:
            yaml_frontmatter += '\n  []'

        yaml_frontmatter += "\n---\n\n"

        # Create full markdown content
        content = yaml_frontmatter + request.markdown

        # Create workflow directory structure
        workflow_dir.mkdir(parents=True, exist_ok=True)

        # Create references subdirectory
        references_dir = workflow_dir / "references"
        references_dir.mkdir(exist_ok=True)

        # Write WORKFLOW.md
        workflow_file = workflow_dir / "WORKFLOW.md"
        workflow_file.write_text(content, encoding='utf-8')

        logger.info(f"Saved workflow to: {workflow_file}")

        return {
            "success": True,
            "workflow_id": workflow_id,
            "dirname": dirname,
            "path": str(workflow_dir.relative_to(vault_workflows_dir.parent)),
            "message": f"Workflow saved successfully to {dirname}"
        }

    except Exception as e:
        logger.error(f"Error saving workflow: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save workflow: {str(e)}"
        )


@router.delete("/workflow/{workflow_id}")
async def delete_workflow(workflow_id: str):
    """Delete a workflow directory from the vault-website/workflows directory.

    Returns success status and deleted workflow ID.
    """
    try:
        vault_workflows_dir = _get_vault_workflows_dir()

        # Sanitize workflow_id to prevent directory traversal
        workflow_id = re.sub(r'[^a-zA-Z0-9_\-]', '', workflow_id)
        workflow_dir = vault_workflows_dir / workflow_id

        if not workflow_dir.exists() or not workflow_dir.is_dir():
            raise HTTPException(
                status_code=404,
                detail=f"Workflow not found: {workflow_id}"
            )

        # Delete the entire directory
        import shutil
        shutil.rmtree(workflow_dir)

        logger.info(f"Deleted workflow directory: {workflow_dir}")

        return {
            "success": True,
            "workflow_id": workflow_id,
            "message": f"Workflow {workflow_id} deleted successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting workflow {workflow_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete workflow: {str(e)}"
        )


@router.put("/workflow/{workflow_id}/step/{step_number}")
async def update_workflow_step(
    workflow_id: str,
    step_number: int,
    step_data: WorkflowStepUpdateRequest
):
    """Update a specific step in a workflow.

    Args:
        workflow_id: The workflow identifier
        step_number: The step number to update (1-indexed)
        step_data: The updated step data

    Returns:
        Success status and updated workflow metadata
    """
    try:
        vault_workflows_dir = _get_vault_workflows_dir()

        # Sanitize workflow_id
        workflow_id = re.sub(r'[^a-zA-Z0-9_\-]', '', workflow_id)
        workflow_dir = vault_workflows_dir / workflow_id
        workflow_file = workflow_dir / "WORKFLOW.md"

        if not workflow_file.exists():
            raise HTTPException(
                status_code=404,
                detail=f"Workflow not found: {workflow_id}"
            )

        # Read the current workflow content
        with open(workflow_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Find the specific step
        # Match step pattern: ## Step N: Title
        step_pattern = rf'(## Step {step_number}:.*?)(?=## Step {step_number + 1}:|## Deliverable|$)'

        import re as regex
        step_match = regex.search(step_pattern, content, flags=regex.DOTALL)

        if not step_match:
            raise HTTPException(
                status_code=404,
                detail=f"Step {step_number} not found in workflow"
            )

        # Parse existing step content to preserve sections not being updated
        existing_step = step_match.group(1)

        # Extract existing sections
        existing_instruction = ""
        existing_skills = ""
        existing_tools = ""
        existing_resources = ""
        existing_deliverable = ""

        instruction_match = regex.search(r'\*\*Instruction:\*\*\s*\n(.*?)(?=\n\*\*[A-Z]|\n##|$)', existing_step, regex.DOTALL)
        if instruction_match:
            existing_instruction = instruction_match.group(1).strip()

        skills_match = regex.search(r'\*\*Skills:\*\*\s*\n(.*?)(?=\n\*\*[A-Z]|\n##|$)', existing_step, regex.DOTALL)
        if skills_match:
            existing_skills = skills_match.group(1).strip()

        tools_match = regex.search(r'\*\*Tools:\*\*\s*\n(.*?)(?=\n\*\*[A-Z]|\n##|$)', existing_step, regex.DOTALL)
        if tools_match:
            existing_tools = tools_match.group(1).strip()

        resources_match = regex.search(r'\*\*Resources:\*\*\s*\n(.*?)(?=\n\*\*[A-Z]|\n##|$)', existing_step, regex.DOTALL)
        if resources_match:
            existing_resources = resources_match.group(1).strip()

        deliverable_match = regex.search(r'\*\*Deliverable:\*\*\s*\n(.*?)(?=\n\*\*[A-Z]|\n##|$)', existing_step, regex.DOTALL)
        if deliverable_match:
            existing_deliverable = deliverable_match.group(1).strip()

        # Build the new step content, preserving existing values when not provided
        new_step_content = f"## Step {step_number}: {step_data.title}\n\n"

        # Use new value if provided, otherwise keep existing
        final_instruction = step_data.instruction if step_data.instruction else existing_instruction
        final_skills = step_data.skills if step_data.skills else existing_skills
        final_tools = step_data.tools if step_data.tools else existing_tools
        final_resources = step_data.resources if step_data.resources else existing_resources
        final_deliverable = step_data.deliverable if step_data.deliverable else existing_deliverable

        if final_instruction:
            new_step_content += f"**Instruction:**\n{final_instruction}\n\n"

        if final_skills:
            new_step_content += f"**Skills:**\n{final_skills}\n\n"

        if final_tools:
            new_step_content += f"**Tools:**\n{final_tools}\n\n"

        if final_resources:
            new_step_content += f"**Resources:**\n{final_resources}\n\n"

        if final_deliverable:
            new_step_content += f"**Deliverable:**\n{final_deliverable}\n\n"

        # Replace the step in the content
        updated_content = regex.sub(
            step_pattern,
            new_step_content,
            content,
            flags=regex.DOTALL
        )

        # Write the updated content back
        with open(workflow_file, 'w', encoding='utf-8') as f:
            f.write(updated_content)

        logger.info(f"Updated step {step_number} in workflow {workflow_id}")

        return {
            "success": True,
            "workflow_id": workflow_id,
            "step_number": step_number,
            "message": f"Step {step_number} updated successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating workflow step: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update workflow step: {str(e)}"
        )