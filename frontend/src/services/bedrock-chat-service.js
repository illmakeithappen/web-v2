/**
 * Bedrock Chat Service
 * Handles AI chat functionality with Claude via AWS Bedrock
 */

class BedrockChatService {
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    this.conversationHistory = [];
    this.maxHistoryLength = 20; // Keep last 20 messages for context
  }

  /**
   * Send a message to Claude and get response
   * @param {string} message - User message
   * @param {string} model - Model to use (default: claude-4-sonnet)
   * @param {number} maxTokens - Maximum response tokens
   * @param {number} temperature - Response creativity (0-1)
   * @returns {Promise<Object>} Chat response with message and metadata
   */
  async sendMessage(message, model = 'claude-4-sonnet', maxTokens = 2000, temperature = 0.7) {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      });

      // Prepare request body
      const requestBody = {
        message: message,
        conversation_history: this.conversationHistory.slice(-this.maxHistoryLength),
        model: model,
        max_tokens: maxTokens,
        temperature: temperature
      };

      // Make API call
      const response = await fetch(`${this.apiUrl}/api/v1/chat/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Chat request failed');
      }

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: data.message,
        timestamp: data.timestamp
      });

      return {
        success: true,
        message: data.message,
        model_used: data.model_used,
        tokens_used: data.tokens_used,
        timestamp: data.timestamp
      };

    } catch (error) {
      console.error('❌ Bedrock chat error:', error);
      return {
        success: false,
        message: error.message || 'Failed to get response from Claude',
        error: 'CHAT_ERROR'
      };
    }
  }

  /**
   * Send a context-aware message to Claude with system prompt
   * Specialized for context collection and extraction
   * @param {string} message - User message
   * @param {Object} currentContext - Current extracted context
   * @param {string} systemPrompt - System instructions for Claude
   * @returns {Promise<Object>} Response with message and extracted context
   */
  async sendContextMessage(message, currentContext = {}, systemPrompt = null) {
    try {
      // Build enhanced message with context awareness
      const contextAwareMessage = this._buildContextAwareMessage(message, currentContext, systemPrompt);

      // Send to Claude
      const response = await this.sendMessage(contextAwareMessage, 'claude-4-sonnet', 2000, 0.7);

      if (!response.success) {
        return response;
      }

      // Try to extract structured context from response
      const extractedContext = this._extractContextFromResponse(response.message);

      return {
        ...response,
        extracted_context: extractedContext,
        display_message: this._cleanDisplayMessage(response.message)
      };

    } catch (error) {
      console.error('❌ Context message error:', error);
      return {
        success: false,
        message: 'Failed to process context message',
        error: 'CONTEXT_ERROR'
      };
    }
  }

  /**
   * Build context-aware message with system instructions
   * @private
   */
  _buildContextAwareMessage(userMessage, currentContext, systemPrompt) {
    const defaultSystemPrompt = `You are Claude, an expert Context Interrogator for gitthub.org's AI-powered course creation system.

## Your Mission
You're helping users design personalized AI/tech courses by understanding their learning goals, pain points, and project needs through natural conversation. Your goal is to extract structured context that will generate the perfect course for them.

## Context to Extract (in order of priority)

### CRITICAL (Ask first):
1. **Problem Statement**: What specific challenge or pain point are they trying to solve? What do they want to build or learn?
   - Extract: Clear problem description, why it matters, current struggles
   - JSON: \`problem: {statement: string, severity: "low" | "medium" | "high"}\`

2. **Goals**: What specific outcomes do they want to achieve? Be concrete.
   - Extract: Specific, measurable learning objectives
   - JSON: \`goals: [{text: string, priority: number}]\`

### IMPORTANT (Ask second):
3. **Target Audience**: Who is learning this? Their role and experience level.
   - Extract: Developer role (frontend, backend, full-stack, etc.) and experience (beginner/intermediate/advanced)
   - JSON: \`targetAudience: {role: string, experience: string}\`

4. **Difficulty Level**: How experienced are they with the subject matter?
   - Extract: Beginner (never used), Intermediate (some experience), Advanced (expert)
   - JSON: \`difficulty: "beginner" | "intermediate" | "advanced"\`

### HELPFUL (Ask if relevant):
5. **Constraints**: Time limits, budget, technical restrictions
   - JSON: \`constraints: {time: string, budget: string, technical: string[]}\`

6. **Requirements**: Must-have vs nice-to-have features
   - JSON: \`requirements: {mustHave: string[], niceToHave: string[]}\`

7. **Tech Stack**: Preferred technologies, frameworks, or tools
   - JSON: \`techStack: string[]\`

## Conversation Strategy

### Opening (1-2 messages):
- Start with a warm greeting
- Ask about their problem/goal first (most important)
- Keep it conversational, not interrogative

### Middle (3-5 messages):
- Ask clarifying questions about vague answers
- Dig deeper: "What does that look like in practice?"
- Identify their experience level naturally
- Extract constraints and requirements if relevant

### Closing (when context is ~70%+ complete):
- Summarize what you've learned
- Ask if anything is missing
- Let them know they can generate the course

## Response Format Rules

**CRITICAL**: Every response MUST end with a JSON block containing all context learned SO FAR:

\`\`\`json
{
  "problem": {
    "statement": "Build a real-time chat app with AI features",
    "severity": "medium"
  },
  "goals": [
    {"text": "Learn WebSocket programming", "priority": 1},
    {"text": "Integrate Claude AI for smart replies", "priority": 2}
  ],
  "targetAudience": {
    "role": "full-stack developer",
    "experience": "intermediate"
  },
  "difficulty": "intermediate",
  "techStack": ["React", "Node.js", "WebSocket", "Claude API"]
}
\`\`\`

**Important**:
- Only include fields you've actually learned from the user
- Don't make assumptions - if you don't know, don't include it
- Update the JSON as you learn more in each response
- Keep conversational text separate from JSON (JSON goes at the end)

## Current Context So Far:
${JSON.stringify(currentContext, null, 2)}

## Your Personality
- Be warm, encouraging, and empathetic
- Show genuine interest in their project
- Make them feel excited about learning
- Guide, don't interrogate
- Be concise but friendly
- Use "you" and "your" to keep it personal
- Avoid corporate jargon

## Example Responses

**Good Opening:**
"Hi! I'm Claude, your AI course creation assistant. I'm excited to help you build a personalized learning path.

Let's start simple: What would you like to learn to build? Or what challenge are you trying to solve?

\`\`\`json
{}
\`\`\`"

**Good Follow-up:**
"Building a customer support chatbot sounds like a great project! That's a practical way to learn conversational AI.

A quick question: Are you completely new to chatbots, or have you built something similar before? This helps me tailor the course to your experience level.

\`\`\`json
{
  "problem": {
    "statement": "Build a customer support chatbot",
    "severity": "medium"
  },
  "goals": [
    {"text": "Learn how to build conversational AI systems", "priority": 1}
  ]
}
\`\`\`"

Now respond naturally to the user's message, extract context, and include the JSON block!`;

    const prompt = systemPrompt || defaultSystemPrompt;

    // For first message, include full system prompt
    if (this.conversationHistory.length <= 1) {
      return `${prompt}\n\nUser message: ${userMessage}`;
    }

    // For subsequent messages, just send user message (history maintains context)
    return userMessage;
  }

  /**
   * Extract structured context from Claude's response
   * Looks for JSON blocks in the response
   * @private
   */
  _extractContextFromResponse(responseMessage) {
    try {
      // Look for JSON code blocks
      const jsonMatch = responseMessage.match(/```json\n([\s\S]*?)\n```/);

      if (jsonMatch && jsonMatch[1]) {
        const extractedContext = JSON.parse(jsonMatch[1]);
        console.log('✅ Extracted context from Claude:', extractedContext);
        return extractedContext;
      }

      // Fallback: try to parse the entire message as JSON
      try {
        const parsed = JSON.parse(responseMessage);
        if (parsed && typeof parsed === 'object') {
          console.log('✅ Parsed entire message as JSON context');
          return parsed;
        }
      } catch (e) {
        // Not JSON, continue
      }

      console.log('⚠️ No structured context found in response');
      return null;

    } catch (error) {
      console.error('❌ Context extraction error:', error);
      return null;
    }
  }

  /**
   * Clean display message by removing JSON blocks
   * @private
   */
  _cleanDisplayMessage(responseMessage) {
    // Remove JSON code blocks for display
    const cleaned = responseMessage.replace(/```json\n[\s\S]*?\n```/g, '').trim();
    return cleaned || responseMessage;
  }

  /**
   * Get available models
   * @returns {Promise<Array>} List of available models
   */
  async getAvailableModels() {
    try {
      const response = await fetch(`${this.apiUrl}/api/v1/chat/models`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }

      return {
        success: true,
        models: data.models
      };

    } catch (error) {
      console.error('❌ Get models error:', error);
      return {
        success: false,
        models: [],
        error: 'MODELS_ERROR'
      };
    }
  }

  /**
   * Check chat service health
   * @returns {Promise<Object>} Health status
   */
  async checkHealth() {
    try {
      const response = await fetch(`${this.apiUrl}/api/v1/chat/health`);
      const data = await response.json();

      return {
        success: response.ok,
        status: data.status,
        service: data.service,
        region: data.region
      };

    } catch (error) {
      console.error('❌ Health check error:', error);
      return {
        success: false,
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
    console.log('🗑️ Conversation history cleared');
  }

  /**
   * Get conversation history
   * @returns {Array} Conversation history
   */
  getHistory() {
    return [...this.conversationHistory];
  }

  /**
   * Set conversation history (useful for restoring state)
   * @param {Array} history - Conversation history to restore
   */
  setHistory(history) {
    this.conversationHistory = history || [];
  }

  /**
   * Get last N messages from history
   * @param {number} count - Number of messages to retrieve
   * @returns {Array} Last N messages
   */
  getLastMessages(count = 5) {
    return this.conversationHistory.slice(-count);
  }
}

// Create singleton instance
const bedrockChatService = new BedrockChatService();

export default bedrockChatService;
