"""
CRUD operations for hybrid Cognito + PostgreSQL user management
"""

from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime, date
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_, desc, asc

from ..models.user_profile import (
    UserProfile, UserAPIKeys, UserCourse, CourseEnrollment, 
    UserAchievement, UserActivityLog
)
from ..schemas.user_profile import (
    UserProfileCreate, UserProfileUpdate, UserAPIKeysUpdate,
    UserCourseCreate, UserCourseUpdate, CourseEnrollmentCreate,
    CourseEnrollmentUpdate, UserAchievementCreate, UserActivityLogCreate,
    CognitoUserSync
)


class UserProfileCRUD:
    """CRUD operations for UserProfile"""
    
    @staticmethod
    def get_by_cognito_sub(db: Session, cognito_sub: str) -> Optional[UserProfile]:
        """Get user profile by Cognito sub"""
        return db.query(UserProfile).filter(UserProfile.cognito_sub == cognito_sub).first()
    
    @staticmethod
    def get_by_profile_id(db: Session, profile_id: UUID) -> Optional[UserProfile]:
        """Get user profile by profile ID"""
        return db.query(UserProfile).filter(UserProfile.profile_id == profile_id).first()
    
    @staticmethod
    def create(db: Session, profile_data: UserProfileCreate) -> UserProfile:
        """Create new user profile"""
        db_profile = UserProfile(**profile_data.dict())
        db.add(db_profile)
        db.commit()
        db.refresh(db_profile)
        return db_profile
    
    @staticmethod
    def get_or_create(
        db: Session, 
        cognito_sub: str, 
        email: Optional[str] = None,
        name: Optional[str] = None
    ) -> UserProfile:
        """Get existing profile or create new one"""
        profile = UserProfileCRUD.get_by_cognito_sub(db, cognito_sub)

        if not profile:
            user_metadata = {}
            if email:
                user_metadata['email'] = email
            if name:
                user_metadata['name'] = name
            user_metadata['created_via'] = 'cognito_sync'

            profile_data = UserProfileCreate(
                cognito_sub=cognito_sub,
                user_metadata=user_metadata
            )
            profile = UserProfileCRUD.create(db, profile_data)
        
        return profile
    
    @staticmethod
    def update(
        db: Session, 
        profile_id: UUID, 
        profile_update: UserProfileUpdate
    ) -> Optional[UserProfile]:
        """Update user profile"""
        db_profile = UserProfileCRUD.get_by_profile_id(db, profile_id)
        if not db_profile:
            return None
        
        update_data = profile_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_profile, field, value)
        
        db.commit()
        db.refresh(db_profile)
        return db_profile
    
    @staticmethod
    def sync_from_cognito(
        db: Session, 
        sync_data: CognitoUserSync
    ) -> UserProfile:
        """Sync user data from Cognito"""
        profile = UserProfileCRUD.get_or_create(
            db, 
            sync_data.cognito_sub, 
            sync_data.email, 
            sync_data.name
        )
        
        # Update metadata with latest Cognito info
        metadata_update = {
            'email': sync_data.email,
            'name': sync_data.name or '',
            'email_verified': sync_data.email_verified,
            'last_cognito_sync': datetime.utcnow().isoformat()
        }
        
        if sync_data.custom_organization:
            metadata_update['organization'] = sync_data.custom_organization
        
        profile.user_metadata = {**(profile.user_metadata or {}), **metadata_update}
        db.commit()
        db.refresh(profile)
        
        return profile
    
    @staticmethod
    def get_dashboard_stats(db: Session, cognito_sub: str) -> Dict[str, Any]:
        """Get dashboard statistics for user"""
        # Use the PostgreSQL function for optimized queries
        result = db.execute(
            "SELECT * FROM get_user_dashboard_stats(:cognito_sub)",
            {'cognito_sub': cognito_sub}
        ).fetchone()
        
        if not result:
            return {
                'profile_id': None,
                'subscription_tier': 'free',
                'courses_created': 0,
                'courses_completed': 0,
                'total_enrollments': 0,
                'current_streak_days': 0,
                'total_learning_hours': 0.0,
                'achievement_count': 0,
                'api_keys_configured': {}
            }
        
        return {
            'profile_id': result.profile_id,
            'subscription_tier': result.subscription_tier,
            'courses_created': result.courses_created,
            'courses_completed': result.courses_completed,
            'total_enrollments': result.total_enrollments,
            'current_streak_days': result.current_streak_days,
            'total_learning_hours': result.total_learning_hours,
            'achievement_count': result.achievement_count,
            'api_keys_configured': result.api_keys_configured or {}
        }


class UserAPIKeysCRUD:
    """CRUD operations for UserAPIKeys"""
    
    @staticmethod
    def get_by_profile_id(db: Session, profile_id: UUID) -> Optional[UserAPIKeys]:
        """Get API keys by profile ID"""
        return db.query(UserAPIKeys).filter(UserAPIKeys.profile_id == profile_id).first()
    
    @staticmethod
    def get_by_cognito_sub(db: Session, cognito_sub: str) -> Optional[UserAPIKeys]:
        """Get API keys by Cognito sub"""
        return db.query(UserAPIKeys).filter(UserAPIKeys.cognito_sub == cognito_sub).first()
    
    @staticmethod
    def update_keys(
        db: Session,
        profile_id: UUID,
        cognito_sub: str,
        keys_update: UserAPIKeysUpdate
    ) -> UserAPIKeys:
        """Update or create API keys (with encryption)"""
        db_keys = UserAPIKeysCRUD.get_by_profile_id(db, profile_id)
        
        # For now, we'll store as encrypted placeholder
        # In production, implement proper PGP encryption
        key_status = {}
        
        if not db_keys:
            db_keys = UserAPIKeys(
                profile_id=profile_id,
                cognito_sub=cognito_sub,
                key_status={}
            )
            db.add(db_keys)
        
        # Update encrypted keys (implement actual encryption here)
        update_data = keys_update.dict(exclude_unset=True)
        for key_name, key_value in update_data.items():
            if key_value:
                encrypted_field = f"{key_name.replace('_key', '')}_key_encrypted"
                # TODO: Implement PGP encryption
                setattr(db_keys, encrypted_field, f"ENCRYPTED_{key_value[:10]}...")
                key_status[key_name.replace('_key', '')] = True
        
        db_keys.key_status = {**(db_keys.key_status or {}), **key_status}
        db.commit()
        db.refresh(db_keys)
        return db_keys


class UserCourseCRUD:
    """CRUD operations for UserCourse"""
    
    @staticmethod
    def get_by_id(db: Session, course_id: UUID) -> Optional[UserCourse]:
        """Get course by ID"""
        return db.query(UserCourse).filter(UserCourse.course_id == course_id).first()
    
    @staticmethod
    def get_by_profile(
        db: Session, 
        profile_id: UUID, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[UserCourse]:
        """Get courses by profile ID"""
        return (
            db.query(UserCourse)
            .filter(UserCourse.profile_id == profile_id)
            .order_by(desc(UserCourse.created_at))
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    @staticmethod
    def get_public_courses(
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        topic: Optional[str] = None,
        difficulty: Optional[str] = None
    ) -> List[UserCourse]:
        """Get public courses with optional filters"""
        query = (
            db.query(UserCourse)
            .filter(UserCourse.is_public == True, UserCourse.is_published == True)
        )
        
        if topic:
            query = query.filter(UserCourse.topic.ilike(f"%{topic}%"))
        
        if difficulty:
            query = query.filter(UserCourse.difficulty_level == difficulty)
        
        return (
            query
            .order_by(desc(UserCourse.created_at))
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    @staticmethod
    def create(
        db: Session, 
        profile_id: UUID,
        cognito_sub: str,
        course_data: UserCourseCreate
    ) -> UserCourse:
        """Create new course"""
        db_course = UserCourse(
            profile_id=profile_id,
            cognito_sub=cognito_sub,
            **course_data.dict()
        )
        db.add(db_course)
        
        # Update profile course count
        profile = db.query(UserProfile).filter(UserProfile.profile_id == profile_id).first()
        if profile:
            profile.courses_created += 1
        
        db.commit()
        db.refresh(db_course)
        return db_course
    
    @staticmethod
    def update(
        db: Session, 
        course_id: UUID, 
        course_update: UserCourseUpdate
    ) -> Optional[UserCourse]:
        """Update course"""
        db_course = UserCourseCRUD.get_by_id(db, course_id)
        if not db_course:
            return None
        
        update_data = course_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_course, field, value)
        
        db.commit()
        db.refresh(db_course)
        return db_course
    
    @staticmethod
    def delete(db: Session, course_id: UUID, profile_id: UUID) -> bool:
        """Delete course (only by owner)"""
        db_course = (
            db.query(UserCourse)
            .filter(
                UserCourse.course_id == course_id,
                UserCourse.profile_id == profile_id
            )
            .first()
        )
        
        if not db_course:
            return False
        
        db.delete(db_course)
        
        # Update profile course count
        profile = db.query(UserProfile).filter(UserProfile.profile_id == profile_id).first()
        if profile and profile.courses_created > 0:
            profile.courses_created -= 1
        
        db.commit()
        return True


class CourseEnrollmentCRUD:
    """CRUD operations for CourseEnrollment"""
    
    @staticmethod
    def get_by_id(db: Session, enrollment_id: UUID) -> Optional[CourseEnrollment]:
        """Get enrollment by ID"""
        return db.query(CourseEnrollment).filter(CourseEnrollment.enrollment_id == enrollment_id).first()
    
    @staticmethod
    def get_user_enrollment(
        db: Session, 
        profile_id: UUID, 
        course_id: UUID
    ) -> Optional[CourseEnrollment]:
        """Get specific user enrollment"""
        return (
            db.query(CourseEnrollment)
            .filter(
                CourseEnrollment.profile_id == profile_id,
                CourseEnrollment.course_id == course_id
            )
            .first()
        )
    
    @staticmethod
    def get_user_enrollments(
        db: Session, 
        profile_id: UUID,
        skip: int = 0,
        limit: int = 100
    ) -> List[CourseEnrollment]:
        """Get user's enrollments"""
        return (
            db.query(CourseEnrollment)
            .filter(CourseEnrollment.profile_id == profile_id)
            .order_by(desc(CourseEnrollment.enrolled_at))
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    @staticmethod
    def create(
        db: Session,
        profile_id: UUID,
        cognito_sub: str,
        enrollment_data: CourseEnrollmentCreate
    ) -> Optional[CourseEnrollment]:
        """Create new enrollment"""
        # Check if enrollment already exists
        existing = CourseEnrollmentCRUD.get_user_enrollment(
            db, profile_id, enrollment_data.course_id
        )
        if existing:
            return existing
        
        db_enrollment = CourseEnrollment(
            profile_id=profile_id,
            cognito_sub=cognito_sub,
            **enrollment_data.dict()
        )
        db.add(db_enrollment)
        db.commit()
        db.refresh(db_enrollment)
        return db_enrollment
    
    @staticmethod
    def update_progress(
        db: Session,
        enrollment_id: UUID,
        progress_update: CourseEnrollmentUpdate
    ) -> Optional[CourseEnrollment]:
        """Update enrollment progress"""
        db_enrollment = CourseEnrollmentCRUD.get_by_id(db, enrollment_id)
        if not db_enrollment:
            return None
        
        update_data = progress_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_enrollment, field, value)
        
        # Update last accessed timestamp
        db_enrollment.last_accessed = datetime.utcnow()
        
        # If completed, set completion timestamp
        if progress_update.completion_status == 'completed' and not db_enrollment.completed_at:
            db_enrollment.completed_at = datetime.utcnow()
            
            # Update user profile completion count
            profile = db.query(UserProfile).filter(
                UserProfile.profile_id == db_enrollment.profile_id
            ).first()
            if profile:
                profile.total_courses_completed += 1
        
        db.commit()
        db.refresh(db_enrollment)
        return db_enrollment


class UserActivityLogCRUD:
    """CRUD operations for UserActivityLog"""
    
    @staticmethod
    def create(
        db: Session,
        profile_id: UUID,
        cognito_sub: str,
        activity_data: UserActivityLogCreate
    ) -> UserActivityLog:
        """Create activity log entry"""
        db_log = UserActivityLog(
            profile_id=profile_id,
            cognito_sub=cognito_sub,
            **activity_data.dict()
        )
        db.add(db_log)
        db.commit()
        db.refresh(db_log)
        return db_log
    
    @staticmethod
    def get_user_activity(
        db: Session,
        profile_id: UUID,
        skip: int = 0,
        limit: int = 50,
        action_filter: Optional[str] = None
    ) -> List[UserActivityLog]:
        """Get user activity logs"""
        query = db.query(UserActivityLog).filter(UserActivityLog.profile_id == profile_id)
        
        if action_filter:
            query = query.filter(UserActivityLog.action == action_filter)
        
        return (
            query
            .order_by(desc(UserActivityLog.created_at))
            .offset(skip)
            .limit(limit)
            .all()
        )


class UserAchievementCRUD:
    """CRUD operations for UserAchievement"""
    
    @staticmethod
    def get_user_achievements(
        db: Session,
        profile_id: UUID
    ) -> List[UserAchievement]:
        """Get user achievements"""
        return (
            db.query(UserAchievement)
            .filter(UserAchievement.profile_id == profile_id)
            .order_by(desc(UserAchievement.earned_at))
            .all()
        )
    
    @staticmethod
    def award_achievement(
        db: Session,
        profile_id: UUID,
        cognito_sub: str,
        achievement_data: UserAchievementCreate
    ) -> Optional[UserAchievement]:
        """Award achievement (if not already earned)"""
        # Check if achievement already exists
        existing = (
            db.query(UserAchievement)
            .filter(
                UserAchievement.profile_id == profile_id,
                UserAchievement.achievement_type == achievement_data.achievement_type,
                UserAchievement.level_achieved == achievement_data.level_achieved
            )
            .first()
        )
        
        if existing:
            return existing
        
        db_achievement = UserAchievement(
            profile_id=profile_id,
            cognito_sub=cognito_sub,
            **achievement_data.dict()
        )
        db.add(db_achievement)
        db.commit()
        db.refresh(db_achievement)
        return db_achievement