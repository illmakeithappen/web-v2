"""
AI Course Generator Service - Simplified Working Version
Generates comprehensive courses using templates (no external API required)
"""
import os
import json
import uuid
import re
from typing import List, Dict, Optional, Any
from datetime import datetime
from .course_models import (
    CourseRequest, CourseModule, GeneratedCourse,
    ContentSection, Activity, Assessment, LearningPath,
    CourseLevel, CourseStatus, AIModel
)


class CourseGeneratorService:
    """Main service for generating AI-powered courses"""
    
    def __init__(self):
        # Initialize API keys from environment
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.anthropic_key = os.getenv("ANTHROPIC_API_KEY")
        self.google_key = os.getenv("GOOGLE_API_KEY")
        
        # Initialize AI clients if available
        self.ai_clients = self._initialize_ai_clients()
            
    def generate_course_id(self) -> str:
        """Generate unique course ID"""
        return f"course_{uuid.uuid4().hex[:12]}"
    
    def generate_slug(self, title: str) -> str:
        """Generate unique URL-friendly slug from title"""
        # Create base slug from title
        slug = re.sub(r'[^\w\s-]', '', title.lower())
        slug = re.sub(r'[-\s]+', '-', slug)
        base_slug = slug[:40]  # Leave room for unique suffix
        
        # Add timestamp to ensure uniqueness
        import time
        timestamp = str(int(time.time()))[-6:]  # Last 6 digits of timestamp
        unique_slug = f"{base_slug}-{timestamp}"
        
        return unique_slug[:50]
    
    def _initialize_ai_clients(self) -> Dict:
        """Initialize available AI clients"""
        clients = {}
        
        # OpenAI
        if self.openai_key:
            try:
                from openai import AsyncOpenAI
                clients[AIModel.OPENAI_GPT4] = AsyncOpenAI(api_key=self.openai_key)
                clients[AIModel.OPENAI_GPT35] = AsyncOpenAI(api_key=self.openai_key)
                print("OpenAI client initialized")
            except ImportError:
                print("OpenAI library not installed")
        
        # Anthropic
        if self.anthropic_key:
            try:
                from anthropic import AsyncAnthropic
                clients[AIModel.ANTHROPIC_CLAUDE] = AsyncAnthropic(api_key=self.anthropic_key)
                clients[AIModel.ANTHROPIC_CLAUDE_INSTANT] = AsyncAnthropic(api_key=self.anthropic_key)
                print("Anthropic client initialized")
            except ImportError:
                print("Anthropic library not installed")
        
        # Google Gemini
        if self.google_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.google_key)
                clients[AIModel.GOOGLE_GEMINI] = genai.GenerativeModel('gemini-pro')
                print("Google Gemini client initialized")
            except ImportError:
                print("Google Generative AI library not installed")
        
        return clients
    
    async def generate_with_ai_model(self, prompt: str, model: AIModel, system_prompt: str = None) -> str:
        """Generate content using specified AI model"""
        
        # Template-based generation (default)
        if model == AIModel.TEMPLATE or model not in self.ai_clients:
            return self.generate_template_content(prompt)
        
        try:
            # OpenAI models
            if model in [AIModel.OPENAI_GPT4, AIModel.OPENAI_GPT35]:
                client = self.ai_clients[model]
                model_name = "gpt-4" if model == AIModel.OPENAI_GPT4 else "gpt-3.5-turbo"
                
                messages = []
                if system_prompt:
                    messages.append({"role": "system", "content": system_prompt})
                messages.append({"role": "user", "content": prompt})
                
                response = await client.chat.completions.create(
                    model=model_name,
                    messages=messages,
                    temperature=0.7,
                    max_tokens=2000
                )
                return response.choices[0].message.content
            
            # Anthropic models
            elif model in [AIModel.ANTHROPIC_CLAUDE, AIModel.ANTHROPIC_CLAUDE_INSTANT]:
                client = self.ai_clients[model]
                model_name = "claude-3-opus-20240229" if model == AIModel.ANTHROPIC_CLAUDE else "claude-instant-1.2"
                
                message = await client.messages.create(
                    model=model_name,
                    max_tokens=2000,
                    temperature=0.7,
                    system=system_prompt or "You are an expert course creator.",
                    messages=[{"role": "user", "content": prompt}]
                )
                return message.content[0].text
            
            # Google Gemini
            elif model == AIModel.GOOGLE_GEMINI:
                model_client = self.ai_clients[model]
                full_prompt = f"{system_prompt}\n\n{prompt}" if system_prompt else prompt
                response = model_client.generate_content(full_prompt)
                return response.text
            
            # Fallback to template
            return self.generate_template_content(prompt)
            
        except Exception as e:
            print(f"AI generation error with {model}: {e}")
            return self.generate_template_content(prompt)
    
    def generate_template_content(self, prompt: str) -> str:
        """Generate template-based content when AI is not available"""
        # Extract topic from prompt if possible
        topic = "the subject"
        if "topic:" in prompt.lower():
            topic = prompt.lower().split("topic:")[1].split("\n")[0].strip()
        
        return json.dumps({
            "content": f"This is template-generated content for {topic}. Configure an AI model for dynamic generation.",
            "sections": [
                "Introduction and Overview",
                "Core Concepts",
                "Practical Applications",
                "Best Practices"
            ]
        })
    
    async def find_relevant_resources(self, topic: str, selected_resources: Optional[List[Dict]] = None, resource_ids: Optional[List[int]] = None) -> List[Dict]:
        """Find relevant resources from Data Bank"""
        
        # If user has pre-selected resources, use those
        if selected_resources:
            return selected_resources
        
        # If specific resource IDs provided, fetch those
        if resource_ids:
            # In production, this would fetch from the database
            resources = []
            for rid in resource_ids:
                resources.append({
                    "id": rid,
                    "title": f"Resource {rid}",
                    "type": "document",
                    "url": f"/api/databank/resources/{rid}/download",
                    "description": f"Selected resource {rid}"
                })
            return resources
        
        # Default mock resources (in production, would search Data Bank)
        resources = [
            {
                "id": 1,
                "title": f"Introduction to {topic}",
                "type": "pdf",
                "url": f"/api/databank/resources/1/download",
                "description": f"Comprehensive guide to {topic}"
            },
            {
                "id": 2,
                "title": f"{topic} Dataset",
                "type": "csv",
                "url": f"/api/databank/resources/2/download",
                "description": f"Sample dataset for practicing {topic}"
            },
            {
                "id": 3,
                "title": f"{topic} Jupyter Notebook",
                "type": "notebook",
                "url": f"/api/databank/resources/3/download",
                "description": f"Interactive notebook with {topic} examples"
            }
        ]
        return resources
    
    async def create_course_structure(self, request: CourseRequest, resources: List[Dict]) -> Dict:
        """Create the overall course structure using templates"""
        # Determine number of modules based on duration
        if "week" in request.duration.lower():
            weeks = int(request.duration.split()[0]) if request.duration[0].isdigit() else 4
            module_count = min(weeks, 8)
        elif "hour" in request.duration.lower():
            hours = int(request.duration.split()[0]) if request.duration[0].isdigit() else 10
            module_count = min(hours // 3, 6)
        else:
            module_count = 4
        
        # Create module outlines based on topic
        module_templates = self.get_module_templates(request.topic, request.level, module_count)
        
        return {
            "title": f"Complete {request.topic} {request.level.value.title()} Course",
            "description": f"Master {request.topic} with this comprehensive {request.level.value} level course. Learn through hands-on exercises, real-world projects, and interactive content.",
            "prerequisites": request.prerequisites or self.get_default_prerequisites(request.level),
            "module_count": module_count,
            "module_outlines": module_templates,
            "learning_path": {
                "overview": f"Progress from basics to advanced {request.topic} concepts over {request.duration}"
            },
            "tags": self.generate_tags(request.topic, request.level)
        }
    
    def get_module_templates(self, topic: str, level: CourseLevel, count: int) -> List[Dict]:
        """Get module templates based on topic and level"""
        templates = {
            CourseLevel.BEGINNER: [
                {"title": f"Introduction to {topic}", "description": f"Get started with the basics of {topic}"},
                {"title": f"Core Concepts of {topic}", "description": f"Understanding fundamental principles"},
                {"title": f"Practical Applications", "description": f"Apply your knowledge with hands-on exercises"},
                {"title": f"Building Your First Project", "description": f"Create a real-world {topic} project"},
                {"title": f"Best Practices", "description": f"Learn industry standards and conventions"},
                {"title": f"Advanced Topics Preview", "description": f"Introduction to more complex concepts"},
                {"title": f"Final Assessment", "description": f"Test your {topic} knowledge"},
                {"title": f"Next Steps", "description": f"Continue your {topic} learning journey"}
            ],
            CourseLevel.INTERMEDIATE: [
                {"title": f"Review of {topic} Fundamentals", "description": "Quick recap of essential concepts"},
                {"title": f"Advanced {topic} Techniques", "description": "Deep dive into complex methods"},
                {"title": f"Performance Optimization", "description": f"Make your {topic} solutions faster"},
                {"title": f"Real-World Case Studies", "description": "Learn from industry examples"},
                {"title": f"Integration and APIs", "description": f"Connect {topic} with other systems"},
                {"title": f"Testing and Debugging", "description": "Ensure quality and reliability"},
                {"title": f"Scaling Solutions", "description": f"Handle larger {topic} challenges"},
                {"title": f"Industry Project", "description": "Build a production-ready solution"}
            ],
            CourseLevel.ADVANCED: [
                {"title": f"State-of-the-Art {topic}", "description": "Latest research and techniques"},
                {"title": f"Architecture and Design Patterns", "description": "Expert-level patterns"},
                {"title": f"Performance at Scale", "description": "Enterprise-level optimization"},
                {"title": f"Custom Implementations", "description": f"Build your own {topic} tools"},
                {"title": f"Research and Innovation", "description": "Cutting-edge developments"},
                {"title": f"Complex Problem Solving", "description": "Tackle challenging scenarios"},
                {"title": f"Contributing to {topic}", "description": "Give back to the community"},
                {"title": f"Mastery Project", "description": "Demonstrate expert knowledge"}
            ]
        }
        
        return templates.get(level, templates[CourseLevel.BEGINNER])[:count]
    
    def get_default_prerequisites(self, level: CourseLevel) -> List[str]:
        """Get default prerequisites based on level"""
        prereqs = {
            CourseLevel.BEGINNER: [
                "Basic computer skills",
                "Willingness to learn",
                "No prior programming experience required"
            ],
            CourseLevel.INTERMEDIATE: [
                "Basic programming knowledge",
                "Understanding of fundamental concepts",
                "Some practical experience recommended"
            ],
            CourseLevel.ADVANCED: [
                "Strong programming skills",
                "Solid understanding of core concepts",
                "Previous project experience required"
            ]
        }
        return prereqs.get(level, prereqs[CourseLevel.BEGINNER])
    
    def generate_tags(self, topic: str, level: CourseLevel) -> List[str]:
        """Generate relevant tags for the course"""
        tags = [topic.lower(), level.value]
        
        # Add common tech tags if relevant
        tech_keywords = ["python", "javascript", "data", "ai", "machine learning", "web", "api", "database"]
        for keyword in tech_keywords:
            if keyword in topic.lower():
                tags.append(keyword)
        
        tags.extend(["online course", "gitthub", "interactive learning"])
        return list(set(tags))  # Remove duplicates
    
    async def generate_module_content(self, module_outline: Dict, index: int, request: CourseRequest, resources: List[Dict]) -> CourseModule:
        """Generate detailed content for a module"""
        module_id = f"module_{index + 1}"
        
        # Generate content sections
        content_sections = []
        
        # Section 1: Theory
        content_sections.append(ContentSection(
            title=f"Understanding {module_outline['title']}",
            content_type="text",
            content=f"""
            Welcome to {module_outline['title']}! In this section, we'll explore the fundamental concepts and theory.
            
            {module_outline['description']}
            
            Key topics we'll cover:
            • Core principles and definitions
            • How it works under the hood
            • Common use cases and applications
            • Best practices and patterns
            
            This foundation will prepare you for the hands-on exercises that follow.
            """,
            duration_minutes=20,
            resources=[resources[0]] if resources else []
        ))
        
        # Section 2: Practical Examples
        content_sections.append(ContentSection(
            title=f"Practical Examples",
            content_type="code",
            content=f"""# Example code for {module_outline['title']}

# Import necessary libraries
import numpy as np
import pandas as pd

def example_function():
    '''
    This function demonstrates key concepts from this module.
    '''
    # Step 1: Initialize data
    data = np.array([1, 2, 3, 4, 5])
    
    # Step 2: Process data
    result = data * 2
    
    # Step 3: Return results
    return result

# Try it yourself:
output = example_function()
print(f"Result: {{output}}")

# Exercise: Modify the function to handle different inputs
""",
            duration_minutes=30,
            resources=[resources[1]] if len(resources) > 1 else []
        ))
        
        # Section 3: Interactive Exercise
        content_sections.append(ContentSection(
            title=f"Interactive Practice",
            content_type="interactive",
            content=f"""
            Now it's your turn to practice! Complete the following exercise:
            
            Challenge: Apply what you've learned about {module_outline['title']} to solve a real problem.
            
            Steps:
            1. Review the provided starter code
            2. Implement the missing functionality
            3. Test your solution with the provided test cases
            4. Submit for automated feedback
            
            Hint: Remember the concepts we covered in the theory section!
            """,
            duration_minutes=40,
            resources=[resources[2]] if len(resources) > 2 else []
        ))
        
        # Generate activities
        activities = []
        if request.include_projects:
            activity = Activity(
                title=f"Hands-on: {module_outline['title']} Project",
                type="coding_exercise",
                description=f"Apply your knowledge of {module_outline['title']} in a practical scenario",
                instructions=[
                    "Read the problem statement carefully",
                    "Plan your approach before coding",
                    "Implement the solution step by step",
                    "Test with different inputs",
                    "Optimize your solution"
                ],
                duration_minutes=45,
                difficulty=request.level,
                solution="# Solution will be provided after attempt",
                hints=[
                    "Break down the problem into smaller parts",
                    "Consider edge cases",
                    "Review the examples from earlier sections"
                ]
            )
            activities.append(activity)
        
        # Generate assessment
        assessment = None
        if request.include_assessments:
            questions = []
            for i in range(5):
                questions.append({
                    "question": f"Question {i+1} about {module_outline['title']}?",
                    "type": "multiple_choice",
                    "options": [
                        f"Option A for question {i+1}",
                        f"Option B for question {i+1}",
                        f"Option C for question {i+1}",
                        f"Option D for question {i+1}"
                    ],
                    "correct": i % 4,
                    "explanation": f"The correct answer demonstrates understanding of {module_outline['title']} concepts."
                })
            
            assessment = Assessment(
                type="quiz",
                title=f"{module_outline['title']} Assessment",
                questions=questions,
                passing_score=0.7,
                max_attempts=3,
                time_limit_minutes=30
            )
        
        return CourseModule(
            module_id=module_id,
            title=module_outline['title'],
            description=module_outline['description'],
            duration="1 week" if "week" in request.duration.lower() else "3 hours",
            objectives=[
                f"Understand the fundamentals of {module_outline['title']}",
                f"Apply concepts through hands-on exercises",
                f"Complete a practical project",
                f"Pass the module assessment with 70% or higher"
            ],
            content_sections=content_sections,
            activities=activities,
            assessment=assessment,
            resources=resources[:2] if len(resources) >= 2 else resources,
            order=index
        )
    
    async def generate_course(self, request: CourseRequest) -> GeneratedCourse:
        """Main method to generate a complete course"""
        print(f"Starting course generation for topic: {request.topic}")
        print(f"Using AI model: {request.ai_model}")
        
        # Find relevant resources
        resources = []
        if request.use_databank_resources or request.selected_resources:
            resources = await self.find_relevant_resources(
                request.topic,
                request.selected_resources,
                request.resource_ids
            )
            print(f"Found {len(resources)} resources")
        
        # Create course structure
        structure = await self.create_course_structure(request, resources)
        print(f"Created course structure with {structure['module_count']} modules")
        
        # Generate modules
        modules = []
        for i, outline in enumerate(structure['module_outlines']):
            print(f"Generating module {i+1}: {outline['title']}")
            module = await self.generate_module_content(
                outline, i, request, resources
            )
            modules.append(module)
        
        # Create learning path
        learning_path = LearningPath(
            total_duration=request.duration,
            daily_commitment="2 hours" if request.level == CourseLevel.BEGINNER else "3 hours",
            milestones=[
                {"week": i+1, "milestone": f"Complete {modules[i].title}"}
                for i in range(len(modules))
            ],
            suggested_schedule={
                f"Week {i+1}": [modules[i].title]
                for i in range(len(modules))
            }
        )
        
        # Create the complete course
        course = GeneratedCourse(
            course_id=self.generate_course_id(),
            title=structure['title'],
            slug=self.generate_slug(structure['title']),
            description=structure['description'],
            level=request.level,
            duration=request.duration,
            modules=modules,
            prerequisites=structure['prerequisites'],
            learning_objectives=request.learning_objectives or [
                f"Master {request.topic} fundamentals",
                f"Build practical projects using {request.topic}",
                f"Apply best practices and patterns",
                f"Prepare for real-world {request.topic} challenges"
            ],
            target_audience=request.target_audience or f"Anyone interested in learning {request.topic}",
            learning_path=learning_path,
            databank_resources=resources,
            tags=structure['tags'],
            language=request.language,
            status=CourseStatus.PUBLISHED,
            metadata={
                "generator_version": "1.0.0",
                "uses_llm": False,  # Currently using templates
                "resource_count": len(resources),
                "generated_at": datetime.now().isoformat()
            }
        )
        
        print(f"Course generation complete: {course.course_id}")
        return course


class InteractiveElementsGenerator:
    """Generate interactive elements for courses"""
    
    @staticmethod
    def generate_quiz(topic: str, level: str, num_questions: int = 5) -> List[Dict]:
        """Generate quiz questions"""
        questions = []
        question_templates = [
            f"What is the main purpose of {topic}?",
            f"Which of the following best describes {topic}?",
            f"What are the key components of {topic}?",
            f"How does {topic} differ from similar concepts?",
            f"What is a common use case for {topic}?",
            f"Which statement about {topic} is correct?",
            f"What is the first step when working with {topic}?",
            f"What are the benefits of using {topic}?"
        ]
        
        for i in range(min(num_questions, len(question_templates))):
            question = {
                "id": f"q_{i+1}",
                "question": question_templates[i % len(question_templates)],
                "type": "multiple_choice",
                "options": [
                    f"Answer option A for question {i+1}",
                    f"Answer option B for question {i+1}",
                    f"Answer option C for question {i+1}",
                    f"Answer option D for question {i+1}"
                ],
                "correct": i % 4,
                "explanation": f"This answer demonstrates understanding of {topic} at the {level} level.",
                "difficulty": level
            }
            questions.append(question)
        return questions
    
    @staticmethod
    def generate_coding_exercise(concept: str, language: str = "python") -> Dict:
        """Generate coding exercise"""
        exercises = {
            "python": f"""# Exercise: Implement {concept}

def implement_{concept.lower().replace(' ', '_')}(data):
    '''
    Your task: Implement a function that demonstrates {concept}.
    
    Args:
        data: Input data to process
    
    Returns:
        Processed result
    '''
    # TODO: Your implementation here
    pass

# Test cases
test_data = [1, 2, 3, 4, 5]
result = implement_{concept.lower().replace(' ', '_')}(test_data)
print(f"Result: {{result}}")
""",
            "javascript": f"""// Exercise: Implement {concept}

function implement{concept.replace(' ', '')}(data) {{
    // Your task: Implement a function that demonstrates {concept}
    // TODO: Your implementation here
    return data;
}}

// Test cases
const testData = [1, 2, 3, 4, 5];
const result = implement{concept.replace(' ', '')}(testData);
console.log('Result:', result);
"""
        }
        
        return {
            "title": f"Practice: {concept}",
            "description": f"Implement a solution that demonstrates your understanding of {concept}",
            "starter_code": exercises.get(language, exercises["python"]),
            "test_cases": [
                {"input": "[1, 2, 3]", "expected": "[2, 4, 6]"},
                {"input": "[5, 10]", "expected": "[10, 20]"},
                {"input": "[]", "expected": "[]"}
            ],
            "hints": [
                f"Review the {concept} documentation",
                "Consider edge cases like empty inputs",
                "Think about the expected output format"
            ],
            "solution": f"# Complete solution for {concept}\n# (Hidden until attempted)"
        }
    
    @staticmethod
    def generate_project(objectives: List[str]) -> Dict:
        """Generate project specification"""
        return {
            "title": "Capstone Project",
            "description": "Apply everything you've learned in a comprehensive project",
            "objectives": objectives or [
                "Demonstrate mastery of course concepts",
                "Build a real-world application",
                "Follow best practices"
            ],
            "requirements": [
                "Use the technologies covered in the course",
                "Implement at least 3 major features",
                "Include proper documentation",
                "Write tests for your code",
                "Deploy your solution"
            ],
            "deliverables": [
                "Source code repository",
                "Documentation (README)",
                "Live demo or deployment",
                "Project presentation"
            ],
            "evaluation_criteria": [
                "Functionality (40%)",
                "Code quality (30%)",
                "Documentation (20%)",
                "Innovation (10%)"
            ],
            "timeline": "2 weeks"
        }
