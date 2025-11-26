# AI Module - Vercel AI SDK & Workflows

This module provides AI capabilities using the Vercel AI SDK with gateway integration and multi-step workflow orchestration.

## Features

- 🌐 **Vercel AI Gateway** - Enterprise routing, caching, and rate limiting
- 🔄 **Multi-Step Workflows** - Orchestrate complex AI agent pipelines
- 🎯 **Multiple Providers** - OpenAI, Anthropic, Google (auto-switching)
- 📊 **Structured Output** - Type-safe responses with Zod schemas
- 🔧 **Tool Calling** - Function calling for AI agents
- ⚡ **Streaming** - Real-time response streaming
- 🔁 **Retry Logic** - Automatic retries with exponential backoff
- 📝 **Complete Logging** - Track every step and result

## Setup

### 1. Environment Variables

Add to `.env.local`:

```bash
# AI Provider API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENERATIVE_AI_API_KEY=...

# Vercel AI Gateway (optional but recommended)
AI_GATEWAY_URL=https://gateway.ai.vercel.com
AI_GATEWAY_TOKEN=your-gateway-token

# Default Configuration
AI_PROVIDER=openai              # openai | anthropic | google
AI_MODEL=gpt-4o                 # Model to use by default
```

### 2. Get Vercel AI Gateway Token

1. Visit [vercel.com/dashboard/ai-gateway](https://vercel.com/dashboard/ai-gateway)
2. Create a new gateway
3. Copy your gateway URL and token
4. Add to `.env.local`

**Benefits:**
- **Caching** - Automatic response caching (saves costs)
- **Rate Limiting** - Protect against abuse
- **Analytics** - Track usage and costs
- **Fallbacks** - Automatic provider failover
- **Monitoring** - Real-time performance metrics

## Architecture

```
lib/ai/
├── config.ts                   # Provider configuration & gateway setup
├── index.ts                    # Main exports
└── workflows/
    ├── types.ts                # TypeScript definitions
    ├── engine.ts               # Workflow orchestration engine
    ├── content-generation.ts   # Example: Multi-agent content workflow
    ├── code-review.ts          # Example: Automated code review
    └── index.ts                # Workflow exports

app/api/ai/
├── chat/route.ts               # Streaming chat endpoint
└── workflows/
    ├── content/route.ts        # Content generation API
    └── code-review/route.ts    # Code review API
```

## Quick Start

### Simple Chat

```typescript
import { streamText } from "ai";
import { createAIProvider } from "@/lib/ai";

const model = createAIProvider();

const result = await streamText({
  model,
  messages: [
    { role: "user", content: "Hello!" }
  ]
});

// Stream to client
return result.toDataStreamResponse();
```

### Structured Output

```typescript
import { generateObject } from "ai";
import { z } from "zod";
import { createAIProvider } from "@/lib/ai";

const model = createAIProvider();

const { object } = await generateObject({
  model,
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
  }),
  prompt: "Analyze this article...",
});

console.log(object.title); // Type-safe!
```

### Run a Workflow

```typescript
import { WorkflowEngine, contentGenerationWorkflow } from "@/lib/ai/workflows";

const result = await WorkflowEngine.execute(
  contentGenerationWorkflow,
  {
    topic: "Next.js Performance Optimization",
    tone: "technical",
    length: "medium",
    keywords: ["React", "SSR", "streaming"],
  }
);

console.log(result.output.finalContent);
console.log(result.steps); // See each step's result
```

## API Endpoints

### Chat API

**POST** `/api/ai/chat`

```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

### Content Generation Workflow

**POST** `/api/ai/workflows/content`

```bash
curl -X POST http://localhost:3000/api/ai/workflows/content \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "TypeScript Best Practices",
    "tone": "professional",
    "length": "medium",
    "keywords": ["types", "interfaces", "generics"]
  }'
```

**Response:**
```json
{
  "workflowId": "abc123",
  "status": "completed",
  "output": {
    "topic": "TypeScript Best Practices",
    "research": { ... },
    "draft": { ... },
    "review": { ... },
    "finalContent": "..."
  },
  "steps": [...]
}
```

### Code Review Workflow

**POST** `/api/ai/workflows/code-review`

```bash
curl -X POST http://localhost:3000/api/ai/workflows/code-review \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function add(a, b) { return a + b; }",
    "language": "javascript",
    "context": "Utility function for adding numbers"
  }'
```

**Response:**
```json
{
  "workflowId": "xyz789",
  "status": "completed",
  "output": {
    "security": { "score": 100, "issues": [] },
    "performance": { "score": 95, "issues": [...] },
    "quality": { "score": 85, "issues": [...] },
    "overallScore": 93,
    "summary": "...",
    "recommendations": [...]
  },
  "steps": [...]
}
```

## Creating Custom Workflows

### 1. Define Types

```typescript
type MyInput = {
  data: string;
};

type MyOutput = {
  result: string;
};
```

### 2. Create Workflow

```typescript
import { WorkflowDefinition } from "@/lib/ai/workflows";
import { generateText } from "ai";
import { createAIProvider } from "@/lib/ai";

export const myWorkflow: WorkflowDefinition<MyInput, MyOutput> = {
  id: "my-workflow",
  name: "My Custom Workflow",
  description: "Does something amazing",

  steps: [
    {
      id: "step-1",
      name: "First Step",
      async execute(input: MyInput, context) {
        const model = createAIProvider();

        const { text } = await generateText({
          model,
          prompt: `Process this: ${input.data}`,
        });

        return { intermediateResult: text };
      },
    },

    {
      id: "step-2",
      name: "Second Step",
      async execute(previous, context) {
        // Access previous step output
        const firstResult = previous.intermediateResult;

        // Do more processing
        return { result: `Final: ${firstResult}` };
      },
    },
  ],

  // Optional hooks
  async beforeAll(input, context) {
    console.log(`Starting workflow ${context.workflowId}`);
  },

  async afterAll(output, context) {
    console.log(`Workflow completed in ${context.history.length} steps`);
    return output;
  },

  async onError(error, context) {
    console.error(`Workflow ${context.workflowId} failed:`, error);
  },
};
```

### 3. Execute Workflow

```typescript
import { WorkflowEngine } from "@/lib/ai/workflows";
import { myWorkflow } from "./my-workflow";

const result = await WorkflowEngine.execute(
  myWorkflow,
  { data: "input data" },
  {
    userId: "user-123",
    metadata: { source: "web" },
  }
);
```

## Advanced Features

### Parallel Execution

```typescript
const results = await WorkflowEngine.executeParallel(
  [step1, step2, step3],
  input,
  context
);
```

### Retry with Backoff

```typescript
const result = await WorkflowEngine.executeWithRetry(
  step,
  input,
  context,
  {
    maxRetries: 3,
    retryDelay: 1000,
    backoffMultiplier: 2,
  }
);
```

### Abortion Support

```typescript
const controller = new AbortController();

const result = await WorkflowEngine.execute(
  workflow,
  input,
  { signal: controller.signal }
);

// Cancel workflow
controller.abort();
```

### Tool Calling

```typescript
import { generateText, tool } from "ai";
import { z } from "zod";

const result = await generateText({
  model,
  messages,
  tools: {
    getWeather: tool({
      description: "Get weather for a location",
      parameters: z.object({
        location: z.string(),
      }),
      execute: async ({ location }) => {
        // Fetch weather data
        return { temp: 72, conditions: "sunny" };
      },
    }),
  },
});
```

## Provider Switching

```typescript
// Use specific provider
const openai = createAIProvider({ provider: "openai", model: "gpt-4o" });
const claude = createAIProvider({ provider: "anthropic", model: "claude-3-5-sonnet-20241022" });
const gemini = createAIProvider({ provider: "google", model: "gemini-2.0-flash-exp" });

// Available models
import { AVAILABLE_MODELS } from "@/lib/ai";
console.log(AVAILABLE_MODELS.openai);
console.log(AVAILABLE_MODELS.anthropic);
console.log(AVAILABLE_MODELS.google);
```

## Monitoring & Debugging

### Workflow Results

```typescript
const result = await WorkflowEngine.execute(workflow, input);

console.log(result.status);     // "completed" | "error"
console.log(result.duration);   // Total time in ms
console.log(result.steps);      // Array of step results

// Each step includes:
result.steps.forEach(step => {
  console.log(step.stepName);
  console.log(step.duration);
  console.log(step.status);
  console.log(step.output);
});
```

### Gateway Analytics

View real-time metrics at:
- [vercel.com/dashboard/ai-gateway](https://vercel.com/dashboard/ai-gateway)

Metrics include:
- Request count
- Cache hit rate
- Response times
- Token usage
- Cost tracking
- Error rates

## Best Practices

1. **Use Gateway in Production** - Enable caching and rate limiting
2. **Type Your Schemas** - Use Zod for structured outputs
3. **Handle Errors** - Implement `onError` hooks
4. **Monitor Costs** - Track usage via gateway dashboard
5. **Cache Aggressively** - Gateway caches similar requests
6. **Test Workflows** - Run workflows locally before deployment
7. **Set Timeouts** - Use `maxDuration` in API routes
8. **Stream When Possible** - Better UX for long completions

## Cost Optimization

- **Gateway Caching** - Reuse responses for identical prompts
- **Smaller Models** - Use `gpt-4o-mini` or `claude-3-5-haiku` when appropriate
- **Structured Output** - Reduce tokens with focused schemas
- **Prompt Engineering** - Be concise but specific
- **Stop Sequences** - Terminate early when needed

## Resources

- [Vercel AI SDK Docs](https://sdk.vercel.ai/docs)
- [Vercel AI Gateway](https://vercel.com/docs/ai-gateway)
- [OpenAI Models](https://platform.openai.com/docs/models)
- [Anthropic Models](https://docs.anthropic.com/claude/docs/models-overview)
- [Google AI Models](https://ai.google.dev/models)
