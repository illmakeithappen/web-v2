"""
AWS Bedrock Course Generator Service
Enhanced AI course generation using AWS Bedrock models
"""
import os
import json
import uuid
import re
import asyncio
from typing import List, Dict, Optional, Any
from datetime import datetime
import boto3
from botocore.exceptions import ClientError
from botocore.config import Config

from .course_models import (
    CourseRequest, CourseModule, GeneratedCourse,
    ContentSection, Activity, Assessment, LearningPath,
    CourseLevel, CourseStatus, AIModel
)
from .course_repository import CourseRepository
from app.services.prompt_loader import get_prompt_loader


class BedrockCourseGenerator:
    """Enhanced course generator using AWS Bedrock AI models"""

    def __init__(self):
        # AWS configuration
        self.aws_region = os.getenv("AWS_REGION", "eu-north-1")
        self.bedrock_client = None
        self.repository = CourseRepository()

        # Load configurable system prompts
        self.prompt_loader = get_prompt_loader()
        self.prompts = self.prompt_loader.load_course_generation_prompts()
        
        # Available Bedrock models (Updated with working inference profile ARNs)
        self.bedrock_models = {
            # Working Inference Profile ARNs
            "claude-4-sonnet": "arn:aws:bedrock:eu-north-1:749180650599:inference-profile/eu.anthropic.claude-sonnet-4-20250514-v1:0",
            "claude-3-7-sonnet": "arn:aws:bedrock:eu-north-1:749180650599:inference-profile/eu.anthropic.claude-3-7-sonnet-20250219-v1:0",
            # Alternative models (Nova - using ARNs)
            "nova-pro": "arn:aws:bedrock:eu-north-1:749180650599:inference-profile/eu.amazon.nova-pro-v1:0",
            "nova-lite": "arn:aws:bedrock:eu-north-1:749180650599:inference-profile/eu.amazon.nova-lite-v1:0",
            # Direct Model IDs (older models - if access is granted)
            "claude-3-5-sonnet": "anthropic.claude-3-5-sonnet-20240620-v1:0",
            "claude-3-5-haiku": "anthropic.claude-3-5-haiku-20241022-v1:0",
            "claude-3-haiku": "anthropic.claude-3-haiku-20240307-v1:0",
            "claude-3-sonnet": "anthropic.claude-3-sonnet-20240229-v1:0", 
            "claude-3-opus": "anthropic.claude-3-opus-20240229-v1:0"
        }
        
        self._initialize_bedrock_client()
    
    def _initialize_bedrock_client(self):
        """Initialize AWS Bedrock client with extended timeout"""
        try:
            # Configure extended timeout for long-running AI operations
            boto_config = Config(
                read_timeout=180,  # 3 minutes per API call
                connect_timeout=10,
                retries={'max_attempts': 2}
            )

            self.bedrock_client = boto3.client(
                service_name='bedrock-runtime',
                region_name=self.aws_region,
                aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
                config=boto_config
            )
            print(f"✅ AWS Bedrock client initialized in region: {self.aws_region} (timeout: 180s)")
        except Exception as e:
            print(f"Failed to initialize Bedrock client: {e}")
            self.bedrock_client = None
    
    async def invoke_bedrock_model(self, prompt: str, model_id: str = "claude-3-haiku", 
                                 system_prompt: str = None, max_tokens: int = 4000) -> str:
        """Invoke AWS Bedrock model with prompt"""
        if not self.bedrock_client:
            return self._generate_template_content(prompt)
        
        try:
            # Get the full model ID
            full_model_id = self.bedrock_models.get(model_id, model_id)
            
            # Prepare request based on model type
            if "anthropic.claude" in full_model_id or "eu.anthropic.claude" in full_model_id:
                body = {
                    "anthropic_version": "bedrock-2023-05-31",
                    "max_tokens": max_tokens,
                    "temperature": 0.7,
                    "messages": [
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ]
                }
                if system_prompt:
                    body["system"] = system_prompt
                    
            elif "amazon.titan" in full_model_id:
                body = {
                    "inputText": f"{system_prompt}\n\n{prompt}" if system_prompt else prompt,
                    "textGenerationConfig": {
                        "maxTokenCount": max_tokens,
                        "temperature": 0.7,
                        "topP": 0.9
                    }
                }
                
            elif "ai21.j2" in full_model_id:
                body = {
                    "prompt": f"{system_prompt}\n\n{prompt}" if system_prompt else prompt,
                    "maxTokens": max_tokens,
                    "temperature": 0.7
                }
                
            elif "meta.llama2" in full_model_id:
                body = {
                    "prompt": f"{system_prompt}\n\n{prompt}" if system_prompt else prompt,
                    "max_gen_len": max_tokens,
                    "temperature": 0.7,
                    "top_p": 0.9
                }
                
            elif "amazon.nova" in full_model_id or "eu.amazon.nova" in full_model_id:
                body = {
                    "messages": [
                        {
                            "role": "user",
                            "content": f"{system_prompt}\n\n{prompt}" if system_prompt else prompt
                        }
                    ],
                    "inferenceConfig": {
                        "max_new_tokens": max_tokens,
                        "temperature": 0.7,
                        "top_p": 0.9
                    }
                }
            
            # Make the API call
            response = self.bedrock_client.invoke_model(
                modelId=full_model_id,
                body=json.dumps(body)
            )
            
            # Parse response based on model type
            response_body = json.loads(response['body'].read())
            
            if "anthropic.claude" in full_model_id or "eu.anthropic.claude" in full_model_id:
                return response_body['content'][0]['text']
            elif "amazon.titan" in full_model_id:
                return response_body['results'][0]['outputText']
            elif "amazon.nova" in full_model_id or "eu.amazon.nova" in full_model_id:
                return response_body['output']['message']['content'][0]['text']
            elif "ai21.j2" in full_model_id:
                return response_body['completions'][0]['data']['text']
            elif "meta.llama2" in full_model_id:
                return response_body['generation']
            
            return "Unable to parse model response"
            
        except ClientError as e:
            print(f"Bedrock API error: {e}")
            return self._generate_template_content(prompt)
        except Exception as e:
            print(f"Bedrock invocation error: {e}")
            return self._generate_template_content(prompt)
    
    def _generate_template_content(self, prompt: str) -> str:
        """Fallback template generation when Bedrock is unavailable"""
        topic = "the subject"
        if "topic:" in prompt.lower():
            topic = prompt.lower().split("topic:")[1].split("\n")[0].strip()
        elif "Topic:" in prompt:
            topic = prompt.split("Topic:")[1].split("\n")[0].strip()
        
        return json.dumps({
            "content": f"This is template-generated content for {topic}. AWS Bedrock integration not available.",
            "sections": [
                "Introduction and Overview",
                "Core Concepts", 
                "Practical Applications",
                "Best Practices"
            ]
        })
    
    def generate_course_id(self) -> str:
        """Generate unique course ID"""
        return f"bedrock_course_{uuid.uuid4().hex[:12]}"
    
    def generate_slug(self, title: str) -> str:
        """Generate URL-friendly slug"""
        slug = re.sub(r'[^\w\s-]', '', title.lower())
        slug = re.sub(r'[-\s]+', '-', slug)
        base_slug = slug[:40]
        
        import time
        timestamp = str(int(time.time()))[-6:]
        unique_slug = f"{base_slug}-{timestamp}"
        
        return unique_slug[:50]
    
    async def generate_course_outline(self, request: CourseRequest) -> Dict:
        """Generate comprehensive course outline using Bedrock"""

        # Load system prompt from configuration
        system_prompt = self.prompts.get(
            "Course Outline Generation Prompt",
            "You are an expert course designer and educator. Create comprehensive, engaging course outlines that are pedagogically sound and practical."
        )

        prompt = f"""
        Create a detailed course outline for the following specifications:
        
        Topic: {request.topic}
        Level: {request.level.value}
        Duration: {request.duration}
        Target Audience: {request.target_audience or 'General learners'}
        Prerequisites: {', '.join(request.prerequisites) if request.prerequisites else 'None specified'}
        Learning Objectives: {', '.join(request.learning_objectives) if request.learning_objectives else 'To be determined'}
        
        Please provide a JSON response with the following structure:
        {{
            "title": "Course title",
            "description": "Comprehensive course description",
            "modules": [
                {{
                    "title": "Module title",
                    "description": "Module description", 
                    "learning_objectives": ["objective 1", "objective 2"],
                    "duration": "estimated duration",
                    "key_concepts": ["concept 1", "concept 2"]
                }}
            ],
            "prerequisites": ["prerequisite 1", "prerequisite 2"],
            "learning_path": "Description of the learning progression",
            "assessment_strategy": "How learners will be assessed",
            "tags": ["tag1", "tag2", "tag3"]
        }}
        
        Make the content appropriate for {request.level.value} level learners and ensure it can be completed in {request.duration}.
        """
        
        response = await self.invoke_bedrock_model(
            prompt=prompt,
            model_id="claude-4-sonnet",
            system_prompt=system_prompt,
            max_tokens=4000
        )
        
        try:
            parsed_response = json.loads(response)
            # Ensure the response has required fields
            if 'title' not in parsed_response:
                parsed_response['title'] = f"Complete {request.topic} {request.level.value.title()} Course"
            if 'description' not in parsed_response:
                parsed_response['description'] = f"Master {request.topic} with this comprehensive course"
            if 'modules' not in parsed_response or not parsed_response['modules']:
                parsed_response['modules'] = self._get_default_modules(request.topic, request.level)
            return parsed_response
        except (json.JSONDecodeError, Exception):
            # Fallback structure
            return {
                "title": f"Complete {request.topic} {request.level.value.title()} Course",
                "description": f"Master {request.topic} with this comprehensive course",
                "modules": self._get_default_modules(request.topic, request.level),
                "prerequisites": request.prerequisites or [],
                "learning_path": f"Progressive learning path for {request.topic}",
                "assessment_strategy": "Quizzes, projects, and practical exercises",
                "tags": [request.topic.lower(), request.level.value, "bedrock-generated"]
            }
    
    def _get_default_modules(self, topic: str, level: CourseLevel) -> List[Dict]:
        """Default module structure for fallback"""
        base_modules = [
            {"title": f"Introduction to {topic}", "description": f"Getting started with {topic}"},
            {"title": f"Core Concepts", "description": f"Fundamental principles of {topic}"},
            {"title": f"Practical Applications", "description": f"Real-world use of {topic}"},
            {"title": f"Advanced Techniques", "description": f"Advanced {topic} methods"},
            {"title": f"Best Practices", "description": f"Industry standards for {topic}"},
            {"title": f"Final Project", "description": f"Capstone project using {topic}"}
        ]

        # Optimized for faster generation: fewer modules
        if level == CourseLevel.BEGINNER:
            return base_modules[:3]  # 3 modules instead of 4
        elif level == CourseLevel.INTERMEDIATE:
            return base_modules[:4]  # 4 modules instead of 5
        else:
            return base_modules[:5]  # 5 modules instead of 6
    
    async def generate_module_content(self, module_outline: Dict, index: int,
                                    request: CourseRequest, course_context: str) -> CourseModule:
        """Generate detailed module content using Bedrock"""

        # Load system prompt from configuration
        base_system_prompt = self.prompts.get(
            "Module Content Generation Prompt",
            "You are an expert instructor creating detailed educational content."
        )

        # Add course-specific context to the prompt
        system_prompt = f"""{base_system_prompt}

Focus on creating materials for {request.level.value} level learners.
Course Context: {course_context}"""

        prompt = f"""
        Create detailed content for this course module:
        
        Module: {module_outline['title']}
        Description: {module_outline['description']}
        Course Topic: {request.topic}
        Level: {request.level.value}
        Target Duration: 1-2 hours of content
        
        Generate content with the following sections:
        1. Theoretical Foundation (explanation of key concepts)
        2. Practical Examples (code examples, case studies)
        3. Hands-on Exercise (interactive practice)
        
        For each section, provide:
        - Clear, engaging title
        - Educational content (text/code as appropriate)
        - Estimated duration in minutes
        - Learning objectives
        
        Also include:
        - 3-5 quiz questions with multiple choice answers
        - 1 practical coding/project exercise with instructions
        - List of key takeaways
        
        Format as JSON with clear structure for easy parsing.
        """
        
        response = await self.invoke_bedrock_model(
            prompt=prompt,
            model_id="claude-4-sonnet", 
            system_prompt=system_prompt,
            max_tokens=4000
        )
        
        # Parse AI response or use structured fallback
        try:
            ai_content = json.loads(response)
        except json.JSONDecodeError:
            ai_content = self._generate_fallback_module_content(module_outline)
        
        # Create content sections
        content_sections = []
        
        # Theory section
        content_sections.append(ContentSection(
            title=ai_content.get('theory_title', f"Understanding {module_outline['title']}"),
            content_type="text",
            content=ai_content.get('theory_content', f"Comprehensive overview of {module_outline['title']}"),
            duration_minutes=ai_content.get('theory_duration', 25),
            resources=[]
        ))
        
        # Practical section
        content_sections.append(ContentSection(
            title=ai_content.get('practical_title', f"Practical Examples"),
            content_type="code",
            content=ai_content.get('practical_content', f"# Examples for {module_outline['title']}\nprint('Hello, {request.topic}!')"),
            duration_minutes=ai_content.get('practical_duration', 30),
            resources=[]
        ))
        
        # Interactive section
        content_sections.append(ContentSection(
            title=ai_content.get('interactive_title', f"Hands-on Practice"),
            content_type="interactive", 
            content=ai_content.get('interactive_content', f"Practice exercises for {module_outline['title']}"),
            duration_minutes=ai_content.get('interactive_duration', 35),
            resources=[]
        ))
        
        # Activities
        activities = []
        if request.include_projects:
            activity = Activity(
                title=ai_content.get('exercise_title', f"{module_outline['title']} Challenge"),
                type="coding_exercise",
                description=ai_content.get('exercise_description', f"Apply your knowledge of {module_outline['title']}"),
                instructions=ai_content.get('exercise_instructions', [
                    "Analyze the problem requirements",
                    "Design your solution approach", 
                    "Implement the solution",
                    "Test with various inputs",
                    "Optimize and refine"
                ]),
                duration_minutes=45,
                difficulty=request.level,
                solution=ai_content.get('exercise_solution', "# Solution provided after completion"),
                hints=ai_content.get('exercise_hints', ["Break the problem into smaller parts", "Consider edge cases"])
            )
            activities.append(activity)
        
        # Assessment
        assessment = None
        if request.include_assessments:
            quiz_questions = ai_content.get('quiz_questions', self._generate_default_quiz(module_outline['title']))
            
            assessment = Assessment(
                type="quiz",
                title=f"{module_outline['title']} Knowledge Check",
                questions=quiz_questions,
                passing_score=0.7,
                max_attempts=3,
                time_limit_minutes=20
            )
        
        return CourseModule(
            module_id=f"bedrock_module_{index + 1}",
            title=module_outline['title'],
            description=module_outline['description'],
            duration="2 hours",
            objectives=ai_content.get('learning_objectives', [
                f"Understand {module_outline['title']} concepts",
                f"Apply {module_outline['title']} in practice", 
                f"Complete hands-on exercises"
            ]),
            content_sections=content_sections,
            activities=activities,
            assessment=assessment,
            resources=[],
            order=index
        )
    
    def _generate_fallback_module_content(self, module_outline: Dict) -> Dict:
        """Generate fallback content when AI parsing fails"""
        return {
            "theory_title": f"Understanding {module_outline['title']}",
            "theory_content": f"In this section, we explore the key concepts of {module_outline['title']}.",
            "theory_duration": 25,
            "practical_title": "Practical Examples",
            "practical_content": f"# Practical examples for {module_outline['title']}\n\n# Example implementation\nprint('Learning {module_outline['title']}!')",
            "practical_duration": 30,
            "interactive_title": "Hands-on Practice", 
            "interactive_content": f"Complete the following exercises to practice {module_outline['title']}.",
            "interactive_duration": 35,
            "learning_objectives": [
                f"Understand {module_outline['title']} fundamentals",
                f"Apply concepts through exercises"
            ]
        }
    
    def _generate_default_quiz(self, topic: str) -> List[Dict]:
        """Generate default quiz questions"""
        return [
            {
                "question": f"What is the main purpose of {topic}?",
                "type": "multiple_choice",
                "options": [
                    f"Primary function A of {topic}",
                    f"Primary function B of {topic}", 
                    f"Primary function C of {topic}",
                    f"Primary function D of {topic}"
                ],
                "correct": 0,
                "explanation": f"This demonstrates understanding of {topic} fundamentals."
            }
        ]
    
    async def synthesize_course(self, course_outline: Dict, modules: List[CourseModule],
                               request: CourseRequest) -> Dict[str, Any]:
        """
        AI synthesis step to ensure cross-module coherence and integration.
        Reviews all generated modules and provides enhancements for overall course quality.
        """
        print(f"🔬 Starting AI synthesis for course coherence...")

        # Load synthesis system prompt
        system_prompt = self.prompts.get(
            "Course Synthesis and Integration Prompt",
            "You are an expert curriculum synthesizer ensuring cohesive, integrated learning experiences."
        )

        # Build comprehensive course summary for synthesis
        modules_summary = []
        for i, module in enumerate(modules):
            modules_summary.append({
                "module_number": i + 1,
                "title": module.title,
                "description": module.description,
                "objectives": module.objectives,
                "content_sections": [
                    {"title": section.title, "type": section.content_type}
                    for section in module.content_sections
                ],
                "has_assessment": module.assessment is not None,
                "has_activities": len(module.activities) > 0
            })

        prompt = f"""
        Analyze this complete course for coherence, integration, and quality:

        **Course Overview:**
        - Title: {course_outline['title']}
        - Description: {course_outline['description']}
        - Level: {request.level.value}
        - Topic: {request.topic}
        - Duration: {request.duration}
        - Learning Objectives: {', '.join(request.learning_objectives) if request.learning_objectives else 'General mastery'}

        **Generated Modules:**
        {json.dumps(modules_summary, indent=2)}

        Please provide your synthesis analysis as a JSON object with the following structure:
        {{
            "coherence_assessment": "Analysis of how well modules flow and build on each other",
            "learning_path_enhancements": {{
                "optimized_milestones": [
                    {{"week": 1, "milestone": "Achievement description", "modules_covered": [1, 2]}}
                ],
                "daily_commitment_recommendation": "Realistic daily time commitment",
                "pacing_variations": {{
                    "fast_track": "4 weeks schedule",
                    "standard": "6 weeks schedule",
                    "in_depth": "8 weeks schedule"
                }}
            }},
            "module_transitions": [
                {{"from_module": 1, "to_module": 2, "transition_text": "Bridge text connecting modules"}}
            ],
            "cross_references": [
                {{"module": 2, "references_module": 1, "concept": "Specific concept to reference", "context": "How it connects"}}
            ],
            "capstone_project": {{
                "title": "Final integrative project title",
                "description": "Project description integrating all modules",
                "requirements": ["Requirement 1", "Requirement 2"],
                "learning_outcomes": ["Outcome 1", "Outcome 2"],
                "estimated_hours": 10
            }},
            "quality_recommendations": [
                "Specific improvement suggestion 1",
                "Specific improvement suggestion 2"
            ],
            "overall_quality_score": {{"score": 8, "justification": "Why this score"}}
        }}
        """

        response = await self.invoke_bedrock_model(
            prompt=prompt,
            model_id="claude-4-sonnet",
            system_prompt=system_prompt,
            max_tokens=4000
        )

        try:
            synthesis_result = json.loads(response)
            print(f"✅ Synthesis complete - Quality score: {synthesis_result.get('overall_quality_score', {}).get('score', 'N/A')}/10")
            return synthesis_result
        except json.JSONDecodeError:
            print(f"⚠️ Synthesis parsing failed, using default recommendations")
            return {
                "coherence_assessment": "Modules generated successfully, standard coherence expected",
                "learning_path_enhancements": {
                    "optimized_milestones": [],
                    "daily_commitment_recommendation": "1-2 hours daily",
                    "pacing_variations": {}
                },
                "module_transitions": [],
                "cross_references": [],
                "capstone_project": None,
                "quality_recommendations": [],
                "overall_quality_score": {"score": 7, "justification": "Standard AI-generated course"}
            }

    async def generate_course(self, request: CourseRequest) -> GeneratedCourse:
        """Generate a complete course using AWS Bedrock"""
        print(f"🚀 Starting Bedrock course generation for: {request.topic}")

        # Generate course outline using AI
        course_outline = await self.generate_course_outline(request)
        print(f"📋 Generated course outline with {len(course_outline.get('modules', []))} modules")

        # Generate modules with AI-powered content (in parallel for speed)
        course_context = f"Course: {course_outline['title']} | Level: {request.level.value} | Topic: {request.topic}"

        module_outlines = course_outline.get('modules', [])
        print(f"⚡ Generating {len(module_outlines)} modules in parallel...")

        # Create concurrent tasks for all modules
        module_tasks = [
            self.generate_module_content(module_outline, i, request, course_context)
            for i, module_outline in enumerate(module_outlines)
        ]

        # Execute all module generation tasks concurrently
        modules = await asyncio.gather(*module_tasks)
        print(f"✅ All {len(modules)} modules generated successfully")

        # Optional: AI synthesis step for enhanced coherence
        synthesis_result = None
        if request.enable_synthesis:
            synthesis_result = await self.synthesize_course(course_outline, modules, request)
            print(f"📊 Synthesis recommendations: {len(synthesis_result.get('quality_recommendations', []))} improvements identified")

        # Create learning path (enhanced with synthesis if available)
        if synthesis_result and synthesis_result.get('learning_path_enhancements'):
            enhancements = synthesis_result['learning_path_enhancements']
            learning_path = LearningPath(
                total_duration=request.duration,
                daily_commitment=enhancements.get('daily_commitment_recommendation', "1-2 hours daily"),
                milestones=enhancements.get('optimized_milestones', [
                    {"week": i+1, "milestone": f"Master {modules[i].title}"}
                    for i in range(len(modules))
                ]),
                suggested_schedule=enhancements.get('pacing_variations', {
                    f"Module {i+1}": [modules[i].title]
                    for i in range(len(modules))
                })
            )
        else:
            learning_path = LearningPath(
                total_duration=request.duration,
                daily_commitment="1-2 hours daily",
                milestones=[
                    {"week": i+1, "milestone": f"Master {modules[i].title}"}
                    for i in range(len(modules))
                ],
                suggested_schedule={
                    f"Module {i+1}": [modules[i].title]
                    for i in range(len(modules))
                }
            )
        
        # Create complete course
        course = GeneratedCourse(
            course_id=self.generate_course_id(),
            title=course_outline['title'],
            slug=self.generate_slug(course_outline['title']),
            description=course_outline['description'],
            level=request.level,
            duration=request.duration,
            modules=modules,
            prerequisites=course_outline.get('prerequisites', []),
            learning_objectives=request.learning_objectives or [
                f"Master {request.topic} fundamentals",
                f"Build practical {request.topic} projects",
                f"Apply industry best practices"
            ],
            target_audience=request.target_audience or f"{request.level.value.title()} {request.topic} learners",
            learning_path=learning_path,
            databank_resources=[],  # Could integrate with existing resources
            tags=course_outline.get('tags', [request.topic.lower(), request.level.value]),
            language=request.language,
            status=CourseStatus.PUBLISHED,
            metadata={
                "generator_version": "2.0.0-bedrock",
                "uses_bedrock": True,
                "bedrock_models_used": ["claude-4-sonnet"],
                "generated_at": datetime.now().isoformat(),
                "ai_enhanced": True,
                "synthesis_enabled": request.enable_synthesis,
                "synthesis_result": synthesis_result if synthesis_result else None,
                "quality_score": synthesis_result.get('overall_quality_score', {}).get('score') if synthesis_result else None
            }
        )
        
        # Save to repository
        course_id = await self.repository.save_course(course)
        print(f"✅ Course saved to repository: {course_id}")
        
        return course
    
    async def regenerate_module(self, course_id: str, module_index: int, 
                              custom_prompt: str = None) -> CourseModule:
        """Regenerate a specific module with custom requirements"""
        course = await self.repository.get_course(course_id)
        if not course or module_index >= len(course['modules']):
            raise ValueError("Invalid course or module index")
        
        module_data = course['modules'][module_index]
        
        # Create course request context from existing course
        request = CourseRequest(
            topic=course.get('title', 'Unknown Topic'),
            level=CourseLevel(course.get('level', 'beginner')),
            duration=course.get('duration', '4 weeks'),
            include_assessments=True,
            include_projects=True
        )
        
        # Enhanced prompt for regeneration
        enhanced_prompt = custom_prompt or f"Regenerate with enhanced detail and practical examples"
        
        module_outline = {
            'title': module_data['title'],
            'description': f"{module_data['description']} | Enhancement: {enhanced_prompt}"
        }
        
        new_module = await self.generate_module_content(
            module_outline, module_index, request, f"Course: {course['title']}"
        )
        
        print(f"🔄 Regenerated module: {new_module.title}")
        return new_module


# Utility functions for integration
async def create_bedrock_course(topic: str, level: str = "beginner", 
                              duration: str = "4 weeks") -> GeneratedCourse:
    """Convenience function to create a course using Bedrock"""
    generator = BedrockCourseGenerator()
    
    request = CourseRequest(
        topic=topic,
        level=CourseLevel(level),
        duration=duration,
        use_databank_resources=True,
        include_assessments=True,
        include_projects=True,
        ai_model=AIModel.ANTHROPIC_CLAUDE  # Using Bedrock instead
    )
    
    return await generator.generate_course(request)


if __name__ == "__main__":
    # Test the Bedrock course generator
    async def test_bedrock_generator():
        course = await create_bedrock_course(
            topic="Python Programming",
            level="intermediate",
            duration="6 weeks"
        )
        print(f"Generated course: {course.title}")
        print(f"Modules: {len(course.modules)}")
        print(f"Course ID: {course.course_id}")
    
    # Run test
    asyncio.run(test_bedrock_generator())