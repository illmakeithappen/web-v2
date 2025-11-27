"""
Bedrock Course Generator API Endpoints
FastAPI routes for AI-powered course generation using AWS Bedrock
"""
import sys
import os
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from typing import List, Dict, Optional
from pydantic import BaseModel, Field

# Import course generation models

from app.models.course_model.bedrock_course_generator import BedrockCourseGenerator, create_bedrock_course
from app.models.course_model.course_models import (
    CourseRequest, CourseLevel, AIModel, GeneratedCourse,
    CourseStatus, AccessType
)
from app.models.course_model.course_repository import CourseRepository

router = APIRouter()


# Response models
class CourseGenerationResponse(BaseModel):
    """Response model for course generation"""
    success: bool
    course_id: Optional[str] = None
    message: str
    course: Optional[Dict] = None
    generation_time: Optional[float] = None


class CourseListResponse(BaseModel):
    """Response model for course listing"""
    courses: List[Dict]
    total_count: int
    page: int
    limit: int


class AvailableModelsResponse(BaseModel):
    """Available AI models for course generation"""
    models: Dict[str, Dict[str, str]]
    default_model: str
    bedrock_available: bool


# Course generation endpoints
@router.post("/generate", response_model=CourseGenerationResponse)
async def generate_bedrock_course(
    request: CourseRequest,
    background_tasks: BackgroundTasks
):
    """
    Generate a new course using AWS Bedrock AI models
    
    - **topic**: Main course topic (required)
    - **level**: Difficulty level (beginner/intermediate/advanced)
    - **duration**: Course duration (e.g., "4 weeks", "10 hours")
    - **ai_model**: AI model to use for generation
    - **learning_objectives**: List of learning objectives
    - **include_assessments**: Whether to include quizzes and assessments
    - **include_projects**: Whether to include hands-on projects
    """
    try:
        import time
        import sys
        start_time = time.time()

        print(f"🎬 Course generation started for: {request.topic}")
        print(f"⚙️  Parameters: level={request.level.value}, duration={request.duration}")

        # Initialize the Bedrock generator
        generator = BedrockCourseGenerator()

        # Generate the course
        course = await generator.generate_course(request)

        generation_time = time.time() - start_time
        print(f"⏱️  Generation completed in {generation_time:.2f} seconds")
        
        # Convert course to dictionary for response
        course_dict = {
            "course_id": course.course_id,
            "title": course.title,
            "slug": course.slug,
            "description": course.description,
            "level": course.level.value,
            "duration": course.duration,
            "modules": [
                {
                    "module_id": module.module_id,
                    "title": module.title,
                    "description": module.description,
                    "duration": module.duration,
                    "objectives": module.objectives,
                    "content_sections": len(module.content_sections),
                    "activities": len(module.activities),
                    "has_assessment": module.assessment is not None
                }
                for module in course.modules
            ],
            "prerequisites": course.prerequisites,
            "learning_objectives": course.learning_objectives,
            "target_audience": course.target_audience,
            "tags": course.tags,
            "status": course.status.value,
            "metadata": course.metadata
        }
        
        response = CourseGenerationResponse(
            success=True,
            course_id=course.course_id,
            message=f"Course '{course.title}' generated successfully with {len(course.modules)} modules",
            course=course_dict,
            generation_time=round(generation_time, 2)
        )

        # Log response size for debugging
        import json
        response_json = json.dumps(response.dict())
        response_size = len(response_json.encode('utf-8'))
        response_size_kb = response_size / 1024

        print(f"📊 Response size: {response_size_kb:.2f} KB ({response_size} bytes)")
        print(f"📦 Response structure: success={response.success}, course_id={response.course_id}")
        print(f"✅ Returning successful response to frontend")

        return response
        
    except Exception as e:
        print(f"Course generation error: {e}")
        import traceback
        traceback.print_exc()
        
        return CourseGenerationResponse(
            success=False,
            message=f"Failed to generate course: {str(e)}"
        )


@router.post("/generate-test", response_model=CourseGenerationResponse)
async def generate_test_course():
    """
    Lightweight test endpoint that returns a minimal mock course
    Used for debugging and verifying the frontend-backend communication
    """
    import time
    start_time = time.time()

    print("🧪 Test endpoint called")

    # Simulate some processing time
    time.sleep(0.5)

    mock_course = {
        "course_id": "test_course_123",
        "title": "Test Course - Frontend Communication Check",
        "slug": "test-course",
        "description": "This is a test course to verify frontend-backend communication is working correctly.",
        "level": "beginner",
        "duration": "1 hour",
        "modules": [
            {
                "module_id": "test_module_1",
                "title": "Test Module 1",
                "description": "First test module",
                "duration": "30 minutes",
                "objectives": ["Verify communication", "Check rendering"],
                "content_sections": 2,
                "activities": 1,
                "has_assessment": True
            },
            {
                "module_id": "test_module_2",
                "title": "Test Module 2",
                "description": "Second test module",
                "duration": "30 minutes",
                "objectives": ["Validate state updates", "Confirm UI display"],
                "content_sections": 2,
                "activities": 1,
                "has_assessment": False
            }
        ],
        "prerequisites": ["None - this is a test"],
        "learning_objectives": ["Verify system is working", "Debug any issues"],
        "target_audience": ["Developers", "Testers"],
        "tags": ["test", "debug", "system-check"],
        "status": "active",
        "metadata": {"uses_bedrock": False, "is_test": True}
    }

    generation_time = time.time() - start_time

    response = CourseGenerationResponse(
        success=True,
        course_id="test_course_123",
        message="Test course generated successfully",
        course=mock_course,
        generation_time=round(generation_time, 2)
    )

    import json
    response_size = len(json.dumps(response.dict()).encode('utf-8')) / 1024

    print(f"🧪 Test response generated ({response_size:.2f} KB)")
    print(f"✅ Returning test course to frontend")

    return response


class SimpleCourseRequest(BaseModel):
    topic: str
    level: str = "beginner"
    duration: str = "4 weeks"
    ai_model: str = "bedrock-claude-sonnet"

@router.post("/generate-simple")
async def generate_simple_course(request: SimpleCourseRequest):
    """
    Simple course generation endpoint with minimal parameters
    """
    try:
        # Convert string level to enum
        course_level = CourseLevel(request.level.lower())
        
        # Convert AI model string to enum
        if request.ai_model == "template":
            model_enum = AIModel.TEMPLATE
        elif request.ai_model.startswith("bedrock-"):
            model_key = request.ai_model.replace("bedrock-", "").replace("-", "_").upper()
            model_enum = AIModel(f"BEDROCK_{model_key}")
        else:
            model_enum = AIModel.TEMPLATE  # Default fallback
        
        # Create course request
        course_request = CourseRequest(
            topic=request.topic,
            level=course_level,
            duration=request.duration,
            ai_model=model_enum,
            include_assessments=True,
            include_projects=True
        )
        
        # Use the main generation endpoint
        return await generate_bedrock_course(course_request, BackgroundTasks())
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid parameter: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Course generation failed: {str(e)}")


# Configuration endpoints (must be before /{course_id} to avoid path conflicts)
@router.get("/models/available", response_model=AvailableModelsResponse)
async def get_available_models():
    """
    Get list of available AI models for course generation
    """
    try:
        generator = BedrockCourseGenerator()

        # Check if Bedrock is available
        bedrock_available = generator.bedrock_client is not None

        models = {
            "bedrock": {
                "claude-3-haiku": "Fast, efficient model for quick course outlines",
                "claude-3-sonnet": "Balanced performance for general course generation",
                "claude-3-opus": "Most capable model for complex, detailed courses",
                "titan-text": "AWS optimized model for AWS-focused content",
                "jurassic-2": "Multilingual model for international courses",
                "llama2-70b": "Open source model for technical content"
            },
            "template": {
                "template": "Template-based generation (no AI required)"
            }
        }

        if not bedrock_available:
            models["bedrock"] = {
                key: f"{desc} (Currently unavailable - check AWS configuration)"
                for key, desc in models["bedrock"].items()
            }

        return AvailableModelsResponse(
            models=models,
            default_model="bedrock-claude-sonnet",
            bedrock_available=bedrock_available
        )

    except Exception as e:
        return AvailableModelsResponse(
            models={"template": {"template": "Template-based generation (fallback)"}},
            default_model="template",
            bedrock_available=False
        )


# System Prompts endpoints (must be before /{course_id})
@router.get("/prompts")
async def get_system_prompts():
    """
    Get the current system prompts used for course generation

    Returns the prompts loaded from course_generation.md configuration file.
    These prompts control how Claude generates courses via AWS Bedrock.
    """
    try:
        from app.services.prompt_loader import get_prompt_loader

        loader = get_prompt_loader()
        prompts = loader.load_course_generation_prompts()

        return {
            "success": True,
            "prompts": prompts,
            "source": "backend/app/config/prompts/course_generation.md",
            "count": len(prompts),
            "available_sections": list(prompts.keys())
        }

    except Exception as e:
        print(f"❌ Error retrieving prompts: {type(e).__name__} - {str(e)}")
        import traceback
        traceback.print_exc()

        # Return error response with proper status
        raise HTTPException(
            status_code=500,
            detail=f"Failed to load system prompts: {str(e)}"
        )


@router.put("/prompts")
async def update_system_prompts(prompts: dict):
    """
    Update system prompts and save to markdown file

    Accepts a JSON object where keys are prompt section names
    and values are the prompt content.

    Example:
    {
        "Course Outline Generation Prompt": "You are an expert...",
        "Module Content Generation Prompt": "You are an instructor..."
    }
    """
    try:
        from app.services.prompt_loader import get_prompt_loader

        # Validate that prompts is a dictionary
        if not isinstance(prompts, dict):
            raise HTTPException(
                status_code=400,
                detail="Prompts must be a dictionary of section_name: content"
            )

        # Validate that all values are strings
        for key, value in prompts.items():
            if not isinstance(key, str) or not isinstance(value, str):
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid prompt format for '{key}'. Both keys and values must be strings."
                )

        # Save prompts
        loader = get_prompt_loader()
        success = loader.save_prompts(prompts)

        if not success:
            raise HTTPException(
                status_code=500,
                detail="Failed to save prompts to file system"
            )

        # Reload to verify
        updated_prompts = loader.reload_prompts()

        return {
            "success": True,
            "message": f"Successfully updated {len(prompts)} system prompts",
            "prompts": updated_prompts,
            "source": "backend/app/config/prompts/course_generation.md"
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error updating prompts: {type(e).__name__} - {str(e)}")
        import traceback
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to update system prompts: {str(e)}"
        )


# Health check for Bedrock service
@router.get("/health/bedrock")
async def bedrock_health_check():
    """
    Check AWS Bedrock service availability
    """
    try:
        generator = BedrockCourseGenerator()

        return {
            "bedrock_available": generator.bedrock_client is not None,
            "aws_region": generator.aws_region,
            "available_models": len(generator.bedrock_models),
            "repository_status": "connected",
            "service_status": "operational" if generator.bedrock_client else "fallback_mode"
        }

    except Exception as e:
        return {
            "bedrock_available": False,
            "service_status": "error",
            "error_message": str(e)
        }


# Search courses
@router.get("/search")
async def search_bedrock_courses(
    query: str,
    level: Optional[str] = None,
    limit: int = 20
):
    """
    Search Bedrock-generated courses
    """
    try:
        repo = CourseRepository()

        filters = {}
        if level:
            filters['level'] = level

        courses = await repo.search_courses(query, filters)

        # Filter for Bedrock-generated courses
        bedrock_courses = [
            course for course in courses
            if course.get('metadata', {}).get('uses_bedrock', False)
        ][:limit]

        return {
            "query": query,
            "results": bedrock_courses,
            "count": len(bedrock_courses)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


# Course management endpoints
@router.get("/list", response_model=CourseListResponse)
async def list_bedrock_courses(
    page: int = 1,
    limit: int = 10,
    status: Optional[str] = None,
    level: Optional[str] = None
):
    """
    List all Bedrock-generated courses with pagination
    """
    try:
        repo = CourseRepository()
        skip = (page - 1) * limit

        # Get courses from repository
        courses = await repo.list_courses(
            skip=skip,
            limit=limit,
            status=status,
            level=level
        )

        # Filter for Bedrock-generated courses
        bedrock_courses = [
            course for course in courses
            if course.get('metadata', {}).get('uses_bedrock', False)
        ]

        return CourseListResponse(
            courses=bedrock_courses,
            total_count=len(bedrock_courses),
            page=page,
            limit=limit
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list courses: {str(e)}")


# Path parameter routes (must be LAST to avoid conflicts)
@router.get("/{course_id}")
async def get_bedrock_course(course_id: str):
    """
    Get a specific Bedrock-generated course by ID
    """
    try:
        repo = CourseRepository()
        course = await repo.get_course(course_id)
        
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        
        # Verify it's a Bedrock-generated course
        if not course.get('metadata', {}).get('uses_bedrock', False):
            raise HTTPException(status_code=404, detail="Course not generated by Bedrock")
        
        return course
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve course: {str(e)}")


@router.delete("/{course_id}")
async def delete_bedrock_course(course_id: str):
    """
    Delete a Bedrock-generated course
    """
    try:
        repo = CourseRepository()
        
        # Check if course exists and is Bedrock-generated
        course = await repo.get_course(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        
        if not course.get('metadata', {}).get('uses_bedrock', False):
            raise HTTPException(status_code=403, detail="Can only delete Bedrock-generated courses")
        
        # Update course status to archived instead of hard delete
        success = await repo.update_course_status(course_id, "archived")
        
        if success:
            return {"message": f"Course {course_id} has been archived", "success": True}
        else:
            raise HTTPException(status_code=500, detail="Failed to archive course")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete course: {str(e)}")
