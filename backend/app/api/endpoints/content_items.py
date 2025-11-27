"""Content Items API endpoints"""
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import FileResponse, RedirectResponse, Response
from sqlalchemy.orm import Session
from typing import Optional
from pathlib import Path
import boto3
from botocore.exceptions import ClientError
import os

from app.core.database import get_db
from app.core.config import settings
from app.crud.content_items import (
    get_content_items, 
    search_content_items, 
    get_content_item_by_id,
    get_content_items_stats,
    get_available_formats_and_categories
)
from app.schemas.content_items import (
    ContentItemsListResponse,
    ContentItemResponse,
    ContentItemStatsResponse,
    ContentItemFormatsResponse,
    ContentItemSearchRequest
)

router = APIRouter()


@router.get("/stats", response_model=ContentItemStatsResponse)
async def get_stats(db: Session = Depends(get_db)):
    """Get content items statistics"""
    stats = get_content_items_stats(db)
    return ContentItemStatsResponse(**stats)


@router.get("/formats", response_model=ContentItemFormatsResponse)
async def get_formats(db: Session = Depends(get_db)):
    """Get available formats and categories"""
    data = get_available_formats_and_categories(db)
    return ContentItemFormatsResponse(**data)


@router.get("/resources", response_model=ContentItemsListResponse)
async def get_resources(
    limit: int = Query(50, ge=1, le=100),
    page: int = Query(1, ge=1),
    category: Optional[str] = Query(None),
    format: Optional[str] = Query(None),  # Maps to content_type
    resource_type: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get paginated list of content items"""
    skip = (page - 1) * limit
    
    # Map format to content_type
    content_type = format.lower() if format and format != "URL" else None
    
    items = get_content_items(
        db, 
        skip=skip, 
        limit=limit, 
        category=category,
        content_type=content_type,
        resource_type=resource_type
    )
    
    # Convert to response format with computed properties
    resources = []
    for item in items:
        # Create the response dict with all the computed properties
        resource_data = {
            **item.__dict__,
            "tags": item.tags,
            "resource_type": item.resource_type,
            "format": item.format,
            "external_url": item.external_url,
            "file_url": item.file_url,
            "file_size": item.file_size,
            "access_count": item.access_count,
            "url_metadata": item.url_metadata
        }
        # Remove SQLAlchemy internal attributes
        resource_data = {k: v for k, v in resource_data.items() if not k.startswith('_')}
        resources.append(ContentItemResponse(**resource_data))
    
    # For now, return the number of items we got (could enhance with total count)
    total = len(resources)
    
    return ContentItemsListResponse(
        resources=resources,
        total=total,
        page=page,
        limit=limit
    )


@router.post("/resources/search", response_model=ContentItemsListResponse)
async def search_resources(
    search_request: ContentItemSearchRequest,
    db: Session = Depends(get_db)
):
    """Search content items with filters"""
    items, total = search_content_items(db, search_request)
    
    # Convert to response format with computed properties
    resources = []
    for item in items:
        # Create the response dict with all the computed properties
        resource_data = {
            **item.__dict__,
            "tags": item.tags,
            "resource_type": item.resource_type,
            "format": item.format,
            "external_url": item.external_url,
            "file_url": item.file_url,
            "file_size": item.file_size,
            "access_count": item.access_count,
            "url_metadata": item.url_metadata
        }
        # Remove SQLAlchemy internal attributes
        resource_data = {k: v for k, v in resource_data.items() if not k.startswith('_')}
        resources.append(ContentItemResponse(**resource_data))
    
    page = (search_request.offset // search_request.limit) + 1
    
    return ContentItemsListResponse(
        resources=resources,
        total=total,
        page=page,
        limit=search_request.limit
    )


@router.get("/resources/{item_id}", response_model=ContentItemResponse)
async def get_resource(item_id: int, db: Session = Depends(get_db)):
    """Get a single content item by ID"""
    item = get_content_item_by_id(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Content item not found")
    
    # Create the response dict with all the computed properties
    resource_data = {
        **item.__dict__,
        "tags": item.tags,
        "resource_type": item.resource_type,
        "format": item.format,
        "external_url": item.external_url,
        "file_url": item.file_url,
        "file_size": item.file_size,
        "access_count": item.access_count,
        "url_metadata": item.url_metadata
    }
    # Remove SQLAlchemy internal attributes
    resource_data = {k: v for k, v in resource_data.items() if not k.startswith('_')}
    
    return ContentItemResponse(**resource_data)



@router.get("/screenshots/{filename}")
async def get_screenshot(filename: str):
    """Serve screenshot images from S3 or local filesystem"""
    # Security: ensure the filename doesn't contain path traversal attempts
    if ".." in filename or "/" in filename or "\\" in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")
    
    # First, try to get from S3
    try:
        # Initialize S3 client using settings
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )
        
        bucket_name = "farp-screenshots-bucket"
        s3_key = f"screenshots/{filename}"
        
        # Download the image from S3 and serve it directly
        response = s3_client.get_object(Bucket=bucket_name, Key=s3_key)
        image_data = response['Body'].read()
        
        # Return the image data directly
        return Response(
            content=image_data,
            media_type="image/png",
            headers={"Cache-Control": "max-age=3600"}  # Cache for 1 hour
        )
        
    except ClientError as e:
        # If S3 fails, fall back to local file serving
        print(f"S3 error for {filename}: {e}")
        pass
    except Exception as e:
        # If S3 fails, fall back to local file serving
        print(f"S3 connection error: {e}")
        pass
    
    # Fallback: serve from local filesystem
    screenshot_path = Path("../screenshots") / filename
    
    # Check if local file exists
    if not screenshot_path.exists():
        raise HTTPException(status_code=404, detail="Screenshot not found")
    
    # Return the local image file
    return FileResponse(
        path=str(screenshot_path),
        media_type="image/png",
        filename=filename
    )