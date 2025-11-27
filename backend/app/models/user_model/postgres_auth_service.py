"""
PostgreSQL-based User Authentication System
Professional implementation with bcrypt, AWS RDS integration, and proper security
"""

import bcrypt
import secrets
import json
import asyncio
from datetime import datetime, timedelta
from typing import Dict, Optional, Any, List
from uuid import UUID, uuid4
import jwt
import asyncpg
from pydantic import BaseModel, EmailStr, Field

from ...core.config import settings


# Configuration
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24


class UserRegistration(BaseModel):
    """User registration model"""
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    full_name: str = Field(..., min_length=2, max_length=255)
    organization: Optional[str] = Field(None, max_length=255)


class UserLogin(BaseModel):
    """User login model"""
    email: EmailStr
    password: str


class UserProfile(BaseModel):
    """User profile model"""
    user_id: str
    email: str
    full_name: str
    organization: Optional[str]
    created_at: str
    last_login: Optional[str]
    is_verified: bool
    subscription_tier: str = "free"
    daily_limit: int = 10
    monthly_limit: int = 100
    courses_created: int = 0
    api_keys_configured: Dict[str, bool]


class UserCourse(BaseModel):
    """User course model"""
    course_id: str
    title: str
    topic: Optional[str]
    description: Optional[str]
    difficulty_level: Optional[str]
    estimated_duration: Optional[str]
    created_at: str
    is_public: bool = False
    view_count: int = 0
    rating: float = 0.0


class PostgreSQLAuthService:
    """PostgreSQL-based authentication service for AWS RDS"""

    def __init__(self):
        self.connection_pool = None

    async def get_connection_pool(self) -> asyncpg.Pool:
        """Get or create connection pool"""
        if not self.connection_pool:
            self.connection_pool = await asyncpg.create_pool(
                host=settings.DATABASE_HOST,
                port=int(settings.DATABASE_PORT),
                user=settings.DATABASE_USER,
                password=settings.DATABASE_PASSWORD,
                database=settings.DATABASE_NAME,
                min_size=5,
                max_size=20,
                command_timeout=60,
                ssl='require'  # Required for AWS RDS
            )
        return self.connection_pool

    def hash_password(self, password: str) -> str:
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt()
        password_hash = bcrypt.hashpw(password.encode('utf-8'), salt)
        return password_hash.decode('utf-8')

    def verify_password(self, password: str, password_hash: str) -> bool:
        """Verify password against bcrypt hash"""
        return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))

    def generate_user_id(self) -> str:
        """Generate unique user ID"""
        return str(uuid4())

    def create_access_token(self, user_id: str, email: str) -> str:
        """Create JWT access token"""
        expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
        to_encode = {
            "user_id": user_id,
            "email": email,
            "exp": expire,
            "iat": datetime.utcnow(),
            "sub": user_id
        }
        encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    def verify_token(self, token: str) -> Optional[Dict]:
        """Verify JWT token"""
        try:
            payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.JWTError:
            return None

    async def log_user_activity(self, user_id: str, action: str, details: Dict = None, ip_address: str = None, user_agent: str = None):
        """Log user activity for audit trail"""
        pool = await self.get_connection_pool()
        async with pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO user_activity_log (user_id, action, details, ip_address, user_agent)
                VALUES ($1, $2, $3, $4, $5)
            """, UUID(user_id), action, json.dumps(details or {}), ip_address, user_agent)

    async def register_user(self, registration: UserRegistration, ip_address: str = None, user_agent: str = None) -> Dict:
        """Register a new user in PostgreSQL"""
        pool = await self.get_connection_pool()
        async with pool.acquire() as conn:
            try:
                # Check if email already exists
                existing_user = await conn.fetchrow(
                    "SELECT user_id FROM users WHERE email = $1", 
                    registration.email
                )
                if existing_user:
                    return {"success": False, "message": "Email already registered"}

                # Create new user
                user_id = self.generate_user_id()
                password_hash = self.hash_password(registration.password)
                now = datetime.utcnow()

                # Insert user
                await conn.execute("""
                    INSERT INTO users (
                        user_id, email, password_hash, full_name, 
                        organization, created_at, is_active
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                """, UUID(user_id), registration.email, password_hash, 
                    registration.full_name, registration.organization, now, True)

                # Initialize empty API keys
                await conn.execute("""
                    INSERT INTO user_api_keys (user_id) VALUES ($1)
                """, UUID(user_id))

                # Create access token
                token = self.create_access_token(user_id, registration.email)
                
                # Store session
                session_id = str(uuid4())
                token_hash = bcrypt.hashpw(token.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                expires_at = now + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)

                await conn.execute("""
                    INSERT INTO user_sessions (
                        session_id, user_id, token_hash, expires_at, ip_address, user_agent
                    ) VALUES ($1, $2, $3, $4, $5, $6)
                """, UUID(session_id), UUID(user_id), token_hash, expires_at, ip_address, user_agent)

                # Log registration
                await self.log_user_activity(
                    user_id, "register", 
                    {"organization": registration.organization},
                    ip_address, user_agent
                )

                return {
                    "success": True,
                    "message": "Registration successful",
                    "user_id": user_id,
                    "session_id": session_id,
                    "token": token,
                    "user": {
                        "user_id": user_id,
                        "email": registration.email,
                        "full_name": registration.full_name,
                        "organization": registration.organization,
                        "subscription_tier": "free",
                        "is_verified": False
                    }
                }

            except Exception as e:
                return {"success": False, "message": f"Registration failed: {str(e)}"}

    async def login_user(self, login: UserLogin, ip_address: str = None, user_agent: str = None) -> Dict:
        """Authenticate user and create session"""
        pool = await self.get_connection_pool()
        async with pool.acquire() as conn:
            try:
                # Get user by email
                user_row = await conn.fetchrow("""
                    SELECT user_id, email, password_hash, full_name, organization,
                           subscription_tier, daily_limit, monthly_limit, courses_created,
                           is_active, is_verified, created_at, last_login
                    FROM users 
                    WHERE email = $1 AND is_active = TRUE
                """, login.email)

                if not user_row:
                    return {"success": False, "message": "Invalid email or password"}

                # Verify password
                if not self.verify_password(login.password, user_row['password_hash']):
                    return {"success": False, "message": "Invalid email or password"}

                user_id = str(user_row['user_id'])
                now = datetime.utcnow()

                # Update last login
                await conn.execute("""
                    UPDATE users SET last_login = $1 WHERE user_id = $2
                """, now, user_row['user_id'])

                # Create session token
                token = self.create_access_token(user_id, user_row['email'])
                
                # Store session
                session_id = str(uuid4())
                token_hash = bcrypt.hashpw(token.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                expires_at = now + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)

                await conn.execute("""
                    INSERT INTO user_sessions (
                        session_id, user_id, token_hash, expires_at, ip_address, user_agent
                    ) VALUES ($1, $2, $3, $4, $5, $6)
                """, UUID(session_id), UUID(user_id), token_hash, expires_at, ip_address, user_agent)

                # Get API keys status
                api_keys_row = await conn.fetchrow("""
                    SELECT openai_key_encrypted, anthropic_key_encrypted, google_key_encrypted,
                           aws_access_key_encrypted, aws_secret_key_encrypted
                    FROM user_api_keys WHERE user_id = $1
                """, user_row['user_id'])

                api_status = {
                    "openai": bool(api_keys_row and api_keys_row['openai_key_encrypted']),
                    "anthropic": bool(api_keys_row and api_keys_row['anthropic_key_encrypted']),
                    "google": bool(api_keys_row and api_keys_row['google_key_encrypted']),
                    "aws": bool(api_keys_row and api_keys_row['aws_access_key_encrypted'])
                }

                # Log login
                await self.log_user_activity(
                    user_id, "login", {"login_method": "email"},
                    ip_address, user_agent
                )

                return {
                    "success": True,
                    "message": "Login successful",
                    "token": token,
                    "session_id": session_id,
                    "user": {
                        "user_id": user_id,
                        "email": user_row['email'],
                        "full_name": user_row['full_name'],
                        "organization": user_row['organization'],
                        "subscription_tier": user_row['subscription_tier'],
                        "daily_limit": user_row['daily_limit'],
                        "monthly_limit": user_row['monthly_limit'],
                        "courses_created": user_row['courses_created'],
                        "is_verified": user_row['is_verified'],
                        "api_keys_configured": api_status
                    }
                }

            except Exception as e:
                return {"success": False, "message": f"Login failed: {str(e)}"}

    async def get_user_by_token(self, token: str) -> Optional[Dict]:
        """Get user information from token"""
        payload = self.verify_token(token)
        if not payload:
            return None

        pool = await self.get_connection_pool()
        async with pool.acquire() as conn:
            try:
                user_row = await conn.fetchrow("""
                    SELECT u.user_id, u.email, u.full_name, u.organization,
                           u.subscription_tier, u.daily_limit, u.monthly_limit,
                           u.courses_created, u.is_verified, u.created_at, u.last_login,
                           COUNT(uc.course_id) as total_courses
                    FROM users u
                    LEFT JOIN user_courses uc ON u.user_id = uc.user_id
                    WHERE u.user_id = $1 AND u.is_active = TRUE
                    GROUP BY u.user_id
                """, UUID(payload['user_id']))

                if user_row:
                    return dict(user_row)
                return None

            except Exception:
                return None

    async def get_user_courses(self, user_id: str, limit: int = 20) -> List[UserCourse]:
        """Get courses created by a user"""
        pool = await self.get_connection_pool()
        async with pool.acquire() as conn:
            try:
                rows = await conn.fetch("""
                    SELECT course_id, title, topic, description, difficulty_level,
                           estimated_duration, created_at, is_public, view_count, rating
                    FROM user_courses
                    WHERE user_id = $1
                    ORDER BY created_at DESC
                    LIMIT $2
                """, UUID(user_id), limit)

                courses = []
                for row in rows:
                    course = UserCourse(
                        course_id=str(row['course_id']),
                        title=row['title'],
                        topic=row['topic'],
                        description=row['description'],
                        difficulty_level=row['difficulty_level'],
                        estimated_duration=row['estimated_duration'],
                        created_at=row['created_at'].isoformat(),
                        is_public=row['is_public'],
                        view_count=row['view_count'],
                        rating=float(row['rating'])
                    )
                    courses.append(course)

                return courses

            except Exception:
                return []

    async def save_user_course(self, user_id: str, course_data: Dict) -> str:
        """Save a course for a user"""
        pool = await self.get_connection_pool()
        async with pool.acquire() as conn:
            try:
                course_id = str(uuid4())
                share_token = secrets.token_urlsafe(16)

                await conn.execute("""
                    INSERT INTO user_courses (
                        course_id, user_id, title, topic, description, course_data,
                        ai_model, difficulty_level, estimated_duration, share_token
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                """, 
                    UUID(course_id), UUID(user_id),
                    course_data.get('title', ''), course_data.get('topic', ''),
                    course_data.get('description', ''), json.dumps(course_data),
                    course_data.get('ai_model', 'template'), course_data.get('level', 'beginner'),
                    course_data.get('duration', ''), share_token
                )

                # Update user's course count
                await conn.execute("""
                    UPDATE users SET courses_created = courses_created + 1
                    WHERE user_id = $1
                """, UUID(user_id))

                # Log course creation
                await self.log_user_activity(
                    user_id, "course_create", 
                    {"course_id": course_id, "title": course_data.get('title', '')}
                )

                return course_id

            except Exception:
                return ""

    async def logout_user(self, session_id: str, user_id: str = None) -> bool:
        """Logout user by invalidating session"""
        pool = await self.get_connection_pool()
        async with pool.acquire() as conn:
            try:
                # Get user_id if not provided
                if not user_id:
                    session_row = await conn.fetchrow("""
                        SELECT user_id FROM user_sessions WHERE session_id = $1
                    """, UUID(session_id))
                    if session_row:
                        user_id = str(session_row['user_id'])

                # Delete session
                result = await conn.execute("""
                    DELETE FROM user_sessions WHERE session_id = $1
                """, UUID(session_id))

                # Log logout if we have user_id
                if user_id:
                    await self.log_user_activity(user_id, "logout", {"session_id": session_id})

                return "DELETE 1" in result

            except Exception:
                return False

    async def cleanup_expired_sessions(self):
        """Cleanup expired sessions (run periodically)"""
        pool = await self.get_connection_pool()
        async with pool.acquire() as conn:
            try:
                result = await conn.execute("""
                    DELETE FROM user_sessions WHERE expires_at < $1
                """, datetime.utcnow())
                return result
            except Exception:
                return ""

    async def close_connections(self):
        """Close connection pool"""
        if self.connection_pool:
            await self.connection_pool.close()


# Global instance
postgres_auth_service = PostgreSQLAuthService()


# Helper function for dependency injection
async def get_auth_service() -> PostgreSQLAuthService:
    """Get PostgreSQL auth service instance"""
    return postgres_auth_service