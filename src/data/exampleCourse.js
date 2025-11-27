// Pre-built example course: "Build a Daily Briefing AI Assistant"
// Demonstrates L1 → L2 → L3 progression

export const exampleCourse = {
  id: 'daily-briefing-assistant',
  title: 'Build a Daily Briefing AI Assistant',
  description: 'Learn to build an AI assistant that delivers personalized daily news briefings through progressive skill development',
  level: 'beginner-to-intermediate',
  duration: '3-4 weeks',
  targetAudience: 'Anyone interested in learning prompt engineering and AI workflows',

  overview: {
    whatYouWillBuild: 'A personalized AI assistant that fetches news, summarizes content, formats briefings, and learns your preferences over time',
    skillProgression: [
      'Level 1: Master prompt engineering basics',
      'Level 2: Design and implement multi-step workflows',
      'Level 3: Build agentic behavior with autonomous decision-making'
    ],
    technologies: [
      'Claude or GPT (foundational models)',
      'API integration (news sources)',
      'Basic Python or JavaScript',
      'Optional: Vector database for preference learning'
    ]
  },

  modules: [
    {
      id: 'module-1',
      level: 1,
      levelName: 'Prompt Engineering Basics',
      title: 'Understanding Context and Instructions',
      duration: '1 week',
      description: 'Learn how to craft effective prompts that give AI models the right context to produce useful outputs',

      learningObjectives: [
        'Understand how foundational models process prompts',
        'Learn to set clear context and constraints',
        'Master output formatting techniques',
        'Practice iterative prompt refinement'
      ],

      steps: [
        {
          stepNumber: 1,
          title: 'Your First News Summary Prompt',
          contextNeeded: [
            'A sample news article (any recent news)',
            'Understanding that AI needs clear instructions'
          ],
          task: 'Write a prompt that asks Claude to summarize a news article in 3 bullet points',
          example: `Prompt: "Please summarize the following news article in exactly 3 bullet points, focusing on the key facts:

[Article text here]"`,
          expectedOutput: 'A concise 3-bullet summary',
          whatYouLearn: 'Clear instructions produce better results than vague requests',
          tryItPrompt: 'Summarize this article in 3 bullet points:\n\nAI and lifelong learning have become inextricably intertwined. For the first time in history, you can learn anything, anytime, interactively. AI can gather information, aggregate it, manipulate it, and present it in exactly the way you need.'
        },
        {
          stepNumber: 2,
          title: 'Adding Context: Your Interests',
          contextNeeded: [
            'Your completed prompt from Step 1',
            'A list of your interests (e.g., "technology, education, space exploration")'
          ],
          task: 'Enhance your prompt to include context about what topics you care about',
          example: `Prompt: "You are a news assistant helping someone interested in technology, education, and space exploration.

Summarize the following article in 3 bullet points, emphasizing aspects relevant to these interests:

[Article text]"`,
          expectedOutput: 'A summary that highlights relevant angles',
          whatYouLearn: 'Context shapes how AI interprets and responds to requests',
          tryItPrompt: 'You are a news assistant for someone interested in AI, education, and lifelong learning.\n\nSummarize this article in 3 bullet points, emphasizing aspects relevant to these interests:\n\n[Previous article about AI and learning]'
        },
        {
          stepNumber: 3,
          title: 'Formatting Your Daily Briefing',
          contextNeeded: [
            'Your enhanced prompt from Step 2',
            'Example of your preferred format (email, markdown, etc.)'
          ],
          task: 'Specify exact output formatting for your daily briefing',
          example: `Prompt: "You are creating a morning briefing for someone interested in technology and education.

Format your response as:

# Morning Briefing - [Date]

## Top Stories

1. **[Headline]**
   - Summary in 1-2 sentences
   - Why it matters to you

[Repeat for 3 stories]

## Worth Noting
- Brief mention of other relevant news

Tone: Professional but conversational"`,
          expectedOutput: 'Consistently formatted briefing ready to read',
          whatYouLearn: 'Detailed formatting instructions ensure consistent, usable outputs',
          tryItPrompt: 'Create a morning briefing with this format:\n\n# Morning Briefing\n## Top Stories\n1. **[Headline]** - Summary - Why it matters\n\nProvide 3 technology/education stories in this format.'
        },
        {
          stepNumber: 4,
          title: 'Iterative Refinement',
          contextNeeded: [
            'Outputs from your previous prompts',
            'Notes on what worked and what didn\'t'
          ],
          task: 'Refine your prompt based on actual results to improve quality',
          example: 'Add constraints like "Avoid marketing language", "Focus on factual developments", "Limit each summary to 50 words"',
          expectedOutput: 'A refined prompt that produces higher-quality briefings',
          whatYouLearn: 'Prompt engineering is iterative - you improve based on results',
          tryItPrompt: 'Refine this prompt to avoid marketing language and limit summaries to 50 words:\n\n[Your previous briefing prompt]'
        }
      ],

      practiceExercises: [
        'Write prompts for different types of content (technical articles, opinion pieces, research papers)',
        'Experiment with different tones (professional, casual, humorous)',
        'Create prompts for different audiences (experts vs. beginners)'
      ],

      keyTakeaway: 'Effective prompts are clear, contextual, specific about format, and iteratively refined. This is the foundation of working with AI.'
    },

    {
      id: 'module-2',
      level: 2,
      levelName: 'Multi-Step Workflows',
      title: 'Chaining Prompts and Integrating Tools',
      duration: '1-2 weeks',
      description: 'Move beyond single prompts to design workflows that combine multiple AI operations and external tools',

      learningObjectives: [
        'Understand workflow design principles',
        'Learn to chain prompts effectively',
        'Integrate external data sources',
        'Manage data flow between steps'
      ],

      steps: [
        {
          stepNumber: 1,
          title: 'Designing Your Briefing Workflow',
          contextNeeded: [
            'Your refined prompt from Module 1',
            'Understanding of workflow stages'
          ],
          task: 'Map out the complete workflow for an automated daily briefing',
          example: `Workflow Design:
1. Fetch → Get latest news from API
2. Filter → Select articles matching interests
3. Summarize → Create summaries for each article
4. Aggregate → Combine into briefing format
5. Deliver → Send via email/save to file`,
          expectedOutput: 'A clear workflow diagram showing data flow',
          whatYouLearn: 'Complex tasks break down into sequential, manageable steps',
          visualizationNote: 'In the full platform, this would be a React Flow diagram'
        },
        {
          stepNumber: 2,
          title: 'Step 1: Fetching News',
          contextNeeded: [
            'News API credentials (NewsAPI.org or similar)',
            'Your interest topics list',
            'Basic API usage knowledge'
          ],
          task: 'Write code to fetch news articles from an API based on your interests',
          example: `// Using NewsAPI example
const interests = ['AI', 'education', 'technology'];
const articles = await fetchNews(interests, 'en', 'today');
// Returns array of articles with title, description, content`,
          expectedOutput: 'JSON array of relevant news articles',
          whatYouLearn: 'AI workflows start with data - learn where to get it and how to structure it',
          codeExample: true
        },
        {
          stepNumber: 3,
          title: 'Step 2: Filtering with AI',
          contextNeeded: [
            'Articles fetched from Step 2',
            'Your interest profile',
            'Understanding of prompt chaining'
          ],
          task: 'Create a prompt that filters articles by relevance to your interests',
          example: `Prompt: "You are a content filter for someone interested in [interests].

For each article below, rate its relevance on a scale of 1-10 and briefly explain why.

Return JSON format:
{
  "articles": [
    {"title": "...", "relevanceScore": 8, "reason": "..."}
  ]
}

Articles:
[Article list]"`,
          expectedOutput: 'Scored and ranked articles',
          whatYouLearn: 'AI can make intelligent filtering decisions when given clear criteria',
          tryItPrompt: 'Filter these articles by relevance to AI and education (1-10 scale):\n\n1. "New AI Model Breaks Records"\n2. "Stock Market Update"\n3. "Online Learning Platform Launches"\n\nReturn JSON with scores.'
        },
        {
          stepNumber: 4,
          title: 'Step 3: Batch Summarization',
          contextNeeded: [
            'Top-ranked articles from Step 3',
            'Your summary prompt from Module 1',
            'Understanding of batch processing'
          ],
          task: 'Process multiple articles through your summarization prompt',
          example: `for (const article of topArticles) {
  const summary = await summarize(article, contextPrompt);
  briefingItems.push(summary);
}`,
          expectedOutput: 'Array of formatted summaries',
          whatYouLearn: 'Scale single prompts to handle multiple items systematically',
          codeExample: true
        },
        {
          stepNumber: 5,
          title: 'Step 4: Aggregating the Briefing',
          contextNeeded: [
            'All summaries from Step 4',
            'Your briefing format from Module 1',
            'Current date/time'
          ],
          task: 'Combine summaries into final briefing format',
          example: `Prompt: "Create a morning briefing using these summaries:

[Summaries array]

Format as specified earlier, add date [today's date], organize by importance."`,
          expectedOutput: 'Complete, formatted daily briefing',
          whatYouLearn: 'Final aggregation step ensures consistent, polished output',
          tryItPrompt: 'Combine these 3 summaries into a morning briefing:\n\n1. AI model improves learning outcomes by 40%\n2. New education platform reaches 1M users\n3. Research shows AI assists student comprehension\n\nFormat with date and importance ranking.'
        },
        {
          stepNumber: 6,
          title: 'Automation & Scheduling',
          contextNeeded: [
            'Complete workflow code',
            'Understanding of cron jobs or task schedulers',
            'Email/messaging service credentials'
          ],
          task: 'Set up automated daily execution of your workflow',
          example: `// Using cron or GitHub Actions
schedule: '0 7 * * *' // Run at 7 AM daily
tasks:
  - fetch_news()
  - filter_articles()
  - summarize()
  - deliver_briefing()`,
          expectedOutput: 'Automated daily briefing delivered without manual intervention',
          whatYouLearn: 'Workflows become powerful when automated - remove yourself from the loop',
          codeExample: true
        }
      ],

      practiceExercises: [
        'Add error handling for API failures',
        'Create fallback content sources',
        'Implement caching to reduce API calls',
        'Add user feedback loop to improve filtering'
      ],

      keyTakeaway: 'Multi-step workflows combine AI with external tools to create automated, intelligent systems. Each step feeds the next, creating compound value.'
    },

    {
      id: 'module-3',
      level: 3,
      levelName: 'Agentic Behavior',
      title: 'Building Autonomous Decision-Making',
      duration: '1-2 weeks',
      description: 'Transform your workflow into an intelligent agent that learns, adapts, and makes decisions autonomously',

      learningObjectives: [
        'Understand agentic AI principles',
        'Implement preference learning',
        'Build decision-making capabilities',
        'Create feedback loops for improvement'
      ],

      steps: [
        {
          stepNumber: 1,
          title: 'From Scripted to Intelligent',
          contextNeeded: [
            'Your complete workflow from Module 2',
            'Understanding of the difference between scripted and agentic behavior'
          ],
          task: 'Identify decision points where the agent should think, not just execute',
          example: `Decision Points:
- Should I include this article? (Currently: hard-coded relevance threshold)
- What order should stories appear? (Currently: API order)
- How detailed should each summary be? (Currently: fixed format)
- Is this news important enough to notify immediately? (Currently: no decision)

Agentic Version:
- Agent evaluates relevance against learned preferences
- Agent prioritizes based on historical engagement
- Agent adjusts detail based on article complexity and user behavior
- Agent decides urgency based on topic importance to user`,
          expectedOutput: 'List of decision points to enhance with intelligence',
          whatYouLearn: 'Agents make contextual decisions rather than following fixed rules'
        },
        {
          stepNumber: 2,
          title: 'Implementing Preference Learning',
          contextNeeded: [
            'History of past briefings delivered',
            'User interaction data (what they read, skipped, etc.)',
            'Understanding of vector databases (optional but recommended)'
          ],
          task: 'Create a system where the agent learns what content you value',
          example: `User Feedback Collection:
- Track which articles are clicked/read
- Note which topics are consistently engaged with
- Record time spent on different content types
- Capture explicit feedback ("more like this" / "less like this")

Learning Implementation:
const userProfile = {
  preferredTopics: calculateTopicWeights(history),
  readingDepth: analyzeEngagementPatterns(clicks),
  timePreferences: determineOptimalDeliveryTime(opens),
  formatPreferences: identifyPreferredFormats(interactions)
};

Agent uses this profile to make better decisions`,
          expectedOutput: 'A learning system that adapts to your behavior over time',
          whatYouLearn: 'Agents improve through observation and feedback, not just programming',
          codeExample: true
        },
        {
          stepNumber: 3,
          title: 'Autonomous Relevance Decisions',
          contextNeeded: [
            'User profile from Step 2',
            'Current article set',
            'Historical relevance accuracy'
          ],
          task: 'Let the agent decide what to include based on learned preferences',
          example: `Prompt (to AI agent): "You are a news curator who has learned this user's preferences:

[User profile JSON from Step 2]

Evaluate these articles and decide which ones to include in today's briefing. Consider:
1. Alignment with preferred topics
2. Quality and credibility of source
3. Uniqueness (not repetitive of recent briefings)
4. Timeliness and relevance today

For each article, make a decision: INCLUDE or SKIP, with reasoning.

Articles:
[Article list]"`,
          expectedOutput: 'Autonomous, reasoned decisions about content inclusion',
          whatYouLearn: 'Agents make nuanced decisions when given context about goals and constraints',
          tryItPrompt: 'You are a news curator. User prefers AI, education, practical applications. Decide INCLUDE/SKIP for:\n\n1. "Theoretical Physics Breakthrough"\n2. "AI Improves Online Learning Outcomes"\n3. "Celebrity News Update"\n\nProvide reasoning for each decision.'
        },
        {
          stepNumber: 4,
          title: 'Dynamic Content Adaptation',
          contextNeeded: [
            'User engagement patterns',
            'Different summary lengths/formats tried',
            'Reading completion rates'
          ],
          task: 'Enable the agent to adjust content depth and format based on what works',
          example: `Agent Decision Logic:
IF user typically reads <50% of long summaries:
  → Generate shorter, punchier summaries

IF user engagement higher with specific examples:
  → Include more concrete examples in summaries

IF user checks briefing during commute (7-8am):
  → Optimize for mobile reading, bullet points

IF user opens email but doesn't read (often):
  → Make subject lines more compelling
  → Lead with most relevant story

The agent decides these adaptations, not you.`,
          expectedOutput: 'A briefing that evolves in format and style based on what works',
          whatYouLearn: 'Agents optimize for outcomes, experimenting and adapting without manual tuning'
        },
        {
          stepNumber: 5,
          title: 'Proactive Intelligence',
          contextNeeded: [
            'Deep understanding of user interests',
            'Historical context of what user knows',
            'Capability to monitor multiple sources continuously'
          ],
          task: 'Enable the agent to proactively notify you about important developments',
          example: `Agentic Behavior: "Breaking News Detection"

The agent monitors news continuously (not just daily).

When it detects an article about:
- A topic you've shown strong interest in
- A development that contradicts or updates previous information
- Time-sensitive information requiring quick action

It makes an autonomous decision:
"This is important enough to interrupt the user NOW"

And sends an immediate notification, rather than waiting for the morning briefing.

This requires the agent to:
1. Understand importance (learned from past reactions)
2. Assess urgency (time-sensitivity)
3. Decide if interruption is justified (respect user's attention)
4. Format appropriately for immediate delivery`,
          expectedOutput: 'An agent that knows when to act immediately vs. wait for scheduled briefing',
          whatYouLearn: 'True agents make autonomous decisions about when and how to act'
        },
        {
          stepNumber: 6,
          title: 'Reflection and Self-Improvement',
          contextNeeded: [
            'Agent\'s past decisions and outcomes',
            'User feedback over time',
            'Performance metrics'
          ],
          task: 'Implement a reflection loop where the agent evaluates its own performance',
          example: `Weekly Reflection Prompt (Agent talks to itself):

"Review this week's briefings and user interactions:

Decisions Made:
- Included X articles on Y topic
- Sent Z proactive notifications
- Adjusted format A times

Outcomes:
- User engagement: [metrics]
- Positive feedback: [examples]
- Ignored content: [patterns]

Questions to consider:
1. Did I correctly predict what the user would find valuable?
2. Were my proactive notifications appreciated or annoying?
3. What patterns in engagement suggest preference shifts?
4. How can I improve relevance next week?

Generate: A self-assessment and 3 specific improvements to try."`,
          expectedOutput: 'The agent identifies its own improvements without human intervention',
          whatYouLearn: 'The most powerful agents reflect on performance and adapt their strategies',
          tryItPrompt: 'Reflect on this week\'s performance:\n\nSent 7 briefings, avg 3 articles each.\nUser read 60% of AI articles, 20% of general tech.\nSkipped 2 briefings entirely.\n\nWhat should you improve?'
        }
      ],

      practiceExercises: [
        'Add multi-modal inputs (user can give voice feedback)',
        'Implement collaborative filtering (learn from similar users)',
        'Create explanation capabilities (agent explains its decisions)',
        'Build guardrails (ensure agent doesn\'t make harmful decisions)'
      ],

      keyTakeaway: 'Agentic systems learn, decide, and improve autonomously. They move from "doing what you tell them" to "understanding what you need and figuring out how to deliver it." This is the frontier of AI application.'
    }
  ],

  finalProject: {
    title: 'Deploy Your Personal Briefing Agent',
    description: 'Take everything you\'ve learned and deploy a production-ready daily briefing agent',
    requirements: [
      'Complete automated workflow (Level 2)',
      'Preference learning system (Level 3)',
      'Autonomous decision-making (Level 3)',
      'Running on a schedule (daily execution)',
      'Delivered to your preferred platform (email, Slack, etc.)',
      'Documented code and architecture'
    ],
    successCriteria: [
      'Agent runs daily without manual intervention',
      'Briefing quality improves over 2 weeks of use',
      'Agent makes at least 3 autonomous decisions per briefing',
      'You can explain how each component works',
      'System handles errors gracefully'
    ],
    nextSteps: [
      'Extend to other content types (podcasts, videos, research papers)',
      'Build a multi-agent system (research agent + writer agent + editor agent)',
      'Create a conversational interface (chat with your agent about the news)',
      'Implement team briefings (agent learns preferences of a group)',
      'Build a marketplace (share your agent template with others)'
    ]
  },

  resources: {
    apis: [
      'NewsAPI.org - Free news aggregation',
      'Claude API - For AI processing',
      'OpenAI API - Alternative AI provider',
      'Pinecone/Chroma - Vector databases for preference learning'
    ],
    tools: [
      'Claude Code - For building the system',
      'GitHub Actions - For scheduling',
      'Python/Node.js - Implementation languages',
      'Postman - API testing'
    ],
    learningResources: [
      'Anthropic Prompt Engineering Guide',
      'LangChain Documentation - Workflow frameworks',
      'Vector Database Tutorials - For preference learning',
      'Agentic AI Research Papers - Understand the theory'
    ]
  },

  whatYouLearnedOverall: {
    technicalSkills: [
      'Prompt engineering at professional level',
      'Workflow design and implementation',
      'API integration and data management',
      'Autonomous agent architecture',
      'Preference learning systems',
      'Production deployment practices'
    ],
    conceptualUnderstanding: [
      'How foundational models process information',
      'The difference between scripted automation and agentic behavior',
      'Context engineering principles',
      'Decision-making in AI systems',
      'Feedback loops and learning mechanisms',
      'The progressive nature of AI skill development'
    ],
    careerRelevance: [
      'These skills apply to ANY AI project, not just news briefings',
      'Understanding of foundational models transfers as technology evolves',
      'Workflow thinking is valuable across all AI applications',
      'Agentic design is the frontier of AI development',
      'You can now design, build, and deploy AI systems independently'
    ]
  }
};

export default exampleCourse;
