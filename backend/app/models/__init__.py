"""Models package"""
from .content_model.content_items import ContentItem

# Disabled: Cognito-based models have SQLAlchemy relationship issues
# try:
#     from .user_profile import (
#         UserProfile, UserAPIKeys, UserCourse,
#         CourseEnrollment, UserAchievement, UserActivityLog
#     )
#     hybrid_models_available = True
# except ImportError:
#     hybrid_models_available = False

hybrid_models_available = False

if hybrid_models_available:
    __all__ = [
        "ContentItem",
        "UserProfile", "UserAPIKeys", "UserCourse",
        "CourseEnrollment", "UserAchievement", "UserActivityLog"
    ]
else:
    __all__ = ["ContentItem"]