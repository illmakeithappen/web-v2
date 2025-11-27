"""
Course Storage Repository - PostgreSQL Version
Handles database operations for courses using AWS RDS PostgreSQL
"""
import json
import asyncpg
from typing import List, Optional, Dict
from datetime import datetime
from .course_models import GeneratedCourse, CourseProgress
from app.core.config import settings


class CourseRepository:
    """Repository for course storage and retrieval using PostgreSQL"""

    def __init__(self):
        """Initialize repository with PostgreSQL connection settings"""
        self.host = settings.DATABASE_HOST
        self.port = int(settings.DATABASE_PORT)
        self.user = settings.DATABASE_USER
        self.password = settings.DATABASE_PASSWORD
        self.database = settings.DATABASE_NAME

    async def _get_connection(self):
        """Get a database connection"""
        return await asyncpg.connect(
            host=self.host,
            port=self.port,
            user=self.user,
            password=self.password,
            database=self.database,
            ssl='require'
        )

    async def save_course(self, course: GeneratedCourse) -> str:
        """Save a generated course to PostgreSQL"""
        conn = await self._get_connection()

        try:
            # Check if course already exists
            existing = await conn.fetchval(
                "SELECT id FROM courses WHERE course_id = $1",
                course.course_id
            )

            if existing:
                # Update existing course
                await conn.execute("""
                    UPDATE courses SET
                        title = $1, slug = $2, description = $3, level = $4, duration = $5,
                        modules = $6, prerequisites = $7, learning_objectives = $8,
                        target_audience = $9, learning_path = $10, databank_resources = $11,
                        tags = $12, language = $13, status = $14, access_type = $15,
                        updated_at = $16, created_by = $17, course_metadata = $18
                    WHERE course_id = $19
                """,
                    course.title, course.slug, course.description, course.level.value, course.duration,
                    json.dumps([m.dict() for m in course.modules]),
                    json.dumps(course.prerequisites),
                    json.dumps(course.learning_objectives),
                    course.target_audience,
                    json.dumps(course.learning_path.dict()),
                    json.dumps(course.databank_resources),
                    json.dumps(course.tags),
                    course.language,
                    course.status.value,
                    course.access_type.value,
                    course.updated_at.isoformat(),
                    course.created_by,
                    json.dumps(course.metadata),
                    course.course_id
                )
            else:
                # Insert new course
                await conn.execute("""
                    INSERT INTO courses (
                        course_id, title, slug, description, level, duration,
                        modules, prerequisites, learning_objectives,
                        target_audience, learning_path, databank_resources,
                        tags, language, status, access_type,
                        created_at, updated_at, created_by, course_metadata
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
                """,
                    course.course_id, course.title, course.slug, course.description,
                    course.level.value, course.duration,
                    json.dumps([m.dict() for m in course.modules]),
                    json.dumps(course.prerequisites),
                    json.dumps(course.learning_objectives),
                    course.target_audience,
                    json.dumps(course.learning_path.dict()),
                    json.dumps(course.databank_resources),
                    json.dumps(course.tags),
                    course.language,
                    course.status.value,
                    course.access_type.value,
                    course.created_at.isoformat(),
                    course.updated_at.isoformat(),
                    course.created_by,
                    json.dumps(course.metadata)
                )

            return course.course_id
        finally:
            await conn.close()

    async def get_course(self, course_id: str) -> Optional[Dict]:
        """Retrieve a course by course_id"""
        conn = await self._get_connection()

        try:
            row = await conn.fetchrow(
                "SELECT * FROM courses WHERE course_id = $1",
                course_id
            )

            if not row:
                return None

            course = dict(row)

            # Parse JSON fields (PostgreSQL returns them as strings)
            json_fields = ['modules', 'prerequisites', 'learning_objectives',
                          'learning_path', 'databank_resources', 'tags', 'course_metadata']

            for field in json_fields:
                if course.get(field):
                    try:
                        course[field] = json.loads(course[field]) if isinstance(course[field], str) else course[field]
                    except (json.JSONDecodeError, TypeError):
                        course[field] = {} if field in ['learning_path', 'course_metadata'] else []

            # Rename course_metadata to metadata for compatibility
            if 'course_metadata' in course:
                course['metadata'] = course.pop('course_metadata')

            return course
        finally:
            await conn.close()

    async def list_courses(self, skip: int = 0, limit: int = 10,
                          status: Optional[str] = None,
                          level: Optional[str] = None) -> List[Dict]:
        """List courses with pagination and filters"""
        conn = await self._get_connection()

        try:
            query = "SELECT * FROM courses WHERE 1=1"
            params = []
            param_count = 1

            if status:
                query += f" AND status = ${param_count}"
                params.append(status)
                param_count += 1

            if level:
                query += f" AND level = ${param_count}"
                params.append(level)
                param_count += 1

            query += f" ORDER BY created_at DESC LIMIT ${param_count} OFFSET ${param_count + 1}"
            params.extend([limit, skip])

            rows = await conn.fetch(query, *params)

            courses = []
            for row in rows:
                course = dict(row)

                # Parse JSON fields safely
                json_fields = ['modules', 'tags', 'course_metadata']
                for field in json_fields:
                    if course.get(field):
                        try:
                            course[field] = json.loads(course[field]) if isinstance(course[field], str) else course[field]
                        except (json.JSONDecodeError, TypeError):
                            course[field] = {} if field == 'course_metadata' else []

                # Rename course_metadata to metadata for compatibility
                if 'course_metadata' in course:
                    course['metadata'] = course.pop('course_metadata')

                courses.append(course)

            return courses
        finally:
            await conn.close()

    async def update_course_status(self, course_id: str, status: str) -> bool:
        """Update course status"""
        conn = await self._get_connection()

        try:
            result = await conn.execute("""
                UPDATE courses
                SET status = $1, updated_at = $2
                WHERE course_id = $3
            """, status, datetime.now().isoformat(), course_id)

            # asyncpg execute returns "UPDATE N" where N is row count
            return int(result.split()[-1]) > 0
        finally:
            await conn.close()

    async def enroll_user(self, course_id: str, user_email: str) -> bool:
        """Enroll a user in a course"""
        conn = await self._get_connection()

        try:
            # Get the integer ID from course_id
            course_pk = await conn.fetchval(
                "SELECT id FROM courses WHERE course_id = $1",
                course_id
            )

            if not course_pk:
                return False

            await conn.execute("""
                INSERT INTO course_enrollments (
                    course_id, user_email, enrolled_at, completion_status
                ) VALUES ($1, $2, $3, $4)
                ON CONFLICT (course_id, user_email) DO NOTHING
            """, course_pk, user_email, datetime.now().isoformat(), 'not_started')

            return True
        finally:
            await conn.close()

    async def get_user_progress(self, course_id: str, user_email: str) -> Optional[Dict]:
        """Get user's progress in a course"""
        conn = await self._get_connection()

        try:
            # Get the integer ID from course_id
            course_pk = await conn.fetchval(
                "SELECT id FROM courses WHERE course_id = $1",
                course_id
            )

            if not course_pk:
                return None

            row = await conn.fetchrow("""
                SELECT * FROM course_enrollments
                WHERE course_id = $1 AND user_email = $2
            """, course_pk, user_email)

            if row:
                progress = dict(row)
                if progress.get('progress'):
                    try:
                        progress['progress'] = json.loads(progress['progress']) if isinstance(progress['progress'], str) else progress['progress']
                    except (json.JSONDecodeError, TypeError):
                        progress['progress'] = {}
                return progress
            return None
        finally:
            await conn.close()

    async def update_user_progress(self, course_id: str, user_email: str,
                                 progress_data: Dict) -> bool:
        """Update user's course progress"""
        conn = await self._get_connection()

        try:
            # Get the integer ID from course_id
            course_pk = await conn.fetchval(
                "SELECT id FROM courses WHERE course_id = $1",
                course_id
            )

            if not course_pk:
                return False

            result = await conn.execute("""
                UPDATE course_enrollments
                SET progress = $1, last_accessed = $2, completion_status = $3
                WHERE course_id = $4 AND user_email = $5
            """,
                json.dumps(progress_data),
                datetime.now().isoformat(),
                progress_data.get('completion_status', 'in_progress'),
                course_pk,
                user_email
            )

            return int(result.split()[-1]) > 0
        finally:
            await conn.close()

    async def search_courses(self, query: str, filters: Dict = None) -> List[Dict]:
        """Search courses by query and filters"""
        conn = await self._get_connection()

        try:
            search_query = """
                SELECT * FROM courses
                WHERE (title ILIKE $1 OR description ILIKE $2 OR tags::text ILIKE $3)
            """
            params = [f'%{query}%', f'%{query}%', f'%{query}%']
            param_count = 4

            if filters:
                if filters.get('level'):
                    search_query += f" AND level = ${param_count}"
                    params.append(filters['level'])
                    param_count += 1
                if filters.get('status'):
                    search_query += f" AND status = ${param_count}"
                    params.append(filters['status'])
                    param_count += 1
                if filters.get('language'):
                    search_query += f" AND language = ${param_count}"
                    params.append(filters['language'])
                    param_count += 1

            search_query += " ORDER BY created_at DESC"

            rows = await conn.fetch(search_query, *params)

            courses = []
            for row in rows:
                course = dict(row)

                # Parse JSON fields
                json_fields = ['modules', 'tags', 'course_metadata']
                for field in json_fields:
                    if course.get(field):
                        try:
                            course[field] = json.loads(course[field]) if isinstance(course[field], str) else course[field]
                        except (json.JSONDecodeError, TypeError):
                            course[field] = {} if field == 'course_metadata' else []

                # Rename course_metadata to metadata
                if 'course_metadata' in course:
                    course['metadata'] = course.pop('course_metadata')

                courses.append(course)

            return courses
        finally:
            await conn.close()
