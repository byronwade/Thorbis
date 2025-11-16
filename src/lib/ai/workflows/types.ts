/**
 * Workflow types and interfaces
 */

import type { CoreMessage } from "ai";

export type WorkflowStatus = "idle" | "running" | "completed" | "error";

export type WorkflowStep<TInput = unknown, TOutput = unknown> = {
	id: string;
	name: string;
	description?: string;
	execute: (input: TInput, context: WorkflowContext) => Promise<TOutput>;
};

export type WorkflowContext = {
	workflowId: string;
	userId?: string;
	metadata?: Record<string, unknown>;
	history: WorkflowStepResult[];
	signal?: AbortSignal;
};

export type WorkflowStepResult<T = unknown> = {
	stepId: string;
	stepName: string;
	status: "success" | "error";
	input: unknown;
	output?: T;
	error?: string;
	startTime: Date;
	endTime: Date;
	duration: number;
};

export type WorkflowResult<T = unknown> = {
	workflowId: string;
	status: WorkflowStatus;
	steps: WorkflowStepResult[];
	output?: T;
	error?: string;
	startTime: Date;
	endTime?: Date;
	duration?: number;
};

export type WorkflowDefinition<TInput = unknown, TOutput = unknown> = {
	id: string;
	name: string;
	description?: string;
	version?: string;
	steps: WorkflowStep[];
	beforeAll?: (input: TInput, context: WorkflowContext) => Promise<void>;
	afterAll?: (output: TOutput, context: WorkflowContext) => Promise<TOutput>;
	onError?: (error: Error, context: WorkflowContext) => Promise<void>;
};

/**
 * Agent-specific types
 */
export type AgentRole = "assistant" | "researcher" | "writer" | "reviewer";

export type AgentMessage = CoreMessage;

export type AgentContext = {
	role: AgentRole;
	goal: string;
	constraints?: string[];
	history: AgentMessage[];
	metadata?: Record<string, unknown>;
};

export type AgentResult<T = string> = {
	role: AgentRole;
	output: T;
	reasoning?: string;
	confidence?: number;
	metadata?: Record<string, unknown>;
};

/**
 * Tool definition for AI function calling
 */
export type ToolDefinition<TParams = unknown, TResult = unknown> = {
	name: string;
	description: string;
	parameters: TParams;
	execute: (params: TParams) => Promise<TResult>;
};
