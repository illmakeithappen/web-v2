"""
Authentication API endpoints
"""
from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from typing import Dict, Optional
import os
import sys

# Add the project root to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.models.user_model.postgres_auth_service import (
    PostgreSQLAuthService, UserRegistration, UserLogin, get_auth_service, postgres_auth_service
)
from app.core.config import settings

router = APIRouter()

# Global auth service instance
auth_service = postgres_auth_service

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    organization: Optional[str] = None

class APIKeysRequest(BaseModel):
    openai: Optional[str] = None
    anthropic: Optional[str] = None
    google: Optional[str] = None

def get_user_from_request(request: Request) -> Optional[Dict]:
    """Extract user from request token"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    
    token = auth_header.split(" ")[1]
    return auth_service.get_user_by_token(token)

@router.post("/register")
async def register(request: RegisterRequest):
    """Register a new user - simplified for existing schema"""
    try:
        import bcrypt
        import jwt
        from datetime import datetime, timedelta
        import asyncpg

        # Connect to database using environment variables
        conn = await asyncpg.connect(
            host=settings.DATABASE_HOST,
            port=int(settings.DATABASE_PORT),
            user=settings.DATABASE_USER,
            password=settings.DATABASE_PASSWORD,
            database=settings.DATABASE_NAME,
            ssl='require'
        )

        try:
            # Check if email exists
            existing = await conn.fetchval("SELECT id FROM users WHERE email = $1", request.email)
            if existing:
                raise HTTPException(status_code=400, detail="Email already registered")

            # Hash password
            password_hash = bcrypt.hashpw(request.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

            # Generate username from email
            username = request.email.split('@')[0]
            # Make username unique if needed
            counter = 1
            while await conn.fetchval("SELECT id FROM users WHERE username = $1", username):
                username = f"{request.email.split('@')[0]}{counter}"
                counter += 1

            # Insert user
            user_id = await conn.fetchval("""
                INSERT INTO users (
                    username, email, password_hash, full_name,
                    role, is_active, is_verified, is_superuser,
                    failed_login_attempts, created_at, updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING id
            """, username, request.email, password_hash, request.full_name,
                'STUDENT', True, False, False, 0, datetime.utcnow(), datetime.utcnow())

            # Create JWT token
            token = jwt.encode({
                'user_id': user_id,
                'email': request.email,
                'exp': datetime.utcnow() + timedelta(hours=24)
            }, settings.JWT_SECRET_KEY, algorithm='HS256')

            return JSONResponse(
                status_code=201,
                content={
                    "success": True,
                    "message": "Registration successful",
                    "user": {
                        "user_id": str(user_id),
                        "email": request.email,
                        "full_name": request.full_name,
                        "username": username
                    },
                    "token": token
                }
            )

        finally:
            await conn.close()

    except HTTPException:
        raise
    except Exception as e:
        print(f"DEBUG: Exception in register: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
async def login(request: LoginRequest):
    """Authenticate user - simplified for existing schema"""
    try:
        import bcrypt
        import jwt
        from datetime import datetime, timedelta
        import asyncpg

        # Connect to database using environment variables
        conn = await asyncpg.connect(
            host=settings.DATABASE_HOST,
            port=int(settings.DATABASE_PORT),
            user=settings.DATABASE_USER,
            password=settings.DATABASE_PASSWORD,
            database=settings.DATABASE_NAME,
            ssl='require'
        )

        try:
            # Get user by email
            user = await conn.fetchrow("""
                SELECT id, email, password_hash, full_name, username, role
                FROM users
                WHERE email = $1 AND is_active = TRUE
            """, request.email)

            if not user:
                raise HTTPException(status_code=401, detail="Invalid email or password")

            # Verify password
            if not bcrypt.checkpw(request.password.encode('utf-8'), user['password_hash'].encode('utf-8')):
                raise HTTPException(status_code=401, detail="Invalid email or password")

            # Update last login
            await conn.execute("""
                UPDATE users SET last_login = $1 WHERE id = $2
            """, datetime.utcnow(), user['id'])

            # Create JWT token
            token = jwt.encode({
                'user_id': user['id'],
                'email': user['email'],
                'exp': datetime.utcnow() + timedelta(hours=24)
            }, settings.JWT_SECRET_KEY, algorithm='HS256')

            return JSONResponse(
                status_code=200,
                content={
                    "success": True,
                    "message": "Login successful",
                    "user": {
                        "user_id": str(user['id']),
                        "email": user['email'],
                        "full_name": user['full_name'],
                        "username": user['username']
                    },
                    "token": token
                }
            )

        finally:
            await conn.close()

    except HTTPException:
        raise
    except Exception as e:
        print(f"DEBUG: Exception in login: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/profile")
async def get_profile(request: Request):
    """Get current user profile"""
    user = get_user_from_request(request)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    try:
        # Get additional user info
        full_user = auth_service.get_user_by_token(
            request.headers.get("Authorization", "").replace("Bearer ", "")
        )
        
        if not full_user:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Get API keys status
        api_keys = auth_service.get_user_api_keys(full_user['user_id'])
        api_status = {
            "openai": bool(api_keys.get('openai')),
            "anthropic": bool(api_keys.get('anthropic')),
            "google": bool(api_keys.get('google'))
        }
        
        # Get user courses
        courses = auth_service.get_user_courses(full_user['user_id'], limit=10)
        
        return {
            "user_id": full_user['user_id'],
            "email": full_user['email'],
            "full_name": full_user['full_name'],
            "organization": full_user.get('organization'),
            "subscription_tier": full_user.get('subscription_tier', 'free'),
            "daily_limit": full_user.get('daily_limit', 10),
            "monthly_limit": full_user.get('monthly_limit', 100),
            "courses_created": full_user.get('courses_created', 0),
            "api_keys_configured": api_status,
            "recent_courses": courses
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api-keys")
async def update_api_keys(request: Request, api_keys: APIKeysRequest):
    """Update user's API keys"""
    user = get_user_from_request(request)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    try:
        keys_to_update = {}
        if api_keys.openai:
            keys_to_update['openai'] = api_keys.openai
        if api_keys.anthropic:
            keys_to_update['anthropic'] = api_keys.anthropic
        if api_keys.google:
            keys_to_update['google'] = api_keys.google
        
        success = auth_service.update_user_api_keys(user['user_id'], keys_to_update)
        
        if success:
            return {"success": True, "message": "API keys updated successfully"}
        else:
            raise HTTPException(status_code=400, detail="Failed to update API keys")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api-keys")
async def get_api_keys(request: Request):
    """Get user's API keys (masked for security)"""
    user = get_user_from_request(request)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    try:
        api_keys = auth_service.get_user_api_keys(user['user_id'])
        
        # Mask the keys for security (show only first 8 chars)
        masked_keys = {}
        for provider, key in api_keys.items():
            if key:
                masked_keys[provider] = f"{key[:8]}{'*' * (len(key) - 8)}"
            else:
                masked_keys[provider] = ""
        
        return {
            "api_keys": masked_keys,
            "configured": {
                provider: bool(key) for provider, key in api_keys.items()
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/courses")
async def get_user_courses(request: Request, limit: int = 20):
    """Get user's courses"""
    user = get_user_from_request(request)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    try:
        courses = auth_service.get_user_courses(user['user_id'], limit)
        return {"courses": courses}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/logout")
async def logout(request: Request):
    """Logout user"""
    try:
        # For JWT tokens, we can't really "logout" server-side
        # In a production app, you'd want to maintain a blacklist
        # For now, we'll just return success and let the client clear the token
        
        return {"success": True, "message": "Logged out successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/verify")
async def verify_token(request: Request):
    """Verify if token is valid"""
    user = get_user_from_request(request)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return {"valid": True, "user_id": user['user_id'], "email": user['email']}