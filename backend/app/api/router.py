"""Central router - ADD NEW ROUTES HERE"""
from fastapi import APIRouter
from app.api.endpoints.databank import router as databank_router

try:
    from app.api.endpoints.bedrock_courses import router as bedrock_router
    bedrock_available = True
except ImportError as e:
    print(f"Bedrock router not available: {e}")
    bedrock_available = False

try:
    from app.api.endpoints.auth import router as auth_router
    auth_available = True
except ImportError as e:
    print(f"Auth router not available: {e}")
    auth_available = False

try:
    from app.api.endpoints.cognito_auth import router as cognito_auth_router
    cognito_auth_available = True
except ImportError as e:
    print(f"Cognito auth router not available: {e}")
    cognito_auth_available = False

try:
    from app.api.endpoints.chat import router as chat_router
    chat_available = True
except ImportError as e:
    print(f"Chat router not available: {e}")
    chat_available = False

try:
    from app.api.endpoints.hybrid_auth import router as hybrid_auth_router
    hybrid_auth_available = True
except ImportError as e:
    print(f"Hybrid auth router not available: {e}")
    hybrid_auth_available = False

try:
    from app.api.endpoints.mcp_generator import router as mcp_generator_router
    mcp_generator_available = True
except ImportError as e:
    print(f"MCP Generator router not available: {e}")
    mcp_generator_available = False

try:
    from app.api.endpoints.agent import router as agent_router
    agent_available = True
except ImportError as e:
    print(f"Agent router not available: {e}")
    agent_available = False

try:
    from app.api.endpoints.skill_generator import router as skill_generator_router
    skill_generator_available = True
except ImportError as e:
    print(f"Skill Generator router not available: {e}")
    skill_generator_available = False

try:
    from app.api.endpoints.skills import router as skills_router
    skills_available = True
except ImportError as e:
    print(f"Skills router not available: {e}")
    skills_available = False

try:
    from app.api.endpoints.tools import router as tools_router
    tools_available = True
except ImportError as e:
    print(f"Tools router not available: {e}")
    tools_available = False

try:
    from app.api.endpoints.skill_upload import router as skill_upload_router
    skill_upload_available = True
except ImportError as e:
    print(f"Skill Upload router not available: {e}")
    skill_upload_available = False

try:
    from app.api.endpoints.workflow_generator import router as workflow_generator_router
    workflow_generator_available = True
except ImportError as e:
    print(f"Workflow Generator router not available: {e}")
    workflow_generator_available = False

try:
    from app.api.endpoints.docs import router as docs_router
    docs_available = True
except ImportError as e:
    print(f"Docs router not available: {e}")
    docs_available = False

try:
    from app.api.endpoints.subagents import router as subagents_router
    subagents_available = True
except ImportError as e:
    print(f"Subagents router not available: {e}")
    subagents_available = False

api_router = APIRouter()

@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "FARP backend is running!"}

# Include databank routes (always available)
api_router.include_router(databank_router, prefix="/databank", tags=["databank"])

# Conditionally include other routes
if auth_available:
    api_router.include_router(auth_router, prefix="/auth", tags=["authentication"])

# AWS Cognito Authentication (preferred)
if cognito_auth_available:
    api_router.include_router(cognito_auth_router, prefix="/cognito-auth", tags=["cognito-authentication"])

if bedrock_available:
    api_router.include_router(bedrock_router, prefix="/courses/bedrock", tags=["bedrock-courses"])

if chat_available:
    api_router.include_router(chat_router, prefix="/chat", tags=["chat"])

# Hybrid Cognito + PostgreSQL Authentication (recommended approach)
if hybrid_auth_available:
    api_router.include_router(hybrid_auth_router, tags=["hybrid-authentication"])

# MCP Server Generator (AI-powered MCP server creation)
if mcp_generator_available:
    api_router.include_router(mcp_generator_router, prefix="/mcp", tags=["mcp-generator"])

# Agent (Context Collector & Manual Generator with Claude Agent SDK)
if agent_available:
    api_router.include_router(agent_router, prefix="/agent", tags=["agent"])

# Claude Code Skill Generator (AI-powered skill creation)
if skill_generator_available:
    api_router.include_router(skill_generator_router, prefix="/skill-generator", tags=["skill-generator"])

# Skills Management (CRUD operations for saved skills)
if skills_available:
    api_router.include_router(skills_router, prefix="/skills", tags=["skills"])

# Tools Management (read from vault-web/tools)
if tools_available:
    api_router.include_router(tools_router, prefix="/tools", tags=["tools"])

# Skill Upload (Upload skills with file attachments)
if skill_upload_available:
    api_router.include_router(skill_upload_router, prefix="/skill-upload", tags=["skill-upload"])

# Conversational Workflow Generator (Two-phase workflow creation)
if workflow_generator_available:
    api_router.include_router(workflow_generator_router, tags=["workflow-generator"])

# Docs Content Management (CRUD + sync for workflows, skills, tools)
if docs_available:
    api_router.include_router(docs_router, tags=["docs"])

# Subagents Management (read from vault-web/subagents)
if subagents_available:
    api_router.include_router(subagents_router, prefix="/subagents", tags=["subagents"])