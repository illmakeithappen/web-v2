"""API endpoints for docs content management."""

import io
import zipfile
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from typing import List

from app.models.docs_model import (
    DocSection,
    DocListResponse,
    DocEntry,
    DocFile,
    DocFileContent,
    CreateDocRequest,
    UpdateDocRequest,
    SyncResponse,
    DocsService
)
from app.core.config import settings

router = APIRouter(prefix="/docs", tags=["docs"])


def get_docs_service() -> DocsService:
    """Dependency injection for DocsService."""
    return DocsService(
        vault_path=settings.VAULT_WEB_PATH,
        public_path=settings.FRONTEND_PUBLIC_CONTENT_PATH
    )


# ================================================================
# SYNC Endpoints (must come before parameterized routes)
# ================================================================

@router.post("/sync", response_model=SyncResponse)
async def sync_all_docs(
    service: DocsService = Depends(get_docs_service)
):
    """
    Sync all sections to frontend/public.

    Regenerates manifests and copies files.
    """
    try:
        return service.sync_all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sync/{section}", response_model=SyncResponse)
async def sync_section(
    section: DocSection,
    service: DocsService = Depends(get_docs_service)
):
    """
    Sync a specific section to frontend/public.

    Regenerates manifest and copies files for one section.
    """
    try:
        return service.sync_section(section)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ================================================================
# READ Endpoints
# ================================================================

@router.get("/{section}", response_model=DocListResponse)
async def list_docs(
    section: DocSection,
    service: DocsService = Depends(get_docs_service)
):
    """
    List all documents in a section with metadata.

    Returns catalog of docs without full content.
    """
    try:
        return service.list_section(section)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{section}/{doc_id}", response_model=DocEntry)
async def get_doc(
    section: DocSection,
    doc_id: str,
    service: DocsService = Depends(get_docs_service)
):
    """
    Get a single document with full content.

    Returns frontmatter metadata and markdown content.
    """
    try:
        return service.get_entry(section, doc_id)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{section}/{doc_id}/files", response_model=List[DocFile])
async def list_doc_files(
    section: DocSection,
    doc_id: str,
    service: DocsService = Depends(get_docs_service)
):
    """
    List files in a document's subdirectory.

    Useful for skills/workflows with reference files.
    """
    try:
        return service.list_files(section, doc_id)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/{section}/{doc_id}/files/{file_path:path}", response_model=DocFileContent)
async def get_doc_file(
    section: DocSection,
    doc_id: str,
    file_path: str,
    service: DocsService = Depends(get_docs_service)
):
    """
    Get content of a file in a document's subdirectory.

    Supports nested paths like 'references/example.md'.
    """
    try:
        return service.get_file_content(section, doc_id, file_path)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{section}/{doc_id}/download")
async def download_doc_zip(
    section: DocSection,
    doc_id: str,
    service: DocsService = Depends(get_docs_service)
):
    """
    Download a document and its subdirectories as a ZIP file.

    Returns a ZIP archive containing the main file and all subdirectory files.
    """
    try:
        entry_path = service._get_entry_path(section, doc_id)

        if not entry_path.exists():
            raise HTTPException(status_code=404, detail=f"Doc not found: {section.value}/{doc_id}")

        # Create in-memory ZIP
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for file_path in entry_path.rglob('*'):
                if file_path.is_file():
                    # Skip hidden files
                    if any(part.startswith('.') for part in file_path.parts):
                        continue
                    arcname = file_path.relative_to(entry_path)
                    zip_file.write(file_path, arcname)

        zip_buffer.seek(0)

        return StreamingResponse(
            zip_buffer,
            media_type="application/zip",
            headers={"Content-Disposition": f"attachment; filename={doc_id}.zip"}
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ================================================================
# WRITE Endpoints
# ================================================================

@router.post("/{section}", response_model=DocEntry, status_code=201)
async def create_doc(
    section: DocSection,
    request: CreateDocRequest,
    service: DocsService = Depends(get_docs_service)
):
    """
    Create a new document.

    Creates directory and main file with frontmatter.
    """
    try:
        return service.create_entry(section, request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{section}/{doc_id}", response_model=DocEntry)
async def update_doc(
    section: DocSection,
    doc_id: str,
    request: UpdateDocRequest,
    service: DocsService = Depends(get_docs_service)
):
    """
    Update an existing document.

    Supports partial updates - only provided fields are changed.
    """
    try:
        return service.update_entry(section, doc_id, request)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{section}/{doc_id}", status_code=204)
async def delete_doc(
    section: DocSection,
    doc_id: str,
    service: DocsService = Depends(get_docs_service)
):
    """
    Delete a document.

    Moves to .trash directory for safety (not permanent delete).
    """
    try:
        service.delete_entry(section, doc_id)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
