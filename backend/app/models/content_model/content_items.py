"""Content Items SQLAlchemy model"""
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float
from app.core.database import Base
from datetime import datetime


class ContentItem(Base):
    __tablename__ = "content_items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    url = Column(String, nullable=False)
    content_type = Column(String, nullable=True)
    category = Column(String, nullable=True)
    difficulty_level = Column(String, nullable=True)
    pricing_model = Column(String, nullable=True)
    price = Column(Float, nullable=True)
    author = Column(String, nullable=True)
    company = Column(String, nullable=True)
    tags_str = Column(Text, nullable=True)
    screenshot_url = Column(String(500), nullable=True)
    is_published = Column(Boolean, nullable=True, default=True)
    created_at = Column(DateTime, nullable=True, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=True, default=datetime.utcnow, onupdate=datetime.utcnow)

    @property
    def tags(self):
        """Convert tags_str to list of tags"""
        if self.tags_str:
            return [tag.strip() for tag in self.tags_str.split(',') if tag.strip()]
        return []

    @property
    def resource_type(self):
        """Map content_type to resource_type for frontend compatibility"""
        return "link"  # Since all content_items are external links

    @property
    def format(self):
        """Get format based on content_type"""
        return self.content_type or "URL"

    @property
    def external_url(self):
        """Return URL for external links"""
        return self.url

    @property
    def file_url(self):
        """No file URL for content items (they are links)"""
        return None

    @property
    def file_size(self):
        """No file size for content items"""
        return None

    @property
    def access_count(self):
        """Default access count - could be enhanced later"""
        return 0

    @property
    def url_metadata(self):
        """Extract domain from URL for metadata"""
        if self.url:
            try:
                from urllib.parse import urlparse
                parsed = urlparse(self.url)
                return {"domain": parsed.netloc}
            except:
                pass
        return None