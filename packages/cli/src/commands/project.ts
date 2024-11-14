import { Command } from "commander";
import ora from "ora";
import chalk from "chalk";
import path from "path";
import fs from "fs/promises";
import { logger } from "../utils/logger";

const MOCK_BUTTON_COMPONENT = `
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button
      onClick={onClick}
      className={\`thorbis-button \${variant}\`}
    >
      {children}
    </button>
  );
};
`;

async function ensureThorbisDirectory() {
	const thorbisDir = path.join(process.cwd(), ".thorbis");
	const componentsDir = path.join(thorbisDir, "components");

	await fs.mkdir(componentsDir, { recursive: true });
	return componentsDir;
}

async function generateMockComponent(componentsDir: string) {
	const buttonPath = path.join(componentsDir, "Button.tsx");
	await fs.writeFile(buttonPath, MOCK_BUTTON_COMPONENT);
	return buttonPath;
}

type BuildStep = {
	title: string;
	action: (prevResult?: string) => Promise<string | void>;
};

export function registerProjectCommands(program: Command) {
	// Build Command
	program
		.command("build")
		.description("Build the project with Thorbis integration")
		.action(async () => {
			console.log(chalk.cyan("\n🚀 Starting Thorbis build process\n"));

			const steps: BuildStep[] = [
				{
					title: "Initializing Thorbis environment",
					action: async () => {
						return await ensureThorbisDirectory();
					},
				},
				{
					title: "Generating test components",
					action: async (componentsDir) => {
						if (!componentsDir) throw new Error("Components directory not initialized");
						return await generateMockComponent(componentsDir);
					},
				},
				{
					title: "Configuring build settings",
					action: async () => {
						await new Promise((resolve) => setTimeout(resolve, 1000));
					},
				},
			];

			let previousResult: string | void;

			for (const step of steps) {
				const spinner = ora(step.title).start();
				try {
					const result = await step.action(previousResult);
					spinner.succeed();
					if (result) {
						logger.info(`  └─ ${chalk.dim(result)}`);
						previousResult = result;
					}
				} catch (error) {
					spinner.fail();
					logger.error(`Error: ${error}`);
					process.exit(1);
				}
			}

			console.log(chalk.green("\n✨ Thorbis build completed successfully!\n"));
		});

	// Dev Command
	program
		.command("dev")
		.description("Start development mode with Thorbis integration")
		.action(async () => {
			console.log(chalk.cyan("\n🚀 Starting Thorbis development server\n"));

			const spinner = ora("Initializing development environment").start();

			try {
				const componentsDir = await ensureThorbisDirectory();
				const buttonPath = await generateMockComponent(componentsDir);
				spinner.succeed();

				logger.info(`Component directory: ${chalk.dim(componentsDir)}`);
				logger.info(`Test component: ${chalk.dim(buttonPath)}`);

				console.log("\n" + chalk.yellow("Watching for changes...") + "\n");

				// Simulate periodic updates
				setInterval(() => {
					const timestamp = new Date().toLocaleTimeString();
					console.log(chalk.dim(`[${timestamp}]`), chalk.blue("ℹ"), "Components up to date");
				}, 5000);
			} catch (error) {
				spinner.fail();
				logger.error(`Error: ${error}`);
				process.exit(1);
			}
		});
}
