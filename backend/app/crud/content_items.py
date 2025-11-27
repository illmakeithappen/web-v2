"""CRUD operations for Content Items"""
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.models.content_model.content_items import ContentItem
from app.schemas.content_items import ContentItemSearchRequest
from typing import List, Optional, Tuple


def get_content_items(
    db: Session, 
    skip: int = 0, 
    limit: int = 50,
    category: Optional[str] = None,
    content_type: Optional[str] = None,
    resource_type: Optional[str] = None
) -> List[ContentItem]:
    """Get content items with filtering"""
    query = db.query(ContentItem).filter(ContentItem.is_published == True)
    
    if category:
        query = query.filter(ContentItem.category == category)
    
    if content_type:
        query = query.filter(ContentItem.content_type == content_type)
    
    # resource_type is always 'link' for content_items, so we don't filter on it
    
    # Order by ID to ensure consistent results, with screenshots first
    return query.order_by(ContentItem.id).offset(skip).limit(limit).all()


def search_content_items(db: Session, search_params: ContentItemSearchRequest) -> Tuple[List[ContentItem], int]:
    """Search content items with full-text search"""
    query = db.query(ContentItem).filter(ContentItem.is_published == True)
    
    # Text search across title, description, author, company, tags
    if search_params.query:
        search_query = f"%{search_params.query}%"
        query = query.filter(
            or_(
                ContentItem.title.ilike(search_query),
                ContentItem.description.ilike(search_query),
                ContentItem.author.ilike(search_query),
                ContentItem.company.ilike(search_query),
                ContentItem.tags_str.ilike(search_query)
            )
        )
    
    # Category filter
    if search_params.category:
        query = query.filter(ContentItem.category == search_params.category)
    
    # Format filter (maps to content_type)
    if search_params.format and search_params.format != "URL":
        query = query.filter(ContentItem.content_type == search_params.format.lower())
    
    # Resource type filter - content_items are always links, so ignore this
    
    # Get total count before pagination
    total = query.count()
    
    # Apply pagination
    items = query.offset(search_params.offset).limit(search_params.limit).all()
    
    return items, total


def get_content_item_by_id(db: Session, item_id: int) -> Optional[ContentItem]:
    """Get a single content item by ID"""
    return db.query(ContentItem).filter(ContentItem.id == item_id).first()


def get_content_items_stats(db: Session) -> dict:
    """Get statistics about content items"""
    total_items = db.query(func.count(ContentItem.id)).filter(ContentItem.is_published == True).scalar()
    
    return {
        "total_resources": total_items,
        "total_documents": 0,  # Content items are links, not documents
        "total_links": total_items,
        "total_courses": 0,  # Not in content_items table
        "database_type": "PostgreSQL"
    }


def get_available_formats_and_categories(db: Session) -> dict:
    """Get distinct formats and categories from content items"""
    # Get unique content types (formats)
    formats_result = db.query(ContentItem.content_type).filter(
        ContentItem.content_type.isnot(None),
        ContentItem.is_published == True
    ).distinct().all()
    formats = [f[0] for f in formats_result if f[0]] + ["URL"]
    
    # Get unique categories
    categories_result = db.query(ContentItem.category).filter(
        ContentItem.category.isnot(None),
        ContentItem.is_published == True
    ).distinct().all()
    categories = [c[0] for c in categories_result if c[0]]
    
    return {
        "formats": sorted(list(set(formats))),
        "categories": sorted(list(set(categories)))
    }