# Research Specialist - Example Scenario

## Scenario: Researching FastAPI Deployment Options

This walkthrough demonstrates the Research Specialist agent conducting a comprehensive research task.

---

## User Request

**From:** Content Generation Pipeline
**Task:** "Research deployment options for FastAPI applications"
**Purpose:** Generate deployment guide for gitthub.org tutorial

---

## Step 1: Receive and Parse Request (30 seconds)

### Input Received

```json
{
  "task": "Research deployment options for FastAPI applications",
  "scope": {
    "depth": "detailed",
    "focus": ["cloud platforms", "containerization", "serverless"],
    "constraints": ["production-ready solutions", "cost-effective"]
  },
  "output_format": "structured",
  "context": {
    "purpose": "Create deployment tutorial",
    "next_steps": "Content generator will write guide"
  }
}
```

### Agent Processing

1. **Validate Request**
   - ✅ Task is clear and specific
   - ✅ Scope is well-defined
   - ✅ No clarifications needed

2. **Plan Research Strategy**
   - Identify key areas: cloud platforms, Docker, serverless
   - Source types: official docs, tutorials, comparisons
   - Search queries: "FastAPI deployment", "FastAPI Docker", "FastAPI AWS Lambda"

---

## Step 2: Gather Information (3 minutes)

### Search Execution

**Query 1:** "FastAPI deployment production"

**Sources Found:**
- FastAPI official docs (deployment section)
- Render deployment guide
- DigitalOcean tutorial
- AWS deployment patterns

**Query 2:** "FastAPI Docker containerization"

**Sources Found:**
- Docker Hub official FastAPI images
- Tiangolo/uvicorn-gunicorn-fastapi-docker
- Medium articles on FastAPI containers

**Query 3:** "FastAPI serverless AWS Lambda"

**Sources Found:**
- Mangum adapter documentation
- AWS Lambda FastAPI tutorial
- Serverless framework guides

**Query 4:** "FastAPI deployment comparison cost"

**Sources Found:**
- Reddit discussions
- PythonSpeed blog
- Stack Overflow comparisons

### Information Extraction

Agent reads each source and extracts:
- Deployment methods mentioned
- Setup complexity
- Cost indicators
- Production-readiness signals
- Pros/cons mentioned

---

## Step 3: Evaluate Sources (1 minute)

### Source Credibility Assessment

**High Credibility Sources:**
- FastAPI official documentation (primary source)
- Render/AWS official docs (platform providers)
- Tiangolo's Docker images (FastAPI creator)

**Medium Credibility Sources:**
- DigitalOcean tutorials (well-established but third-party)
- Medium articles by verified experts
- Established tech blogs (PythonSpeed)

**Low Credibility Sources:**
- Reddit discussions (anecdotal, useful for real-world insights)
- Unverified blog posts (filtered out)
- Outdated tutorials (>2 years old, filtered)

### Cross-Reference Verification

- Docker recommendation appears in: FastAPI docs, Render, DigitalOcean, Medium
- Mangum for Lambda mentioned in: AWS docs, Mangum docs, tech blogs
- Render simplicity highlighted in: Render docs, Reddit, comparison articles

---

## Step 4: Synthesize Findings (1 minute)

### Categorization

Agent organizes findings into:

1. **Docker-Based Platforms**
   - Render
   - Railway
   - DigitalOcean App Platform
   - Heroku

2. **Cloud Providers**
   - AWS (ECS, Fargate, Lambda)
   - Google Cloud Run
   - Azure Container Apps

3. **Serverless Options**
   - AWS Lambda + Mangum
   - Google Cloud Functions
   - Azure Functions

4. **Container Orchestration**
   - Kubernetes (EKS, GKE, AKS)
   - Docker Swarm

### Key Insights Extraction

- Docker containerization is universally recommended
- Render/Railway offer simplest setup
- Serverless requires Mangum adapter
- Cost varies significantly by scale

### Gap Identification

- Limited performance benchmark data
- Few detailed cost comparisons
- Minimal real-world production case studies

---

## Step 5: Structure Output (30 seconds)

### Final Output Generation

```json
{
  "findings": {
    "summary": "FastAPI applications have multiple production-ready deployment options, ranging from simple Docker-based platforms (Render, Railway) to cloud services (AWS, GCP, Azure) and serverless architectures (Lambda with Mangum). Docker containerization is the recommended approach for consistency across environments.",

    "key_insights": [
      "Docker containerization is universally recommended for FastAPI deployment",
      "Render and Railway provide the simplest deployment experience with auto-deploy from GitHub",
      "AWS Lambda requires the Mangum ASGI adapter but enables serverless scaling",
      "Cost-effectiveness depends on traffic patterns and scale",
      "Production-ready solutions should include health checks and proper ASGI server configuration"
    ],

    "detailed_findings": {
      "docker_platforms": {
        "summary": "Docker-based platforms offer the easiest FastAPI deployment with minimal configuration",
        "points": [
          "Render: Auto-deploys from GitHub, free tier available, built-in PostgreSQL",
          "Railway: Similar to Render, $5/month starter plan, excellent DX",
          "DigitalOcean App Platform: $5/month, integrates with DO services",
          "Heroku: Classic choice but more expensive post-free-tier removal"
        ],
        "sources": ["render_docs", "railway_docs", "do_tutorial", "heroku_docs"]
      },

      "cloud_providers": {
        "summary": "Major cloud providers support FastAPI via containers or serverless",
        "points": [
          "AWS: ECS/Fargate for containers, Lambda for serverless (requires Mangum)",
          "Google Cloud Run: Serverless containers, excellent auto-scaling",
          "Azure Container Apps: Similar to Cloud Run, good for existing Azure users",
          "All require more configuration than Docker platforms"
        ],
        "sources": ["aws_docs", "gcp_docs", "azure_docs", "cloud_comparison"]
      },

      "serverless": {
        "summary": "Serverless deployment requires adapter but enables event-driven scaling",
        "points": [
          "Mangum adapter bridges ASGI (FastAPI) to AWS Lambda handler format",
          "Cold start times ~1-2 seconds can impact user experience",
          "Cost-effective for intermittent traffic, expensive for high volume",
          "Limited to 15-minute maximum execution time"
        ],
        "sources": ["mangum_docs", "serverless_tutorial", "lambda_patterns"]
      },

      "containerization": {
        "summary": "Docker is the recommended approach for consistency and portability",
        "points": [
          "Official tiangolo/uvicorn-gunicorn-fastapi-docker images available",
          "Multi-stage builds reduce image size",
          "Uvicorn + Gunicorn combination recommended for production",
          "Health check endpoints should be configured"
        ],
        "sources": ["fastapi_docs", "docker_hub", "dockerfile_guide"]
      },

      "best_practices": {
        "summary": "Production deployments should follow security and performance guidelines",
        "points": [
          "Use Uvicorn with Gunicorn worker management",
          "Configure health check endpoints (/health, /ready)",
          "Set proper environment variables (workers, timeout)",
          "Enable HTTPS/TLS certificates",
          "Implement logging and monitoring"
        ],
        "sources": ["fastapi_docs", "production_guide", "deployment_checklist"]
      }
    },

    "sources": [
      {
        "id": "render_docs",
        "url": "https://render.com/docs/deploy-fastapi",
        "title": "Deploy FastAPI on Render",
        "author": "Render",
        "date": "2024-12-15",
        "credibility": "high",
        "relevance": "high",
        "key_points": [
          "Auto-deploy from GitHub",
          "Free tier with 750 hours/month",
          "Built-in PostgreSQL and Redis",
          "Automatic HTTPS"
        ],
        "notes": "Official platform documentation, comprehensive setup guide"
      },
      {
        "id": "fastapi_docs",
        "url": "https://fastapi.tiangolo.com/deployment/",
        "title": "FastAPI Deployment Guide",
        "author": "Sebastián Ramírez (FastAPI creator)",
        "date": "2024-11-20",
        "credibility": "high",
        "relevance": "high",
        "key_points": [
          "Docker deployment recommended",
          "Uvicorn + Gunicorn worker pattern",
          "Official Docker images available",
          "Platform-agnostic guidance"
        ],
        "notes": "Primary source - FastAPI creator's official recommendations"
      },
      {
        "id": "mangum_docs",
        "url": "https://mangum.io/",
        "title": "Mangum - AWS Lambda ASGI Adapter",
        "author": "Jordan Eremieff",
        "date": "2024-10-05",
        "credibility": "high",
        "relevance": "high",
        "key_points": [
          "Bridges ASGI to Lambda handler format",
          "Supports API Gateway and ALB",
          "Simple integration with FastAPI",
          "Active maintenance"
        ],
        "notes": "Standard solution for FastAPI on Lambda"
      },
      {
        "id": "railway_docs",
        "url": "https://docs.railway.app/getting-started/deploy-a-fastapi-app",
        "title": "Deploy a FastAPI App",
        "author": "Railway",
        "date": "2024-11-10",
        "credibility": "high",
        "relevance": "high",
        "key_points": [
          "$5/month starter plan",
          "Zero-config deployments",
          "GitHub integration",
          "Excellent developer experience"
        ],
        "notes": "Official Railway documentation"
      },
      {
        "id": "do_tutorial",
        "url": "https://www.digitalocean.com/community/tutorials/how-to-deploy-fastapi",
        "title": "How to Deploy FastAPI Applications",
        "author": "DigitalOcean Community",
        "date": "2024-09-20",
        "credibility": "medium",
        "relevance": "high",
        "key_points": [
          "App Platform deployment steps",
          "Docker setup walkthrough",
          "Cost breakdown",
          "Database integration"
        ],
        "notes": "Third-party but well-maintained tutorial"
      },
      {
        "id": "aws_docs",
        "url": "https://aws.amazon.com/blogs/compute/deploying-fastapi/",
        "title": "Deploying FastAPI Applications on AWS",
        "author": "AWS Compute Blog",
        "date": "2024-08-15",
        "credibility": "high",
        "relevance": "high",
        "key_points": [
          "ECS/Fargate for containers",
          "Lambda + Mangum for serverless",
          "API Gateway integration",
          "CloudFormation templates"
        ],
        "notes": "Official AWS deployment patterns"
      },
      {
        "id": "cloud_comparison",
        "url": "https://pythonspeed.com/articles/fastapi-deployment/",
        "title": "FastAPI Deployment Comparison 2024",
        "author": "Itamar Turner-Trauring",
        "date": "2024-07-10",
        "credibility": "medium",
        "relevance": "high",
        "key_points": [
          "Platform cost comparison",
          "Performance benchmarks",
          "Setup complexity ratings",
          "Real-world recommendations"
        ],
        "notes": "Independent analysis with practical insights"
      },
      {
        "id": "docker_hub",
        "url": "https://hub.docker.com/r/tiangolo/uvicorn-gunicorn-fastapi",
        "title": "Official FastAPI Docker Image",
        "author": "Sebastián Ramírez",
        "date": "2024-11-25",
        "credibility": "high",
        "relevance": "high",
        "key_points": [
          "Pre-configured Uvicorn + Gunicorn",
          "Auto-tuning for available CPUs",
          "Multiple Python versions",
          "Widely used in production"
        ],
        "notes": "Official Docker images from FastAPI creator"
      }
    ],

    "gaps": [
      "Limited performance benchmark data comparing platforms under load",
      "Few detailed cost comparisons at different traffic scales",
      "Minimal production case studies with real-world metrics",
      "Limited information on deployment to China or restricted regions"
    ],

    "conflicts": [
      {
        "topic": "Cold start impact on serverless deployments",
        "source_1": {
          "position": "Cold starts are negligible for most use cases (~1-2s)",
          "source": "aws_docs"
        },
        "source_2": {
          "position": "Cold starts significantly impact user experience, avoid serverless for user-facing APIs",
          "source": "cloud_comparison"
        },
        "resolution": "AWS documentation is optimistic; independent analysis shows cold starts are problematic for latency-sensitive applications. Recommend serverless for background tasks, not user-facing endpoints."
      }
    ],

    "recommendations": [
      "For beginners: Start with Render or Railway for simplicity",
      "For scale: Consider AWS ECS/Fargate or Google Cloud Run",
      "For event-driven: Use AWS Lambda + Mangum for background tasks",
      "For existing infrastructure: Match deployment to current cloud provider",
      "Research next steps: Conduct performance benchmarks on target platforms",
      "Research next steps: Compare actual costs at expected traffic levels"
    ]
  },

  "status": "complete",
  "clarifications_needed": [],

  "metadata": {
    "sources_consulted": 12,
    "time_elapsed": "4 minutes 30 seconds",
    "confidence_level": "high",
    "research_method": "Multi-query web search, official documentation prioritization, cross-reference verification"
  }
}
```

---

## Step 6: Handoff to Next Agent

### What Happens Next

The Content Generation agent receives this structured output and:

1. **Uses Summary** - Creates introduction paragraph
2. **Expands Key Insights** - Main sections of deployment guide
3. **Cites Sources** - Adds links and attribution
4. **Addresses Gaps** - Adds disclaimers where data is limited
5. **Incorporates Recommendations** - "Getting Started" and "Choosing a Platform" sections

### Example Content Generated

```markdown
# FastAPI Deployment Guide

FastAPI applications have multiple production-ready deployment options, ranging from
simple Docker-based platforms like Render and Railway to cloud services (AWS, GCP, Azure)
and serverless architectures. Docker containerization is the recommended approach for
consistency across environments.

## Key Considerations

Docker containerization is universally recommended for FastAPI deployment. This approach
provides consistency across development and production environments. The official
tiangolo/uvicorn-gunicorn-fastapi-docker images provide pre-configured setups...

[continues with detailed content based on research findings]

## Sources

- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/) - Official docs
- [Deploy FastAPI on Render](https://render.com/docs/deploy-fastapi) - Render
- [Mangum ASGI Adapter](https://mangum.io/) - Serverless integration
[more citations...]
```

---

## Lessons from This Scenario

### What Worked Well ✅

1. **Clear Scope** - Well-defined focus areas prevented scope creep
2. **Multiple Sources** - Cross-referencing increased confidence
3. **Credibility Assessment** - Prioritized official sources over anecdotal
4. **Gap Documentation** - Honest about limitations in available data
5. **Structured Output** - Easy for content generator to consume

### Potential Improvements 🔄

1. **Performance Data** - Could have searched more specifically for benchmarks
2. **Cost Calculations** - Could have gathered more pricing comparisons
3. **Regional Considerations** - Didn't research deployment in specific regions
4. **Security Aspects** - Could have included more security-focused sources

### Time Breakdown

- Understanding request: 30 seconds (10%)
- Information gathering: 3 minutes (67%)
- Source evaluation: 1 minute (22%)
- Synthesis: 30 seconds (11%)
- **Total:** ~4.5 minutes

### Source Distribution

- Official documentation: 5 sources (high credibility)
- Platform providers: 3 sources (high credibility)
- Third-party tutorials: 2 sources (medium credibility)
- Independent analysis: 2 sources (medium credibility)
- **Total:** 12 sources consulted

---

## Alternative Scenarios

### Scenario A: Scope Too Broad

**Input:** "Research AI"

**Agent Response:**
```json
{
  "status": "needs_clarification",
  "clarifications_needed": [
    "What specific aspect of AI? (e.g., agents, models, applications, theory)",
    "What's the purpose? (e.g., learning, implementation, comparison)",
    "What level of detail? (e.g., overview, technical deep-dive, beginner guide)",
    "Any specific time period or constraints?"
  ]
}
```

### Scenario B: Conflicting Information

**Input:** "Research whether serverless is suitable for web APIs"

**Agent Processing:** Finds significant disagreement

**Output Includes:**
```json
{
  "conflicts": [
    {
      "topic": "Serverless for web APIs",
      "source_1": {
        "position": "Serverless is ideal for all web APIs",
        "source": "serverless_vendor_blog"
      },
      "source_2": {
        "position": "Avoid serverless for user-facing APIs due to cold starts",
        "source": "independent_performance_analysis"
      },
      "resolution": "Independent analysis is more credible. Serverless works for low-traffic or background APIs, but cold starts impact user experience for high-traffic user-facing endpoints."
    }
  ]
}
```

### Scenario C: Information Gap

**Input:** "Research deployment costs for FastAPI at 1M requests/day"

**Agent Processing:** Finds limited specific data

**Output Includes:**
```json
{
  "findings": {
    "summary": "Limited specific cost data available for 1M requests/day...",
    "key_insights": [
      "Cost varies significantly by platform architecture",
      "Most platforms require custom quotes at this scale"
    ]
  },
  "gaps": [
    "No public pricing for 1M requests/day on Render",
    "AWS costs depend heavily on instance types (no standard benchmark)",
    "Few real-world cost disclosures at this scale"
  ],
  "recommendations": [
    "Contact platforms directly for custom pricing",
    "Conduct load testing with sample costs",
    "Research case studies from companies at similar scale"
  ]
}
```

---

## Integration with Multi-Agent Pipeline

This research task is typically part of a larger workflow:

```
User Request: "Create deployment tutorial for FastAPI"
          ↓
    Orchestrator
          ↓
    Research Specialist (this scenario)
          ↓
    Content Generator
          ↓
    Code Example Generator
          ↓
    Review & Edit Agent
          ↓
    Final Tutorial Published
```

Each agent receives structured output from the previous agent and contributes its specialized capability to the final result.

---

This scenario demonstrates how the Research Specialist agent conducts thorough, structured research while maintaining clear boundaries and producing outputs ready for consumption by downstream agents.
