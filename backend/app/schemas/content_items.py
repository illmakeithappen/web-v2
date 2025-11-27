"""Pydantic schemas for Content Items API"""
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


class ContentItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    url: str
    content_type: Optional[str] = None
    category: Optional[str] = None
    difficulty_level: Optional[str] = None
    pricing_model: Optional[str] = None
    price: Optional[float] = None
    author: Optional[str] = None
    company: Optional[str] = None
    tags_str: Optional[str] = None
    screenshot_url: Optional[str] = None
    is_published: Optional[bool] = True


class ContentItemResponse(ContentItemBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    # Computed properties for frontend compatibility
    tags: List[str] = []
    resource_type: str = "link"
    format: str = "URL"
    external_url: str
    file_url: Optional[str] = None
    file_size: Optional[int] = None
    access_count: int = 0
    url_metadata: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True


class ContentItemsListResponse(BaseModel):
    resources: List[ContentItemResponse]
    total: int
    page: int
    limit: int


class ContentItemStatsResponse(BaseModel):
    total_resources: int
    total_documents: int = 0  # Content items are all links
    total_links: int
    total_courses: int = 0  # Not in content_items table
    database_type: str = "PostgreSQL"


class ContentItemFormatsResponse(BaseModel):
    formats: List[str]
    categories: List[str]


class ContentItemSearchRequest(BaseModel):
    query: Optional[str] = None
    format: Optional[str] = None
    category: Optional[str] = None
    resource_type: Optional[str] = None
    limit: int = 50
    offset: int = 0