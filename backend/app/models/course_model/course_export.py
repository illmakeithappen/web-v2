"""
Course Export Service
Exports courses in various formats (HTML, SCORM, PDF, Markdown)
"""
import json
import os
from typing import Dict, Any, Optional
from datetime import datetime
import base64


class CourseExportService:
    """Service for exporting courses in different formats"""
    
    async def export(self, course: Dict, format: str, include_solutions: bool = False) -> Dict:
        """Export course in specified format"""
        if format == "html":
            return await self.export_html(course, include_solutions)
        elif format == "scorm":
            return await self.export_scorm(course, include_solutions)
        elif format == "markdown":
            return await self.export_markdown(course, include_solutions)
        elif format == "json":
            return await self.export_json(course, include_solutions)
        else:
            raise ValueError(f"Unsupported export format: {format}")
    
    async def export_html(self, course: Dict, include_solutions: bool = False) -> Dict:
        """Export course as standalone HTML"""
        html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{course['title']} - gitthub Course</title>
    <style>
        :root {{
            --gitthub-black: #1a1a1a;
            --gitthub-beige: #e8ddd4;
            --gitthub-light-beige: #f5f0eb;
            --gitthub-gray: #4a5568;
            --gitthub-white: #ffffff;
        }}
        
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.6;
            color: var(--gitthub-black);
            background: var(--gitthub-white);
        }}
        
        .course-container {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }}
        
        .course-header {{
            background: var(--gitthub-light-beige);
            border: 3px solid var(--gitthub-black);
            border-radius: 8px;
            padding: 2rem;
            margin-bottom: 2rem;
        }}
        
        .course-title {{
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: var(--gitthub-black);
        }}
        
        .course-description {{
            font-size: 1.1rem;
            color: var(--gitthub-gray);
            margin-bottom: 1.5rem;
        }}
        
        .module {{
            background: var(--gitthub-white);
            border: 2px solid var(--gitthub-gray);
            border-radius: 8px;
            margin-bottom: 2rem;
            overflow: hidden;
        }}
        
        .module-header {{
            background: var(--gitthub-beige);
            padding: 1.5rem;
            border-bottom: 2px solid var(--gitthub-gray);
            cursor: pointer;
        }}
        
        .module-content {{
            padding: 1.5rem;
        }}
    </style>
</head>
<body>
    <div class="course-container">
        <div class="course-header">
            <h1 class="course-title">{course['title']}</h1>
            <p class="course-description">{course['description']}</p>
        </div>
        <div class="modules">
"""
        
        # Add modules
        for module in course['modules']:
            html_content += f"""
            <div class="module">
                <div class="module-header">
                    <h2>Module {module['order'] + 1}: {module['title']}</h2>
                </div>
                <div class="module-content">
                    <p>{module['description']}</p>
                </div>
            </div>
"""
        
        html_content += """
        </div>
    </div>
</body>
</html>
"""
        
        return {
            "format": "html",
            "content": html_content,
            "filename": f"{course.get('slug', 'course')}.html"
        }
    
    async def export_markdown(self, course: Dict, include_solutions: bool = False) -> Dict:
        """Export course as Markdown"""
        md_content = f"# {course['title']}\n\n"
        md_content += f"{course['description']}\n\n"
        md_content += f"**Level:** {course['level']}  \n"
        md_content += f"**Duration:** {course['duration']}  \n\n"
        
        # Modules
        md_content += "## Course Modules\n\n"
        for module in course['modules']:
            md_content += f"### Module {module['order'] + 1}: {module['title']}\n\n"
            md_content += f"{module['description']}\n\n"
        
        return {
            "format": "markdown",
            "content": md_content,
            "filename": f"{course.get('slug', 'course')}.md"
        }
    
    async def export_json(self, course: Dict, include_solutions: bool = False) -> Dict:
        """Export course as JSON"""
        return {
            "format": "json",
            "content": json.dumps(course, indent=2),
            "filename": f"{course.get('slug', 'course')}.json"
        }
    
    async def export_scorm(self, course: Dict, include_solutions: bool = False) -> Dict:
        """Export course as SCORM package (simplified)"""
        # This would require creating a full SCORM package with manifest
        # For now, returning a simplified structure
        scorm_data = {
            "course_id": course.get('course_id', 'unknown'),
            "title": course['title'],
            "description": course['description'],
            "modules": len(course['modules']),
            "format": "scorm",
            "message": "Full SCORM export requires additional implementation"
        }
        
        return {
            "format": "scorm",
            "content": json.dumps(scorm_data, indent=2),
            "filename": f"{course.get('slug', 'course')}_scorm.json"
        }
