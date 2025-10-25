/**
 * Example components demonstrating AI SDK usage
 * These are reference implementations - copy patterns to your components
 */

"use client";

import { useState } from "react";

/**
 * Example: Streaming Chat Component
 * Note: For streaming chat, install @ai-sdk/react: pnpm add @ai-sdk/react
 * Then use: import { useChat } from "@ai-sdk/react"
 */
export function ChatExample() {
  // Commented out - requires @ai-sdk/react package
  // const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({ api: "/api/ai/chat" });

  return (
    <div>
      <p>Install @ai-sdk/react to use streaming chat</p>
      <code>pnpm add @ai-sdk/react</code>
    </div>
  );
}

/**
 * Example: Content Generation Workflow
 */
export function ContentGeneratorExample() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/ai/workflows/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          tone: "professional",
          length: "medium",
          keywords: ["AI", "automation"],
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (_error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Content Generator</h2>

      <input
        disabled={isLoading}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter topic..."
        type="text"
        value={topic}
      />
      <button disabled={isLoading || !topic} onClick={handleGenerate}>
        {isLoading ? "Generating..." : "Generate Content"}
      </button>

      {result && (
        <div>
          <h3>{result.output.draft.title}</h3>

          <div>
            <h4>Research Phase</h4>
            <ul>
              {result.output.research.keyPoints.map(
                (point: string, i: number) => (
                  <li key={i}>{point}</li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4>Final Content</h4>
            <p>{result.output.finalContent}</p>
          </div>

          <div>
            <h4>Review Score: {result.output.review.score}/10</h4>
            <ul>
              {result.output.review.suggestions.map(
                (suggestion: string, i: number) => (
                  <li key={i}>{suggestion}</li>
                )
              )}
            </ul>
          </div>

          <div>
            <small>Completed in {result.duration}ms</small>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Example: Code Review Workflow
 */
export function CodeReviewExample() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleReview = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/ai/workflows/code-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          context: "Production code review",
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (_error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Code Review</h2>

      <select onChange={(e) => setLanguage(e.target.value)} value={language}>
        <option value="typescript">TypeScript</option>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
      </select>

      <textarea
        disabled={isLoading}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code here..."
        rows={10}
        value={code}
      />

      <button disabled={isLoading || !code} onClick={handleReview}>
        {isLoading ? "Reviewing..." : "Review Code"}
      </button>

      {result && (
        <div>
          <h3>Overall Score: {result.output.overallScore}/100</h3>
          <p>{result.output.summary}</p>

          <div>
            <h4>Security: {result.output.security.score}/100</h4>
            {result.output.security.issues.length > 0 ? (
              <ul>
                {result.output.security.issues.map((issue: any, i: number) => (
                  <li key={i}>
                    <strong>[{issue.severity}]</strong> {issue.description}
                    <br />
                    <em>Suggestion: {issue.suggestion}</em>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No security issues found!</p>
            )}
          </div>

          <div>
            <h4>Performance: {result.output.performance.score}/100</h4>
            {result.output.performance.issues.length > 0 ? (
              <ul>
                {result.output.performance.issues.map(
                  (issue: any, i: number) => (
                    <li key={i}>
                      <strong>[{issue.severity}]</strong> {issue.description}
                      <br />
                      <em>Suggestion: {issue.suggestion}</em>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p>No performance issues found!</p>
            )}
          </div>

          <div>
            <h4>Code Quality: {result.output.quality.score}/100</h4>
            <p>Readability: {result.output.quality.readabilityScore}/100</p>
            <p>
              Maintainability: {result.output.quality.maintainabilityScore}/100
            </p>
          </div>

          <div>
            <h4>Recommendations</h4>
            <ul>
              {result.output.recommendations.map((rec: string, i: number) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>

          <div>
            <small>Completed in {result.duration}ms</small>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Example: Using AI in Server Component
 */
export async function ServerAIExample() {
  // This would be used in a Server Component (not client)
  // Uncomment to use:

  /*
  import { generateText } from "ai";
  import { createAIProvider } from "@/lib/ai";

  const model = createAIProvider();

  const { text } = await generateText({
    model,
    prompt: "Explain quantum computing in simple terms",
  });

  return <div>{text}</div>;
  */

  return <div>See comments for server example</div>;
}
