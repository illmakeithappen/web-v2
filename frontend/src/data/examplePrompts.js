// Curated example prompts for the interactive PromptTester
// Organized by skill level to demonstrate progression

export const examplePrompts = {
  level1: {
    category: 'Prompt Engineering Basics',
    description: 'Learn to write clear, effective prompts with proper context',
    prompts: [
      {
        id: 'l1-basic',
        title: 'Basic Summary Request',
        difficulty: 'Beginner',
        prompt: `Summarize the following article in 3 bullet points:

AI and lifelong learning have become inextricably intertwined. For the first time in history, you can learn anything, anytime, interactively. AI can gather information, aggregate it, manipulate it, and present it in exactly the way you need. It enables you to constantly learn about your environment, your interests, and your own evolving capabilities.

But here's the beautiful paradox: You don't know what you don't know. Most people approach AI with specific questions. But the real power emerges when you use AI to help you discover what questions to ask in the first place.`,
        whatYouLearn: 'Clear, specific instructions produce better results than vague requests',
        expectedOutcome: 'Three concise bullet points summarizing key ideas',
        tip: 'Notice how specifying "3 bullet points" gives you exactly what you asked for'
      },
      {
        id: 'l1-context',
        title: 'Adding Personal Context',
        difficulty: 'Beginner',
        prompt: `You are a news assistant helping someone interested in AI, education, and practical applications.

Summarize this article in 3 bullet points, emphasizing aspects most relevant to these interests:

Researchers at Stanford have developed a new approach to online learning that uses AI to adapt course content in real-time. The system monitors student engagement, identifies areas of confusion, and automatically generates supplementary materials. Early trials show 40% improvement in course completion rates and 35% better test scores. The technology is being made open-source to enable wider adoption in educational institutions.`,
        whatYouLearn: 'Context shapes how AI interprets and responds - same content, different angle based on audience',
        expectedOutcome: 'Summary that highlights AI + education + practical benefits',
        tip: 'Compare this response to a basic summary without context - notice the difference in focus'
      },
      {
        id: 'l1-formatting',
        title: 'Structured Output Format',
        difficulty: 'Beginner',
        prompt: `Create a morning briefing using this format:

# Morning Briefing - Today's Date

## Top Story
**Headline**: [Compelling headline]
**Summary**: [2-3 sentence summary]
**Why It Matters**: [Personal relevance]

## Also Important
- Brief mention 1
- Brief mention 2

Content to brief:
- GitHub announces AI-powered code review tool that finds bugs developers miss
- Study shows developers using AI assistants code 55% faster
- New open-source AI model rivals proprietary alternatives
- Tech unemployment remains at historic lows despite AI adoption

Tone: Professional but conversational`,
        whatYouLearn: 'Detailed formatting instructions ensure consistent, production-ready outputs',
        expectedOutcome: 'Perfectly formatted briefing following your exact specification',
        tip: 'AI excels at following structured formats - use this for emails, reports, documentation'
      },
      {
        id: 'l1-constraints',
        title: 'Adding Smart Constraints',
        difficulty: 'Intermediate',
        prompt: `Summarize the following product announcement in 50 words or less.

Constraints:
- Avoid marketing language and hype
- Focus only on factual capabilities
- Mention limitations if notable
- Target audience: technical developers

Announcement:
"Introducing AwesomeAI Pro Max - the REVOLUTIONARY platform that will TRANSFORM your workflow! Our CUTTING-EDGE technology delivers UNPARALLELED performance. Join THOUSANDS of satisfied users experiencing the FUTURE of AI! Limited-time offer with INCREDIBLE savings!"`,
        whatYouLearn: 'Constraints filter out noise and ensure quality - critical for processing marketing content',
        expectedOutcome: 'Factual summary without hype, focused on substance',
        tip: 'Notice how constraints completely change the tone and focus of the output'
      }
    ]
  },

  level2: {
    category: 'Multi-Step Workflows',
    description: 'Chain prompts together and integrate external data',
    prompts: [
      {
        id: 'l2-filtering',
        title: 'Content Filtering with Scoring',
        difficulty: 'Intermediate',
        prompt: `You are a content filter for someone interested in: AI, education, practical applications, and open-source technology.

Evaluate these articles and rate each on a scale of 1-10 for relevance. Return JSON format.

Articles:
1. "Celebrity couple announces divorce"
2. "Open-source AI model achieves GPT-4 level performance"
3. "Stock market hits new high"
4. "New online learning platform uses AI to personalize education"
5. "Local sports team wins championship"
6. "GitHub releases AI coding assistant for free"

Return format:
{
  "articles": [
    {"title": "...", "relevanceScore": X, "reasoning": "..."}
  ]
}`,
        whatYouLearn: 'AI can make intelligent filtering decisions - first step in workflow chains',
        expectedOutcome: 'Scored list with high scores for articles 2, 4, and 6',
        tip: 'This output becomes input for the next step - only process highly-scored items'
      },
      {
        id: 'l2-batch',
        title: 'Batch Processing Multiple Items',
        difficulty: 'Intermediate',
        prompt: `Process each of these articles through the same summarization workflow.

For EACH article, provide:
1. One-sentence summary
2. Primary category (Tech/Education/Business/Other)
3. Key insight

Articles:
A) "AI assistants now help doctors diagnose rare diseases with 95% accuracy"
B) "Remote work adoption continues to grow, 40% of workforce now hybrid"
C) "New programming language designed for AI development gains traction"

Format as numbered list, one section per article.`,
        whatYouLearn: 'Scaling single operations across multiple items - foundation of automation',
        expectedOutcome: 'Three separate summaries in consistent format',
        tip: 'In production, this runs programmatically in a loop - AI processes each item identically'
      },
      {
        id: 'l2-aggregation',
        title: 'Aggregating Results into Report',
        difficulty: 'Intermediate',
        prompt: `You have processed 5 articles about AI in education. Here are the individual summaries:

1. "AI tutoring system improves math scores by 30% in pilot program"
2. "Teachers report AI tools save 5 hours per week on grading"
3. "Study finds students learn better with AI-personalized content"
4. "University implements AI writing assistant, plagiarism concerns arise"
5. "EdTech funding reaches $20B, AI companies dominate"

Create a meta-analysis briefing:

# AI in Education - Weekly Summary

## Key Trend
[Identify the overarching theme]

## Major Developments
[Synthesize the 3 most important points]

## Concerns to Watch
[Note any issues or controversies]

## Bottom Line
[Your assessment in 2-3 sentences]`,
        whatYouLearn: 'Final aggregation creates insight from multiple processed items - the power of workflows',
        expectedOutcome: 'Synthesized analysis showing patterns across individual summaries',
        tip: 'This is where workflows create compound value - analysis impossible from single items'
      }
    ]
  },

  level3: {
    category: 'Agentic Behavior',
    description: 'Enable autonomous decision-making and learning',
    prompts: [
      {
        id: 'l3-decision',
        title: 'Autonomous Decision Making',
        difficulty: 'Advanced',
        prompt: `You are a news curator agent with this user profile:

Preferences (learned):
- Highly engaged with: AI breakthroughs, practical applications, open-source projects
- Moderately engaged with: Tech industry news, education technology
- Rarely engaged with: Celebrity news, sports, general business news
- Preferred format: Brief bullet points, 2-3 per article max
- Reading time: Typically 7:30 AM, weekdays only

Historical data:
- Clicked 85% of articles about open-source AI
- Skipped 90% of articles over 300 words
- Engaged more with concrete examples than theory
- Rarely opens weekend briefings

Today is Monday, 7:00 AM. Decide autonomously:

1. Should you include this article: "Meta releases open-source LLM to compete with GPT-4" (450 words, heavy on technical details)

2. Should you include this article: "AI helps farmers predict crop yields" (200 words, practical case study with results)

3. Should you send an immediate notification about: "Breaking: OpenAI releases ChatGPT-5 with major capabilities"

For each decision: INCLUDE/SKIP/NOTIFY_NOW with detailed reasoning based on learned preferences.`,
        whatYouLearn: 'Agents make contextual decisions using learned preferences, not just rules',
        expectedOutcome: 'Reasoned decisions showing understanding of user patterns and priorities',
        tip: 'Notice how the agent weighs multiple factors - topic relevance, format preference, timing, and historical behavior'
      },
      {
        id: 'l3-adaptation',
        title: 'Dynamic Content Adaptation',
        difficulty: 'Advanced',
        prompt: `You are a briefing agent analyzing user engagement patterns:

Last 10 briefings data:
- Briefings with 5+ articles: 30% read completion
- Briefings with 3 articles: 75% read completion
- Short summaries (2-3 sentences): 80% read rate
- Long summaries (5+ sentences): 40% read rate
- Articles with practical examples: 90% engagement
- Theoretical/conceptual articles: 45% engagement
- Morning delivery (7 AM): 70% open rate
- Evening delivery (6 PM): 25% open rate

Current task: Create today's briefing with 6 available articles.

Based on the engagement data, decide:
1. How many articles should you include?
2. What length should summaries be?
3. Should you emphasize practical examples?
4. What delivery time would you choose?

Explain your reasoning and show how you're optimizing for user engagement.`,
        whatYouLearn: 'Agents optimize based on outcomes, adapting strategy from performance data',
        expectedOutcome: 'Data-driven decisions about format and delivery based on what actually works',
        tip: 'This is how agents improve without reprogramming - they learn what works from results'
      },
      {
        id: 'l3-reflection',
        title: 'Agent Self-Assessment',
        difficulty: 'Advanced',
        prompt: `You are a news briefing agent reflecting on your performance this week.

Your decisions and outcomes:
- Sent 5 briefings with avg 3.4 articles each
- User read 65% of AI-related articles (down from 75% last week)
- User read 90% of articles with "practical" in summary (up from 70%)
- Sent 2 "breaking news" notifications: user engaged with 1, ignored 1
- Included 3 articles about AI theory: user skipped all 3
- Your relevance filtering: 80% precision (user engaged with 4 of 5 top-scored articles)

Self-assessment questions:
1. What patterns suggest your filtering needs adjustment?
2. Was the breaking news notification strategy effective? How should you change it?
3. What content type should you prioritize more/less?
4. What's one specific improvement to test next week?
5. What are you doing well that you should maintain?

Provide honest self-assessment and concrete action items for improvement.`,
        whatYouLearn: 'The most powerful agents reflect on their own performance and identify improvements autonomously',
        expectedOutcome: 'Critical self-analysis leading to specific, testable improvements',
        tip: 'This represents the frontier of AI - systems that evaluate and improve themselves based on outcomes'
      },
      {
        id: 'l3-proactive',
        title: 'Proactive Intelligence',
        difficulty: 'Advanced',
        prompt: `You are an agent monitoring news continuously. You encounter this article at 2:30 PM:

"Breaking: Major security vulnerability discovered in popular AI framework used in production systems. Affects 60% of deployed AI applications. Patch available but requires immediate action to prevent data exposure."

User context:
- Works as AI engineer
- Has deployed systems using this exact framework
- Typically checks briefing at 7 AM only
- Has indicated preference for "important updates ASAP"
- Previously appreciated immediate security alerts

Decision required:
Should you interrupt the user NOW with a notification, or wait for tomorrow's 7 AM briefing?

Provide your decision (NOTIFY_NOW or WAIT) with reasoning that considers:
- Urgency and impact
- User's role and vulnerability
- User's stated preferences vs. respecting attention
- Time sensitivity of action needed
- Past feedback on interruptions

This is autonomous judgment - there's no "right" answer, only reasoned decision-making.`,
        whatYouLearn: 'True agents know when to act immediately vs. wait - understanding urgency and context',
        expectedOutcome: 'Well-reasoned decision balancing urgency, relevance, and respect for attention',
        tip: 'This is the essence of agentic behavior - making nuanced judgment calls humans would make'
      }
    ]
  },

  // Quick try-it prompts for immediate experimentation
  quickStart: [
    {
      id: 'qs-1',
      title: 'Try Your First Prompt',
      prompt: 'Explain what prompt engineering is in exactly 3 sentences.',
      category: 'basics'
    },
    {
      id: 'qs-2',
      title: 'Add Context',
      prompt: 'You are explaining to a non-technical person. What is AI and why does it matter? Use simple analogies.',
      category: 'basics'
    },
    {
      id: 'qs-3',
      title: 'Format Output',
      prompt: `List 3 benefits of learning AI in this format:

Benefit: [name]
Why: [explanation]
Example: [concrete example]`,
      category: 'basics'
    },
    {
      id: 'qs-4',
      title: 'Make a Decision',
      prompt: 'You are helping someone choose whether to learn Python or JavaScript for AI development. They are a complete beginner interested in building web-based AI applications. Provide a recommendation with reasoning.',
      category: 'intermediate'
    }
  ]
};

// Helper function to get all prompts for a level
export const getPromptsForLevel = (level) => {
  switch (level) {
    case 1:
      return examplePrompts.level1;
    case 2:
      return examplePrompts.level2;
    case 3:
      return examplePrompts.level3;
    default:
      return examplePrompts.quickStart;
  }
};

// Helper function to get a random prompt from a category
export const getRandomPrompt = (level) => {
  const levelData = getPromptsForLevel(level);
  const prompts = levelData.prompts || levelData;
  return prompts[Math.floor(Math.random() * prompts.length)];
};

export default examplePrompts;
