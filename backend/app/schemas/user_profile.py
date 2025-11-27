"""
Pydantic schemas for hybrid Cognito + PostgreSQL user management
"""

from datetime import datetime, date
from typing import Optional, Dict, Any, List
from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel, Field, validator


class UserProfileBase(BaseModel):
    """Base user profile schema"""
    subscription_tier: str = Field(default='free', pattern='^(free|premium|enterprise)$')
    daily_limit: int = Field(default=5, ge=0)
    monthly_limit: int = Field(default=100, ge=0)
    preferred_ai_model: str = Field(default='claude-3-sonnet')
    difficulty_preference: str = Field(default='intermediate', pattern='^(beginner|intermediate|advanced)$')
    theme_preference: str = Field(default='light', pattern='^(light|dark|auto)$')
    language_preference: str = Field(default='en', max_length=10)
    notification_settings: Dict[str, Any] = Field(
        default={"email": True, "courses": True, "updates": False}
    )
    onboarding_completed: bool = Field(default=False)


class UserProfileCreate(UserProfileBase):
    """Create user profile schema"""
    cognito_sub: str = Field(..., max_length=255)
    user_metadata: Dict[str, Any] = Field(default={})


class UserProfileUpdate(BaseModel):
    """Update user profile schema"""
    subscription_tier: Optional[str] = Field(None, pattern='^(free|premium|enterprise)$')
    daily_limit: Optional[int] = Field(None, ge=0)
    monthly_limit: Optional[int] = Field(None, ge=0)
    preferred_ai_model: Optional[str] = None
    difficulty_preference: Optional[str] = Field(None, pattern='^(beginner|intermediate|advanced)$')
    theme_preference: Optional[str] = Field(None, pattern='^(light|dark|auto)$')
    language_preference: Optional[str] = Field(None, max_length=10)
    notification_settings: Optional[Dict[str, Any]] = None
    onboarding_completed: Optional[bool] = None


class UserProfile(UserProfileBase):
    """User profile response schema"""
    profile_id: UUID
    cognito_sub: str
    courses_created: int
    total_courses_completed: int
    total_learning_hours: Decimal
    current_streak_days: int
    longest_streak_days: int
    last_activity_date: Optional[date]
    user_metadata: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True


# API Keys Schemas
class UserAPIKeysBase(BaseModel):
    """Base API keys schema"""
    key_status: Dict[str, bool] = Field(
        default={"openai": False, "anthropic": False, "google": False, "aws_bedrock": False}
    )


class UserAPIKeysUpdate(BaseModel):
    """Update API keys schema (for encrypted keys)"""
    openai_key: Optional[str] = Field(None, description="OpenAI API key (will be encrypted)")
    anthropic_key: Optional[str] = Field(None, description="Anthropic API key (will be encrypted)")
    google_key: Optional[str] = Field(None, description="Google API key (will be encrypted)")
    aws_bedrock_key: Optional[str] = Field(None, description="AWS Bedrock API key (will be encrypted)")


class UserAPIKeys(UserAPIKeysBase):
    """API keys response schema (without actual keys)"""
    profile_id: UUID
    cognito_sub: str
    encryption_key_id: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True


# Course Schemas
class UserCourseBase(BaseModel):
    """Base user course schema"""
    title: str = Field(..., max_length=500)
    topic: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    ai_model: Optional[str] = Field(None, max_length=100)
    difficulty_level: Optional[str] = Field(None, pattern='^(beginner|intermediate|advanced)$')
    estimated_duration: Optional[str] = Field(None, max_length=100)
    is_public: bool = Field(default=False)
    tags: Optional[List[str]] = Field(default=[])


class UserCourseCreate(UserCourseBase):
    """Create user course schema"""
    course_data: Dict[str, Any] = Field(..., description="Full course content as JSON")


class UserCourseUpdate(BaseModel):
    """Update user course schema"""
    title: Optional[str] = Field(None, max_length=500)
    topic: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    course_data: Optional[Dict[str, Any]] = None
    ai_model: Optional[str] = Field(None, max_length=100)
    difficulty_level: Optional[str] = Field(None, pattern='^(beginner|intermediate|advanced)$')
    estimated_duration: Optional[str] = Field(None, max_length=100)
    completion_status: Optional[str] = Field(
        None, pattern='^(not_started|in_progress|completed|archived)$'
    )
    progress_percentage: Optional[Decimal] = Field(None, ge=0, le=100)
    is_public: Optional[bool] = None
    is_published: Optional[bool] = None
    tags: Optional[List[str]] = None


class UserCourse(UserCourseBase):
    """User course response schema"""
    course_id: UUID
    profile_id: UUID
    cognito_sub: str
    course_data: Dict[str, Any]
    completion_status: str
    progress_percentage: Decimal
    is_published: bool
    share_token: Optional[str]
    view_count: int
    completion_count: int
    rating: Decimal
    created_at: datetime
    updated_at: datetime
    last_accessed: Optional[datetime]
    completed_at: Optional[datetime]
    
    @validator('rating')
    def validate_rating(cls, v):
        if v < 0 or v > 5:
            raise ValueError('Rating must be between 0 and 5')
        return v
    
    class Config:
        orm_mode = True


# Course Enrollment Schemas
class CourseEnrollmentBase(BaseModel):
    """Base course enrollment schema"""
    enrollment_type: str = Field(default='free', pattern='^(free|premium)$')


class CourseEnrollmentCreate(CourseEnrollmentBase):
    """Create course enrollment schema"""
    course_id: UUID


class CourseEnrollmentUpdate(BaseModel):
    """Update course enrollment schema"""
    progress_percentage: Optional[Decimal] = Field(None, ge=0, le=100)
    completion_status: Optional[str] = Field(
        None, pattern='^(not_started|in_progress|completed|dropped)$'
    )
    time_spent_minutes: Optional[int] = Field(None, ge=0)
    last_lesson_completed: Optional[int] = Field(None, ge=0)
    quiz_scores: Optional[List[Dict[str, Any]]] = None
    notes: Optional[List[Dict[str, Any]]] = None


class CourseEnrollment(CourseEnrollmentBase):
    """Course enrollment response schema"""
    enrollment_id: UUID
    profile_id: UUID
    cognito_sub: str
    course_id: UUID
    progress_percentage: Decimal
    completion_status: str
    time_spent_minutes: int
    last_lesson_completed: int
    quiz_scores: List[Dict[str, Any]]
    notes: List[Dict[str, Any]]
    enrolled_at: datetime
    last_accessed: datetime
    completed_at: Optional[datetime]
    
    class Config:
        orm_mode = True


# Achievement Schemas
class UserAchievementBase(BaseModel):
    """Base user achievement schema"""
    achievement_type: str = Field(..., pattern='^(course_creator|course_completer|streak_master|knowledge_seeker|mentor|early_adopter|power_user)$')
    achievement_name: str = Field(..., max_length=255)
    description: Optional[str] = None
    points_earned: int = Field(default=0, ge=0)
    level_achieved: int = Field(default=1, ge=1)


class UserAchievementCreate(UserAchievementBase):
    """Create user achievement schema"""
    pass


class UserAchievement(UserAchievementBase):
    """User achievement response schema"""
    achievement_id: UUID
    profile_id: UUID
    cognito_sub: str
    earned_at: datetime
    
    class Config:
        orm_mode = True


# Activity Log Schemas
class UserActivityLogBase(BaseModel):
    """Base user activity log schema"""
    action: str = Field(..., pattern='^(course_create|course_update|course_delete|course_view|course_complete|enrollment_create|enrollment_complete|enrollment_drop|api_key_update|profile_update|preference_update|quiz_attempt|lesson_complete|note_create)$')
    resource_type: Optional[str] = Field(None, max_length=50)
    resource_id: Optional[str] = Field(None, max_length=255)
    details: Dict[str, Any] = Field(default={})


class UserActivityLogCreate(UserActivityLogBase):
    """Create user activity log schema"""
    ip_address: Optional[str] = Field(None, max_length=45)
    user_agent: Optional[str] = None
    session_id: Optional[str] = Field(None, max_length=255)


class UserActivityLog(UserActivityLogBase):
    """User activity log response schema"""
    log_id: UUID
    profile_id: Optional[UUID]
    cognito_sub: Optional[str]
    ip_address: Optional[str]
    user_agent: Optional[str]
    session_id: Optional[str]
    created_at: datetime
    
    class Config:
        orm_mode = True


# Dashboard and Analytics Schemas
class UserDashboardStats(BaseModel):
    """User dashboard statistics"""
    profile_id: UUID
    subscription_tier: str
    courses_created: int
    courses_completed: int
    total_enrollments: int
    current_streak_days: int
    total_learning_hours: Decimal
    achievement_count: int
    api_keys_configured: Dict[str, bool]


class LearningProgress(BaseModel):
    """Learning progress summary"""
    total_courses: int
    completed_courses: int
    in_progress_courses: int
    total_learning_time_hours: Decimal
    average_completion_rate: Decimal
    streak_days: int
    achievements_earned: int


class CourseAnalytics(BaseModel):
    """Course analytics"""
    course_id: UUID
    title: str
    view_count: int
    completion_count: int
    completion_rate: Decimal
    average_rating: Decimal
    total_enrollments: int
    created_at: datetime


# Sync and Integration Schemas
class CognitoUserSync(BaseModel):
    """Schema for syncing user data from Cognito"""
    cognito_sub: str = Field(..., max_length=255)
    email: str = Field(..., max_length=255)
    name: Optional[str] = Field(None, max_length=255)
    email_verified: bool = Field(default=False)
    custom_organization: Optional[str] = Field(None, max_length=255)


class UserProfileSync(BaseModel):
    """Response schema for user profile sync"""
    profile_id: UUID
    cognito_sub: str
    synced: bool
    created_new: bool
    updated_at: datetime