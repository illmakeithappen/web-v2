"""DocsService - File-based documentation content management."""

import os
import shutil
import json
from pathlib import Path
from typing import List, Dict, Any
from datetime import datetime

from .schemas import (
    DocSection,
    DocMetadata,
    DocEntry,
    DocFile,
    DocFileContent,
    DocListResponse,
    CreateDocRequest,
    UpdateDocRequest,
    SyncResponse,
    SECTION_FILES
)
from .frontmatter import (
    parse_frontmatter,
    serialize_frontmatter,
    enrich_frontmatter,
    extract_id_from_frontmatter
)


class DocsService:
    """
    Service layer for docs content management.

    Manages reading/writing content from vault-web and syncing
    to frontend/public for static serving.
    """

    def __init__(self, vault_path: str, public_path: str):
        """
        Initialize DocsService.

        Args:
            vault_path: Path to vault-web directory (source of truth)
            public_path: Path to frontend/public/content (sync target)
        """
        self.vault_path = Path(vault_path)
        self.public_path = Path(public_path)

        # Validate vault path exists
        if not self.vault_path.exists():
            raise ValueError(f"Vault path does not exist: {vault_path}")

    # ================================================================
    # READ Operations
    # ================================================================

    def list_section(self, section: DocSection) -> DocListResponse:
        """
        List all docs in a section with metadata only.

        Args:
            section: The section to list (workflows, skills, tools)

        Returns:
            DocListResponse with items list
        """
        section_path = self.vault_path / section.value

        if not section_path.exists():
            return DocListResponse(section=section, count=0, items=[])

        items = []
        for entry_dir in sorted(section_path.iterdir()):
            if not entry_dir.is_dir():
                continue

            # Skip hidden directories
            if entry_dir.name.startswith('.'):
                continue

            try:
                metadata = self._read_metadata(section, entry_dir.name)
                items.append(metadata)
            except Exception as e:
                # Log but don't fail entire listing
                print(f"Warning: Failed to read {entry_dir}: {e}")
                continue

        return DocListResponse(section=section, count=len(items), items=items)

    def get_entry(self, section: DocSection, doc_id: str) -> DocEntry:
        """
        Get a single doc entry with full content.

        Args:
            section: The section containing the doc
            doc_id: The document identifier

        Returns:
            DocEntry with metadata, frontmatter, and content

        Raises:
            FileNotFoundError: If document doesn't exist
            ValueError: If frontmatter is invalid
        """
        entry_path = self._get_entry_path(section, doc_id)
        main_file = entry_path / SECTION_FILES[section]

        if not main_file.exists():
            raise FileNotFoundError(f"Doc not found: {section.value}/{doc_id}")

        raw = main_file.read_text(encoding='utf-8')
        frontmatter, content = parse_frontmatter(raw)

        metadata = self._build_metadata(section, doc_id, frontmatter, entry_path)

        return DocEntry(
            metadata=metadata,
            frontmatter=frontmatter,
            content=content,
            raw=raw
        )

    def list_files(self, section: DocSection, doc_id: str) -> List[DocFile]:
        """
        List all files in a document's subdirectory.

        Args:
            section: The section containing the doc
            doc_id: The document identifier

        Returns:
            List of DocFile objects

        Raises:
            FileNotFoundError: If document doesn't exist
        """
        entry_path = self._get_entry_path(section, doc_id)

        if not entry_path.exists():
            raise FileNotFoundError(f"Doc not found: {section.value}/{doc_id}")

        files = []
        main_filename = SECTION_FILES[section]

        for item in entry_path.rglob('*'):
            # Skip the main doc file
            if item.name == main_filename:
                continue

            # Skip hidden files
            if any(part.startswith('.') for part in item.parts):
                continue

            rel_path = item.relative_to(entry_path)
            stat = item.stat()

            files.append(DocFile(
                name=item.name,
                path=str(rel_path),
                size=stat.st_size if item.is_file() else 0,
                is_directory=item.is_dir(),
                modified_at=datetime.fromtimestamp(stat.st_mtime)
            ))

        return sorted(files, key=lambda f: (not f.is_directory, f.path))

    def get_file_content(
        self,
        section: DocSection,
        doc_id: str,
        file_path: str
    ) -> DocFileContent:
        """
        Get content of a subdirectory file.

        Args:
            section: The section containing the doc
            doc_id: The document identifier
            file_path: Relative path within the doc directory

        Returns:
            DocFileContent with file info and content

        Raises:
            FileNotFoundError: If file doesn't exist
            ValueError: If path traversal detected or trying to read directory
        """
        entry_path = self._get_entry_path(section, doc_id)
        full_path = entry_path / file_path

        # Security: ensure path doesn't escape entry directory
        try:
            full_path.resolve().relative_to(entry_path.resolve())
        except ValueError:
            raise ValueError("Invalid file path: path traversal detected")

        if not full_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        if full_path.is_dir():
            raise ValueError("Cannot read directory as file")

        stat = full_path.stat()
        content = full_path.read_text(encoding='utf-8')

        return DocFileContent(
            file=DocFile(
                name=full_path.name,
                path=file_path,
                size=stat.st_size,
                is_directory=False,
                modified_at=datetime.fromtimestamp(stat.st_mtime)
            ),
            content=content
        )

    # ================================================================
    # WRITE Operations
    # ================================================================

    def create_entry(
        self,
        section: DocSection,
        request: CreateDocRequest
    ) -> DocEntry:
        """
        Create a new doc entry.

        Args:
            section: The section to create in
            request: CreateDocRequest with id, frontmatter, content

        Returns:
            The created DocEntry

        Raises:
            ValueError: If doc already exists or validation fails
        """
        entry_path = self._get_entry_path(section, request.id)

        if entry_path.exists():
            raise ValueError(f"Doc already exists: {section.value}/{request.id}")

        # Enrich frontmatter with auto-generated fields
        frontmatter = enrich_frontmatter(request.frontmatter, request.id, is_new=True)

        # Ensure required fields
        if 'name' not in frontmatter:
            frontmatter['name'] = request.id

        # Create directory and main file
        entry_path.mkdir(parents=True, exist_ok=True)
        main_file = entry_path / SECTION_FILES[section]

        file_content = serialize_frontmatter(frontmatter, request.content)
        main_file.write_text(file_content, encoding='utf-8')

        return self.get_entry(section, request.id)

    def update_entry(
        self,
        section: DocSection,
        doc_id: str,
        request: UpdateDocRequest
    ) -> DocEntry:
        """
        Update an existing doc entry.

        Args:
            section: The section containing the doc
            doc_id: The document identifier
            request: UpdateDocRequest with optional frontmatter and content

        Returns:
            The updated DocEntry

        Raises:
            FileNotFoundError: If doc doesn't exist
            ValueError: If validation fails
        """
        entry_path = self._get_entry_path(section, doc_id)
        main_file = entry_path / SECTION_FILES[section]

        if not main_file.exists():
            raise FileNotFoundError(f"Doc not found: {section.value}/{doc_id}")

        # Read existing content
        raw = main_file.read_text(encoding='utf-8')
        existing_frontmatter, existing_content = parse_frontmatter(raw)

        # Merge updates
        if request.frontmatter:
            frontmatter = {**existing_frontmatter, **request.frontmatter}
        else:
            frontmatter = existing_frontmatter

        content = request.content if request.content is not None else existing_content

        # Enrich with timestamp update
        frontmatter = enrich_frontmatter(frontmatter, doc_id, is_new=False)

        # Write back
        file_content = serialize_frontmatter(frontmatter, content)
        main_file.write_text(file_content, encoding='utf-8')

        return self.get_entry(section, doc_id)

    def delete_entry(self, section: DocSection, doc_id: str) -> bool:
        """
        Delete a doc entry (moves to .trash for safety).

        Args:
            section: The section containing the doc
            doc_id: The document identifier

        Returns:
            True if successfully deleted

        Raises:
            FileNotFoundError: If doc doesn't exist
        """
        entry_path = self._get_entry_path(section, doc_id)

        if not entry_path.exists():
            raise FileNotFoundError(f"Doc not found: {section.value}/{doc_id}")

        # Move to trash instead of hard delete
        trash_path = self.vault_path / '.trash' / section.value / doc_id
        trash_path.parent.mkdir(parents=True, exist_ok=True)

        # Remove existing trash entry if present
        if trash_path.exists():
            shutil.rmtree(trash_path)

        shutil.move(str(entry_path), str(trash_path))
        return True

    # ================================================================
    # SYNC Operations
    # ================================================================

    def sync_all(self) -> SyncResponse:
        """
        Sync all sections to frontend/public.

        Returns:
            SyncResponse with results
        """
        sections_synced = []
        total_files = 0
        errors = []

        for section in DocSection:
            try:
                result = self.sync_section(section)
                sections_synced.append(section.value)
                total_files += result.files_processed
                errors.extend(result.errors)
            except Exception as e:
                errors.append(f"{section.value}: {str(e)}")

        return SyncResponse(
            success=len(errors) == 0,
            sections_synced=sections_synced,
            files_processed=total_files,
            manifest_updated=True,
            errors=errors
        )

    def sync_section(self, section: DocSection) -> SyncResponse:
        """
        Sync a single section to frontend/public.

        Args:
            section: The section to sync

        Returns:
            SyncResponse with results
        """
        source_path = self.vault_path / section.value
        target_path = self.public_path / section.value

        if not source_path.exists():
            return SyncResponse(
                success=True,
                sections_synced=[section.value],
                files_processed=0,
                manifest_updated=False,
                errors=[]
            )

        # Ensure target exists
        target_path.mkdir(parents=True, exist_ok=True)

        # Build manifest from frontmatter
        manifest_entries = []
        files_copied = 0
        errors = []

        for entry_dir in sorted(source_path.iterdir()):
            if not entry_dir.is_dir() or entry_dir.name.startswith('.'):
                continue

            try:
                # Read and build manifest entry
                metadata = self._read_metadata(section, entry_dir.name)
                manifest_entries.append(self._metadata_to_manifest(metadata))

                # Copy directory to target
                target_entry = target_path / entry_dir.name
                if target_entry.exists():
                    shutil.rmtree(target_entry)
                shutil.copytree(entry_dir, target_entry)

                files_copied += sum(1 for _ in entry_dir.rglob('*') if _.is_file())

            except Exception as e:
                errors.append(f"{entry_dir.name}: {str(e)}")

        # Write manifest.json
        manifest_file = target_path / 'manifest.json'
        manifest_data = {"entries": manifest_entries}
        manifest_file.write_text(
            json.dumps(manifest_data, indent=2, default=str),
            encoding='utf-8'
        )

        return SyncResponse(
            success=len(errors) == 0,
            sections_synced=[section.value],
            files_processed=files_copied,
            manifest_updated=True,
            errors=errors
        )

    # ================================================================
    # Helper Methods
    # ================================================================

    def _get_entry_path(self, section: DocSection, doc_id: str) -> Path:
        """Get the filesystem path for a doc entry."""
        return self.vault_path / section.value / doc_id

    def _read_metadata(self, section: DocSection, doc_id: str) -> DocMetadata:
        """Read metadata from a doc entry."""
        entry_path = self._get_entry_path(section, doc_id)
        main_file = entry_path / SECTION_FILES[section]

        if not main_file.exists():
            raise FileNotFoundError(f"Main file not found: {main_file}")

        raw = main_file.read_text(encoding='utf-8')
        frontmatter, _ = parse_frontmatter(raw)

        return self._build_metadata(section, doc_id, frontmatter, entry_path)

    def _build_metadata(
        self,
        section: DocSection,
        doc_id: str,
        frontmatter: Dict[str, Any],
        entry_path: Path
    ) -> DocMetadata:
        """Build DocMetadata from frontmatter."""
        main_filename = SECTION_FILES[section]

        # Count subdirectory files (excluding main file)
        file_count = sum(
            1 for f in entry_path.rglob('*')
            if f.is_file() and f.name != main_filename
        )

        # Handle tags (can be list or string)
        tags = frontmatter.get('tags', [])
        if isinstance(tags, str):
            tags = [t.strip() for t in tags.split(',')]

        # Handle both 'name' and 'title' (workflows use 'title')
        name = frontmatter.get('name') or frontmatter.get('title', doc_id)

        return DocMetadata(
            id=doc_id,  # Always use directory name as ID for consistency
            name=name,
            description=frontmatter.get('description', ''),
            category=frontmatter.get('category', 'uncategorized'),
            tags=tags,
            difficulty=frontmatter.get('difficulty'),
            section=section,
            has_subdirectory=file_count > 0,
            file_count=file_count,
            # Workflow-specific fields
            estimated_time=frontmatter.get('estimated_time'),
            agent=frontmatter.get('agent'),
            model=frontmatter.get('model'),
            steps=frontmatter.get('steps', []),
            created_date=self._format_date(frontmatter.get('created_date')),
            author=frontmatter.get('author'),
            status=frontmatter.get('status'),
        )

    def _format_date(self, date):
        """Convert date to string (YAML parses dates as datetime.date)."""
        if date is None:
            return None
        if hasattr(date, 'isoformat'):
            return date.isoformat()
        return str(date)

    def _metadata_to_manifest(self, metadata: DocMetadata) -> Dict[str, Any]:
        """Convert DocMetadata to manifest entry format."""
        entry = {
            "id": metadata.id,
            "name": metadata.name,
            "description": metadata.description,
            "category": metadata.category,
            "tags": metadata.tags,
        }

        if metadata.difficulty:
            entry["difficulty"] = metadata.difficulty

        return entry
