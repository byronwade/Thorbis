/**
 * Code Review Workflow
 * Automated code review with multiple analysis passes
 */

import { generateObject } from "ai";
import { z } from "zod";
import { createAIProvider } from "../config";
import type { WorkflowDefinition } from "./types";

type CodeReviewInput = {
  code: string;
  language: string;
  context?: string;
};

type SecurityAnalysis = {
  issues: Array<{
    severity: "high" | "medium" | "low";
    description: string;
    line?: number;
    suggestion: string;
  }>;
  score: number;
};

type PerformanceAnalysis = {
  issues: Array<{
    severity: "high" | "medium" | "low";
    description: string;
    line?: number;
    suggestion: string;
  }>;
  score: number;
};

type QualityAnalysis = {
  issues: Array<{
    severity: "high" | "medium" | "low";
    description: string;
    line?: number;
    suggestion: string;
  }>;
  score: number;
  readabilityScore: number;
  maintainabilityScore: number;
};

type CodeReviewOutput = {
  security: SecurityAnalysis;
  performance: PerformanceAnalysis;
  quality: QualityAnalysis;
  overallScore: number;
  summary: string;
  recommendations: string[];
};

const issueSchema = z.object({
  severity: z.enum(["high", "medium", "low"]),
  description: z.string(),
  line: z.number().optional(),
  suggestion: z.string(),
});

const securitySchema = z.object({
  issues: z.array(issueSchema),
  score: z.number().min(0).max(100),
});

const performanceSchema = z.object({
  issues: z.array(issueSchema),
  score: z.number().min(0).max(100),
});

const qualitySchema = z.object({
  issues: z.array(issueSchema),
  score: z.number().min(0).max(100),
  readabilityScore: z.number().min(0).max(100),
  maintainabilityScore: z.number().min(0).max(100),
});

/**
 * Code Review Workflow
 * Steps: Security Analysis → Performance Analysis → Quality Analysis → Summary
 */
export const codeReviewWorkflow: WorkflowDefinition<
  CodeReviewInput,
  CodeReviewOutput
> = {
  id: "code-review",
  name: "Code Review Workflow",
  description:
    "Multi-pass code review analyzing security, performance, and quality",
  version: "1.0.0",

  steps: [
    {
      id: "security-analysis",
      name: "Security Analysis",
      description: "Analyze code for security vulnerabilities",
      async execute(input) {
        const codeInput = input as CodeReviewInput;
        const model = createAIProvider();

        const { object } = await generateObject({
          model,
          schema: securitySchema,
          prompt: `Analyze this ${codeInput.language} code for security issues:

\`\`\`${codeInput.language}
${codeInput.code}
\`\`\`

${codeInput.context ? `Context: ${codeInput.context}` : ""}

Identify:
- SQL injection risks
- XSS vulnerabilities
- Authentication/authorization issues
- Sensitive data exposure
- Input validation problems

Provide a security score (0-100) and list all issues with severity, description, and suggestions.`,
        });

        return object as SecurityAnalysis;
      },
    },

    {
      id: "performance-analysis",
      name: "Performance Analysis",
      description: "Analyze code for performance issues",
      async execute(input) {
        const codeInput = input as CodeReviewInput;
        const model = createAIProvider();

        const { object } = await generateObject({
          model,
          schema: performanceSchema,
          prompt: `Analyze this ${codeInput.language} code for performance issues:

\`\`\`${codeInput.language}
${codeInput.code}
\`\`\`

${codeInput.context ? `Context: ${codeInput.context}` : ""}

Identify:
- Inefficient algorithms
- Memory leaks
- Unnecessary computations
- Database query optimization
- Caching opportunities

Provide a performance score (0-100) and list all issues with severity, description, and suggestions.`,
        });

        return object as PerformanceAnalysis;
      },
    },

    {
      id: "quality-analysis",
      name: "Code Quality Analysis",
      description: "Analyze code quality, readability, and maintainability",
      async execute(input) {
        const codeInput = input as CodeReviewInput;
        const model = createAIProvider();

        const { object } = await generateObject({
          model,
          schema: qualitySchema,
          prompt: `Analyze this ${codeInput.language} code for quality issues:

\`\`\`${codeInput.language}
${codeInput.code}
\`\`\`

${codeInput.context ? `Context: ${codeInput.context}` : ""}

Evaluate:
- Code organization and structure
- Naming conventions
- Comments and documentation
- Error handling
- Test coverage indicators
- DRY principle adherence
- SOLID principles

Provide:
- Overall quality score (0-100)
- Readability score (0-100)
- Maintainability score (0-100)
- List of quality issues with severity and suggestions`,
        });

        return object as QualityAnalysis;
      },
    },
  ],

  async afterAll(_finalStep, context) {
    const security = context.history[0]?.output as SecurityAnalysis;
    const performance = context.history[1]?.output as PerformanceAnalysis;
    const quality = context.history[2]?.output as QualityAnalysis;

    // Calculate overall score
    const overallScore = Math.round(
      (security.score + performance.score + quality.score) / 3
    );

    // Generate summary and recommendations
    const allIssues = [
      ...security.issues,
      ...performance.issues,
      ...quality.issues,
    ];
    const highSeverityCount = allIssues.filter(
      (i) => i.severity === "high"
    ).length;
    const mediumSeverityCount = allIssues.filter(
      (i) => i.severity === "medium"
    ).length;

    const summary = `Code Review Complete: Found ${allIssues.length} issues (${highSeverityCount} high, ${mediumSeverityCount} medium priority). Overall score: ${overallScore}/100.`;

    const recommendations = [
      ...(highSeverityCount > 0
        ? ["Address all high-severity issues before deployment"]
        : []),
      ...(security.score < 70
        ? ["Implement additional security measures"]
        : []),
      ...(performance.score < 70 ? ["Optimize performance bottlenecks"] : []),
      ...(quality.readabilityScore < 70
        ? ["Improve code readability and documentation"]
        : []),
      ...(quality.maintainabilityScore < 70
        ? ["Refactor for better maintainability"]
        : []),
    ];

    return {
      security,
      performance,
      quality,
      overallScore,
      summary,
      recommendations,
    };
  },

  async onError(_error, _context) {},
};
