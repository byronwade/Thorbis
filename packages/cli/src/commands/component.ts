import { Command } from "commander";
import inquirer from "inquirer";
import { logger } from "../utils/logger";
import { loadConfig } from "../utils/config";

export function registerComponentCommands(program: Command) {
	const component = program.command("component");

	component
		.command("list")
		.description("List all available components in the registry")
		.action(async () => {
			// Simulate fetching components from registry
			const mockComponents = [
				{ name: "Header", version: "1.0.0", author: "Thorbis" },
				{ name: "Footer", version: "1.0.0", author: "Thorbis" },
			];

			logger.table(mockComponents);
		});

	component
		.command("add")
		.description("Add a new component to the registry")
		.option("-n, --name <name>", "Component name")
		.option("-p, --path <path>", "Component path")
		.action(async (options) => {
			const answers = await inquirer.prompt([
				{
					type: "input",
					name: "name",
					message: "Component name:",
					when: !options.name,
				},
				{
					type: "input",
					name: "path",
					message: "Component path:",
					when: !options.path,
					default: "./src/components",
				},
			]);

			const config = await loadConfig();

			logger.info(`Adding component ${answers.name || options.name}...`);
			// Implementation for adding component
		});

	component
		.command("deploy")
		.description("Deploy component to registry")
		.argument("<name>", "Component name")
		.option("-v, --version <version>", "Version to deploy")
		.action(async (name, options) => {
			logger.info(`Deploying component ${name}...`);
			// Implementation for deploying component
		});
}
