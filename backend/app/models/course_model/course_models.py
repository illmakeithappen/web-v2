"""
Course Generator Models
Pydantic models for AI course generation
"""
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum


class CourseLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class CourseStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class AccessType(str, Enum):
    PUBLIC = "public"
    PRIVATE = "private"
    RESTRICTED = "restricted"


class AIModel(str, Enum):
    """Available AI models for course generation"""
    TEMPLATE = "template"  # No AI, template-based
    OPENAI_GPT4 = "gpt-4"
    OPENAI_GPT35 = "gpt-3.5-turbo"
    ANTHROPIC_CLAUDE = "claude-3"
    ANTHROPIC_CLAUDE_INSTANT = "claude-instant"
    GOOGLE_GEMINI = "gemini-pro"
    LOCAL_LLAMA = "llama-2"  # For local models
    MIXTRAL = "mixtral-8x7b"  # Open source alternative
    # AWS Bedrock Models
    BEDROCK_CLAUDE_HAIKU = "bedrock-claude-haiku"
    BEDROCK_CLAUDE_SONNET = "bedrock-claude-sonnet"
    BEDROCK_CLAUDE_OPUS = "bedrock-claude-opus"
    BEDROCK_TITAN = "bedrock-titan-text"
    BEDROCK_JURASSIC = "bedrock-jurassic-2"
    BEDROCK_LLAMA2 = "bedrock-llama2-70b"


class CourseRequest(BaseModel):
    """Request model for course generation"""
    topic: str = Field(..., description="Main topic of the course")
    level: CourseLevel = Field(CourseLevel.BEGINNER, description="Difficulty level")
    duration: str = Field(..., description="Course duration (e.g., '4 weeks', '10 hours')")
    learning_objectives: List[str] = Field(default_factory=list, description="Learning objectives")
    target_audience: str = Field("", description="Target audience description")
    prerequisites: List[str] = Field(default_factory=list, description="Course prerequisites")
    use_databank_resources: bool = Field(True, description="Include Data Bank resources")
    resource_ids: Optional[List[int]] = Field(None, description="Specific resource IDs to include")
    selected_resources: Optional[List[Dict[str, Any]]] = Field(None, description="Pre-selected resources from Data Bank")
    include_assessments: bool = Field(True, description="Generate quizzes and assessments")
    include_projects: bool = Field(True, description="Include hands-on projects")
    language: str = Field("english", description="Course language")
    ai_model: AIModel = Field(AIModel.TEMPLATE, description="AI model to use for generation")
    enable_synthesis: bool = Field(False, description="Enable AI synthesis step for enhanced coherence and cross-module integration")


class ContentSection(BaseModel):
    """Individual content section within a module"""
    title: str
    content_type: str  # text, video, code, interactive
    content: str
    duration_minutes: int
    resources: List[Dict[str, Any]] = Field(default_factory=list)


class Activity(BaseModel):
    """Learning activity or exercise"""
    title: str
    type: str  # quiz, coding_exercise, project, discussion
    description: str
    instructions: List[str]
    duration_minutes: int
    difficulty: CourseLevel
    solution: Optional[str] = None
    hints: List[str] = Field(default_factory=list)


class Assessment(BaseModel):
    """Module assessment"""
    type: str  # quiz, assignment, project
    title: str
    questions: List[Dict[str, Any]]
    passing_score: float = 0.7
    max_attempts: int = 3
    time_limit_minutes: Optional[int] = None


class CourseModule(BaseModel):
    """Individual course module"""
    module_id: str
    title: str
    description: str
    duration: str
    objectives: List[str]
    content_sections: List[ContentSection]
    activities: List[Activity]
    assessment: Optional[Assessment]
    resources: List[Dict[str, Any]]
    order: int


class LearningPath(BaseModel):
    """Learning path structure"""
    total_duration: str
    daily_commitment: str
    milestones: List[Dict[str, Any]]
    suggested_schedule: Dict[str, List[str]]


class Course(BaseModel):
    """Complete generated course"""
    course_id: str
    title: str
    slug: str
    description: str
    level: CourseLevel
    duration: str
    modules: List[CourseModule]
    prerequisites: List[str]
    learning_objectives: List[str]
    target_audience: str
    learning_path: LearningPath
    databank_resources: List[Dict[str, Any]]
    tags: List[str]
    language: str
    status: CourseStatus = CourseStatus.DRAFT
    access_type: AccessType = AccessType.PUBLIC
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    created_by: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

# Alias for backward compatibility
GeneratedCourse = Course


class CourseProgress(BaseModel):
    """User's progress in a course"""
    user_email: str
    course_id: str
    enrolled_at: datetime
    last_accessed: datetime
    modules_completed: List[str]
    current_module: Optional[str]
    overall_progress: float  # 0.0 to 1.0
    quiz_scores: Dict[str, float]
    time_spent_minutes: int
    completion_status: str  # not_started, in_progress, completed
    certificate_issued: bool = False


class CourseExport(BaseModel):
    """Export configuration for courses"""
    course_id: str
    format: str  # scorm, html, pdf, markdown
    include_solutions: bool = False
    include_resources: bool = True
    custom_branding: Optional[Dict[str, Any]] = None

# Additional models for compatibility
class ModuleContent(BaseModel):
    """Module content structure"""
    content_id: str
    module_id: str
    title: str
    content_type: str
    content: str
    order: int
    
class CourseActivity(BaseModel):
    """Course activity structure"""
    activity_id: str
    module_id: str
    title: str
    type: str
    description: str
    instructions: List[str]
    estimated_time: str
    
class CourseAssessment(BaseModel):
    """Course assessment structure"""
    assessment_id: str
    module_id: str
    title: str
    type: str
    questions: List[Dict[str, Any]]
    passing_score: float
    
class CourseProject(BaseModel):
    """Course project structure"""
    project_id: str
    course_id: str
    title: str
    description: str
    requirements: List[str]
    deliverables: List[str]
    evaluation_criteria: Dict[str, float]
    
class InteractiveElement(BaseModel):
    """Interactive learning element"""
    element_id: str
    type: str  # code_editor, quiz, simulation, etc.
    content: Dict[str, Any]
    validation_rules: Optional[Dict[str, Any]] = None
    
class ProgressTracking(BaseModel):
    """Progress tracking model"""
    user_id: str
    course_id: str
    module_progress: Dict[str, float]
    total_progress: float
    last_activity: datetime
    achievements: List[str]
