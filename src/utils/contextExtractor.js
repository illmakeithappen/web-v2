/**
 * Context Extractor - Smart pattern matching for extracting context from conversations
 *
 * This utility analyzes user messages to extract structured information about:
 * - Problem statements
 * - Goals and objectives
 * - Target audience
 * - Constraints (time, budget, technical)
 * - Requirements
 * - Technology preferences
 * - Difficulty level
 */

// Pattern matching rules
const PATTERNS = {
  // Problem detection
  problem: {
    keywords: /\b(problem|issue|challenge|pain\s*point|struggling|difficulty|need\s+to|trying\s+to|want\s+to\s+solve)\b/i,
    extractors: [
      /(?:problem|issue|challenge)\s+(?:is|with)?\s*:?\s*(.+?)(?:\.|$)/i,
      /(?:need\s+to|trying\s+to|want\s+to)\s+(.+?)(?:\.|$)/i,
      /struggling\s+(?:with|to)\s+(.+?)(?:\.|$)/i
    ]
  },

  // Goal detection
  goals: {
    keywords: /\b(goal|objective|achieve|accomplish|build|create|develop|implement|want\s+to|need\s+to)\b/i,
    extractors: [
      /(?:goal|objective)\s+(?:is|are)?\s*:?\s*(.+?)(?:\.|$)/i,
      /(?:want\s+to|need\s+to)\s+(.+?)(?:\.|$)/i,
      /(?:build|create|develop)\s+(?:a|an)?\s*(.+?)(?:\.|$)/i
    ]
  },

  // Audience detection
  audience: {
    roles: /\b(developers?|engineers?|students?|beginners?|professionals?|users?|customers?|clients?|team|staff)\b/i,
    experience: /\b(beginner|intermediate|advanced|expert|novice|experienced|junior|senior)\b/i,
    extractors: [
      /for\s+(.+?)\s+(?:users?|developers?|students?)/i,
      /target\s+(?:audience|users?)(?:\s+is|\s+are)?\s*:?\s*(.+?)(?:\.|$)/i
    ]
  },

  // Constraint detection
  constraints: {
    time: /\b(deadline|due|weeks?|months?|days?|hours?|urgent|asap|quickly|fast)\b/i,
    budget: /\b(budget|cost|price|expensive|cheap|affordable|free|paid)\b/i,
    technical: /\b(limited|can't\s+use|cannot\s+use|must\s+use|required\s+to\s+use|restricted\s+to)\b/i,
    extractors: [
      /(?:within|in|by)\s+(\d+\s+(?:weeks?|months?|days?))/i,
      /deadline\s+(?:is|of)?\s*:?\s*(.+?)(?:\.|$)/i,
      /budget\s+(?:is|of)?\s*:?\s*(.+?)(?:\.|$)/i
    ]
  },

  // Requirements detection
  requirements: {
    mustHave: /\b(must\s+have|required|essential|critical|need\s+to\s+have|mandatory)\b/i,
    niceToHave: /\b(nice\s+to\s+have|optional|would\s+be\s+nice|if\s+possible|bonus|prefer)\b/i,
    extractors: [
      /(?:must\s+have|required|essential)\s*:?\s*(.+?)(?:\.|$)/i,
      /(?:nice\s+to\s+have|optional)\s*:?\s*(.+?)(?:\.|$)/i
    ]
  },

  // Technology detection
  technology: {
    keywords: /\b(React|Vue|Angular|Node\.?js|Python|Django|Flask|FastAPI|Java|Spring|Docker|Kubernetes|AWS|Azure|GCP|PostgreSQL|MySQL|MongoDB|Redis|GraphQL|REST|API|TypeScript|JavaScript)\b/i,
    frameworks: /\b(framework|library|tool|platform|service|stack)\b/i
  },

  // Difficulty level detection
  difficulty: {
    beginner: /\b(beginner|new\s+to|just\s+started|learning|first\s+time|never\s+used)\b/i,
    intermediate: /\b(intermediate|some\s+experience|familiar|used\s+before|comfortable)\b/i,
    advanced: /\b(advanced|expert|experienced|proficient|master|deep\s+knowledge)\b/i
  }
};

/**
 * Extract problem statement from message
 */
export function extractProblem(message) {
  if (!PATTERNS.problem.keywords.test(message)) return null;

  for (const extractor of PATTERNS.problem.extractors) {
    const match = message.match(extractor);
    if (match && match[1]) {
      return {
        statement: match[1].trim(),
        severity: detectSeverity(message),
        verified: false
      };
    }
  }

  return null;
}

/**
 * Extract goals from message
 */
export function extractGoals(message) {
  if (!PATTERNS.goals.keywords.test(message)) return [];

  const goals = [];

  for (const extractor of PATTERNS.goals.extractors) {
    const match = message.match(extractor);
    if (match && match[1]) {
      goals.push({
        text: match[1].trim(),
        priority: 1,
        verified: false
      });
    }
  }

  return goals;
}

/**
 * Extract target audience from message
 */
export function extractAudience(message) {
  const roleMatch = message.match(PATTERNS.audience.roles);
  const experienceMatch = message.match(PATTERNS.audience.experience);

  if (!roleMatch && !experienceMatch) return null;

  return {
    role: roleMatch ? roleMatch[1] : null,
    experience: experienceMatch ? experienceMatch[1] : null,
    verified: false
  };
}

/**
 * Extract constraints from message
 */
export function extractConstraints(message) {
  const constraints = {
    time: null,
    budget: null,
    technical: []
  };

  // Extract time constraints
  const timeMatch = message.match(PATTERNS.constraints.extractors[0]) ||
                   message.match(PATTERNS.constraints.extractors[1]);
  if (timeMatch && timeMatch[1]) {
    constraints.time = timeMatch[1].trim();
  }

  // Extract budget constraints
  const budgetMatch = message.match(PATTERNS.constraints.extractors[2]);
  if (budgetMatch && budgetMatch[1]) {
    constraints.budget = budgetMatch[1].trim();
  }

  // Extract technical constraints
  if (PATTERNS.constraints.technical.test(message)) {
    const techMatches = message.match(/(?:must\s+use|can't\s+use|limited\s+to)\s+(.+?)(?:\.|$)/gi);
    if (techMatches) {
      constraints.technical = techMatches.map(m => m.trim());
    }
  }

  return constraints;
}

/**
 * Extract requirements from message
 */
export function extractRequirements(message) {
  const requirements = {
    mustHave: [],
    niceToHave: []
  };

  // Split message into sentences
  const sentences = message.split(/[.!?]+/).filter(s => s.trim());

  sentences.forEach(sentence => {
    if (PATTERNS.requirements.mustHave.test(sentence)) {
      const match = sentence.match(PATTERNS.requirements.extractors[0]);
      if (match && match[1]) {
        requirements.mustHave.push(match[1].trim());
      } else {
        requirements.mustHave.push(sentence.trim());
      }
    } else if (PATTERNS.requirements.niceToHave.test(sentence)) {
      const match = sentence.match(PATTERNS.requirements.extractors[1]);
      if (match && match[1]) {
        requirements.niceToHave.push(match[1].trim());
      } else {
        requirements.niceToHave.push(sentence.trim());
      }
    }
  });

  return requirements;
}

/**
 * Extract technology stack from message
 */
export function extractTechStack(message) {
  const technologies = [];
  const techMatch = message.match(PATTERNS.technology.keywords);

  if (techMatch) {
    // Find all technology mentions
    let match;
    const regex = new RegExp(PATTERNS.technology.keywords, 'gi');
    while ((match = regex.exec(message)) !== null) {
      if (!technologies.includes(match[0])) {
        technologies.push(match[0]);
      }
    }
  }

  return technologies;
}

/**
 * Detect difficulty level from message
 */
export function extractDifficulty(message) {
  if (PATTERNS.difficulty.beginner.test(message)) {
    return 'beginner';
  } else if (PATTERNS.difficulty.intermediate.test(message)) {
    return 'intermediate';
  } else if (PATTERNS.difficulty.advanced.test(message)) {
    return 'advanced';
  }
  return null;
}

/**
 * Detect problem severity
 */
function detectSeverity(message) {
  const highSeverity = /\b(critical|urgent|asap|immediately|blocking|emergency)\b/i;
  const mediumSeverity = /\b(important|significant|need|should)\b/i;

  if (highSeverity.test(message)) return 'high';
  if (mediumSeverity.test(message)) return 'medium';
  return 'low';
}

/**
 * Calculate context completeness score (0-100)
 */
export function calculateCompleteness(context) {
  let score = 0;
  let maxScore = 0;

  // Problem (weight: 20)
  maxScore += 20;
  if (context.problem?.statement) score += 20;

  // Goals (weight: 15)
  maxScore += 15;
  if (context.goals?.length > 0) score += 15;

  // Audience (weight: 15)
  maxScore += 15;
  if (context.targetAudience?.role) score += 10;
  if (context.targetAudience?.experience) score += 5;

  // Constraints (weight: 10)
  maxScore += 10;
  if (context.constraints?.time) score += 5;
  if (context.constraints?.technical?.length > 0) score += 5;

  // Requirements (weight: 15)
  maxScore += 15;
  if (context.requirements?.mustHave?.length > 0) score += 15;

  // Tech Stack (weight: 10)
  maxScore += 10;
  if (context.techStack?.length > 0) score += 10;

  // Difficulty (weight: 15)
  maxScore += 15;
  if (context.difficulty) score += 15;

  return Math.round((score / maxScore) * 100);
}

/**
 * Main extraction function - analyzes a message and returns all extracted context
 */
export function extractContext(message) {
  return {
    problem: extractProblem(message),
    goals: extractGoals(message),
    audience: extractAudience(message),
    constraints: extractConstraints(message),
    requirements: extractRequirements(message),
    techStack: extractTechStack(message),
    difficulty: extractDifficulty(message)
  };
}

/**
 * Merge extracted context with existing context
 */
export function mergeContext(existing, extracted) {
  return {
    problem: extracted.problem || existing.problem,
    goals: [...(existing.goals || []), ...(extracted.goals || [])],
    targetAudience: {
      ...existing.targetAudience,
      ...(extracted.audience || {})
    },
    constraints: {
      time: extracted.constraints?.time || existing.constraints?.time,
      budget: extracted.constraints?.budget || existing.constraints?.budget,
      technical: [
        ...(existing.constraints?.technical || []),
        ...(extracted.constraints?.technical || [])
      ]
    },
    requirements: {
      mustHave: [
        ...(existing.requirements?.mustHave || []),
        ...(extracted.requirements?.mustHave || [])
      ],
      niceToHave: [
        ...(existing.requirements?.niceToHave || []),
        ...(extracted.requirements?.niceToHave || [])
      ]
    },
    techStack: [
      ...(existing.techStack || []),
      ...(extracted.techStack || [])
    ],
    difficulty: extracted.difficulty || existing.difficulty
  };
}
