"""DataBank API endpoints - aggregates all databank functionality"""
from fastapi import APIRouter
from app.api.endpoints.content_items import router as content_items_router

router = APIRouter()

# Include all the content_items endpoints under the databank namespace
router.include_router(content_items_router, tags=["databank"])