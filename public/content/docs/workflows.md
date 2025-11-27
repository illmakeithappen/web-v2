# Workflows

**Workflows are step-by-step guides for humans and AI to execute together.**

Unlike automation platforms (Zapier, Make, n8n), gitthub workflows don't run automatically. They're designed for collaboration - guiding you through decisions, adapting to your context, and keeping you in control while leveraging AI capabilities.

## Why Workflows?

The challenge with AI isn't capability - it's consistency. Without structure, you explain the same processes repeatedly, get variable results, and lose track of what worked. Workflows solve this by:

- **Capturing expertise** - Document successful processes once, reuse forever
- **Enabling iteration** - Improve workflows based on outcomes
- **Bridging tools** - Coordinate across different AI tools and services
- **Teaching through doing** - Learn while executing

## The Three Archetypes

Every workflow on gitthub falls into one of three categories. Understanding these helps you find the right workflow for your situation.

---

### Navigate

**Purpose**: Explore possibilities and compare approaches before committing.

Navigate workflows guide you through decision-making. Rather than jumping straight to implementation, they help you understand your options, evaluate trade-offs, and choose the best path forward.

**When to use Navigate:**
- You're unsure which technology, tool, or approach to use
- The decision has significant consequences (architecture, vendor selection)
- You want to understand the landscape before building

**Structure:**
1. Define requirements and constraints
2. Present options with pros/cons
3. Guide evaluation criteria
4. Recommend based on context
5. Document the decision rationale

**Example workflows:**
- Choose a database for your application
- Evaluate hosting platforms
- Compare authentication strategies

---

### Educate

**Purpose**: Learn how something works through hands-on execution.

Educate workflows teach you by doing. They break down complex topics into steps you can execute, explaining the "why" along the way. By the end, you've built something real and understand how it works.

**When to use Educate:**
- You want to understand a tool, concept, or technique
- You learn better by doing than reading
- You need to train team members on a process

**Structure:**
1. Explain the concept (brief)
2. Set up the environment
3. Execute steps with explanations
4. Highlight key insights
5. Suggest next steps for deeper learning

**Example workflows:**
- Understand how Git branching works
- Learn Supabase row-level security
- Master Claude skills for code formatting

---

### Deploy

**Purpose**: Build and ship something specific with clear, actionable steps.

Deploy workflows are your "how to" guides. They're optimized for execution - minimal explanation, maximum action. Each step is concrete and verifiable. You follow along and end up with something working.

**When to use Deploy:**
- You know what you want to build
- You need a reliable, repeatable process
- Time matters more than deep understanding

**Structure:**
1. Prerequisites and setup
2. Sequential steps (with checkpoints)
3. Verification at each stage
4. Troubleshooting common issues
5. Post-deployment checklist

**Example workflows:**
- Deploy a React app to Vercel
- Set up GitHub Actions CI/CD
- Configure Supabase with authentication

---

## Workflow Anatomy

Every gitthub workflow has the same structure:

```yaml
---
name: Workflow Title
type: navigate | educate | deploy
difficulty: beginner | intermediate | advanced
duration: estimated time
tools: [list of required tools]
prerequisites: [what you need before starting]
outcomes: [what you'll achieve]
---

# Title

Introduction explaining context and goals.

## Step 1: First Action

Instructions with:
- What to do
- Why you're doing it
- What to expect

> [!tip] Optional tips and context

## Step 2: Next Action

...continuing through all steps...

## Wrap-up

Summary of what was accomplished.
Next steps or related workflows.
```

## Creating Your Own Workflows

The best workflows come from real experience. When you successfully complete a complex task with AI, turn it into a workflow:

1. **Document while doing** - Take notes as you work
2. **Identify the structure** - Is it Navigate, Educate, or Deploy?
3. **Write for your future self** - Assume you've forgotten the context
4. **Test it** - Run through the workflow fresh
5. **Iterate** - Improve based on what doesn't work

---

## Resources in This Section

Browse the workflow entries below to find:
- **Navigate workflows** - Decision guides for tools and approaches
- **Educate workflows** - Learning paths and tutorials
- **Deploy workflows** - Step-by-step build guides

Use **Cmd+K** to search for specific topics.
