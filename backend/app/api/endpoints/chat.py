"""
Bedrock Chat API Endpoint
Provides real-time chat functionality with Claude via AWS Bedrock
"""
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
import boto3
import json
import os
from datetime import datetime

router = APIRouter()

# Chat models
class ChatMessage(BaseModel):
    role: str = Field(..., description="Message role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")
    timestamp: Optional[str] = None

class ChatRequest(BaseModel):
    message: str = Field(..., description="User message")
    conversation_history: List[ChatMessage] = Field(default=[], description="Previous messages")
    model: str = Field(default="claude-4-sonnet", description="Claude model to use")
    max_tokens: int = Field(default=1000, description="Maximum response tokens")
    temperature: float = Field(default=0.7, description="Response creativity (0-1)")

class ChatResponse(BaseModel):
    model_config = {'protected_namespaces': ()}
    
    message: str = Field(..., description="Claude's response")
    model_used: str = Field(..., description="Model that generated the response")
    tokens_used: int = Field(..., description="Tokens consumed")
    timestamp: str = Field(..., description="Response timestamp")

# Bedrock Chat Service
class BedrockChatService:
    def __init__(self):
        self.aws_region = os.getenv("AWS_REGION", "eu-north-1")
        self.bedrock_client = None
        self._initialize_bedrock_client()
        
        # Available models with inference profile ARNs
        self.models = {
            "claude-4-sonnet": "arn:aws:bedrock:eu-north-1:749180650599:inference-profile/eu.anthropic.claude-sonnet-4-20250514-v1:0",
            "claude-3-7-sonnet": "arn:aws:bedrock:eu-north-1:749180650599:inference-profile/eu.anthropic.claude-3-7-sonnet-20250219-v1:0",
            "claude-3-5-sonnet": "anthropic.claude-3-5-sonnet-20240620-v1:0",
            "claude-3-haiku": "anthropic.claude-3-haiku-20240307-v1:0",
            "nova-pro": "arn:aws:bedrock:eu-north-1:749180650599:inference-profile/eu.amazon.nova-pro-v1:0",
            "nova-lite": "arn:aws:bedrock:eu-north-1:749180650599:inference-profile/eu.amazon.nova-lite-v1:0"
        }
    
    def _initialize_bedrock_client(self):
        """Initialize AWS Bedrock client"""
        try:
            self.bedrock_client = boto3.client(
                service_name='bedrock-runtime',
                region_name=self.aws_region,
                aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
            )
            print(f"✅ Bedrock chat client initialized in region: {self.aws_region}")
        except Exception as e:
            print(f"❌ Failed to initialize Bedrock client: {e}")
            self.bedrock_client = None
    
    def _format_conversation(self, message: str, history: List[ChatMessage]) -> List[dict]:
        """Format conversation history for Claude"""
        messages = []
        
        # Add conversation history
        for msg in history[-10:]:  # Keep last 10 messages for context
            messages.append({
                "role": msg.role,
                "content": msg.content
            })
        
        # Add current user message
        messages.append({
            "role": "user",
            "content": message
        })
        
        return messages
    
    async def chat(self, request: ChatRequest) -> ChatResponse:
        """Send message to Claude and get response"""
        if not self.bedrock_client:
            raise HTTPException(status_code=500, detail="Bedrock client not available")
        
        try:
            # Get model ARN/ID
            model_id = self.models.get(request.model, self.models["claude-4-sonnet"])
            
            # Format conversation
            messages = self._format_conversation(request.message, request.conversation_history)
            
            # Prepare request body based on model type
            if "amazon.nova" in model_id:
                # Nova model format
                body = {
                    "messages": messages,
                    "inferenceConfig": {
                        "max_new_tokens": request.max_tokens,
                        "temperature": request.temperature,
                        "top_p": 0.9
                    }
                }
            else:
                # Claude model format
                body = {
                    "anthropic_version": "bedrock-2023-05-31",
                    "max_tokens": request.max_tokens,
                    "temperature": request.temperature,
                    "messages": messages,
                    "system": "You are Claude, a helpful AI assistant. Provide clear, accurate, and engaging responses."
                }
            
            # Make the API call
            response = self.bedrock_client.invoke_model(
                modelId=model_id,
                body=json.dumps(body),
                contentType="application/json"
            )
            
            # Parse response
            response_body = json.loads(response['body'].read())
            
            if "amazon.nova" in model_id:
                # Nova response format
                message_text = response_body['output']['message']['content'][0]['text']
                tokens_used = response_body.get('usage', {}).get('totalTokens', 0)
            else:
                # Claude response format
                message_text = response_body['content'][0]['text']
                tokens_used = response_body.get('usage', {}).get('input_tokens', 0) + \
                            response_body.get('usage', {}).get('output_tokens', 0)
            
            return ChatResponse(
                message=message_text,
                model_used=request.model,
                tokens_used=tokens_used,
                timestamp=datetime.now().isoformat()
            )
            
        except Exception as e:
            print(f"❌ Bedrock chat error: {e}")
            raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

# Initialize service
chat_service = BedrockChatService()

# API Endpoints
@router.post("/chat", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """Send a message to Claude and get a response"""
    try:
        response = await chat_service.chat(request)
        return response
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/models")
async def list_available_models():
    """List available chat models"""
    return {
        "models": [
            {
                "id": "claude-4-sonnet", 
                "name": "Claude 4 Sonnet", 
                "description": "Latest and most powerful Claude model",
                "recommended": True
            },
            {
                "id": "claude-3-7-sonnet", 
                "name": "Claude 3.7 Sonnet", 
                "description": "Enhanced Claude 3.7 with improved capabilities"
            },
            {
                "id": "claude-3-5-sonnet", 
                "name": "Claude 3.5 Sonnet", 
                "description": "Balanced performance and speed"
            },
            {
                "id": "claude-3-haiku", 
                "name": "Claude 3 Haiku", 
                "description": "Fast and cost-effective"
            },
            {
                "id": "nova-pro", 
                "name": "Amazon Nova Pro", 
                "description": "Amazon's powerful alternative"
            },
            {
                "id": "nova-lite", 
                "name": "Amazon Nova Lite", 
                "description": "Fast Amazon alternative"
            }
        ]
    }

@router.get("/health")
async def chat_health():
    """Check chat service health"""
    if chat_service.bedrock_client:
        return {"status": "healthy", "service": "bedrock-chat", "region": chat_service.aws_region}
    else:
        return {"status": "unhealthy", "service": "bedrock-chat", "error": "Bedrock client not available"}