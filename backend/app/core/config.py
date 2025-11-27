"""Configuration - RARELY MODIFIED"""
from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # Database - Always AWS RDS
    DATABASE_HOST: str
    DATABASE_PORT: str = "5432"
    DATABASE_NAME: str
    DATABASE_USER: str
    DATABASE_PASSWORD: str

    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.DATABASE_USER}:{self.DATABASE_PASSWORD}@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}"

    # AWS
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_REGION: str = "eu-north-1"
    S3_BUCKET_NAME: str

    # Anthropic API
    ANTHROPIC_API_KEY: str

    # App
    PROJECT_NAME: str = "AI Learning Platform"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str
    ENVIRONMENT: str = "development"

    # Optional fields from .env
    BACKEND_URL: str = "http://localhost:8000"
    FRONTEND_URL: str = "http://localhost:3000"
    JWT_SECRET_KEY: str = "default-jwt-secret"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS - Dynamically includes production frontend URL
    @property
    def BACKEND_CORS_ORIGINS(self) -> List[str]:
        """
        Dynamically build CORS origins list including both local and production URLs.
        Automatically includes FRONTEND_URL from environment for production deployment.
        """
        origins = [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:3002",
            # Production domains
            "https://gitthub.org",
            "https://www.gitthub.org",
            "https://farp-frontend.onrender.com"
        ]

        # Add production frontend URL if different from localhost
        if self.FRONTEND_URL and not self.FRONTEND_URL.startswith("http://localhost"):
            # Add both http and https versions for Render
            if self.FRONTEND_URL.startswith("http://"):
                origins.append(self.FRONTEND_URL)
                origins.append(self.FRONTEND_URL.replace("http://", "https://"))
            elif self.FRONTEND_URL.startswith("https://"):
                origins.append(self.FRONTEND_URL)
            else:
                # No protocol specified, add both
                origins.append(f"http://{self.FRONTEND_URL}")
                origins.append(f"https://{self.FRONTEND_URL}")

        return origins
    
    # AWS Cognito Configuration
    COGNITO_USER_POOL_ID: str = ""
    COGNITO_APP_CLIENT_ID: str = ""
    COGNITO_IDENTITY_POOL_ID: str = ""
    COGNITO_REGION: str = ""

    # Docs Content Management - Paths relative to backend directory
    @property
    def VAULT_WEB_PATH(self) -> str:
        """Path to vault-web directory (source of truth for docs content)."""
        from pathlib import Path
        # Backend is at hub/web/backend, vault-web is at hub/web/vault-web
        backend_dir = Path(__file__).parent.parent.parent
        vault_path = backend_dir.parent / "vault-web"
        return str(vault_path.resolve())

    @property
    def FRONTEND_PUBLIC_CONTENT_PATH(self) -> str:
        """Path to frontend/public/content (sync target for static serving)."""
        from pathlib import Path
        backend_dir = Path(__file__).parent.parent.parent
        public_path = backend_dir.parent / "frontend" / "public" / "content"
        return str(public_path.resolve())

    class Config:
        env_file = "../.env"
        env_file_encoding = 'utf-8'
        case_sensitive = True

settings = Settings()