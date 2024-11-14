import { Command } from "commander";
import chalk from "chalk";
import { logger } from "../utils/logger";

export function registerPrototypeCommands(program: Command) {
	const prototype = program.command("prototype");

	prototype
		.command("create")
		.description("Create a new prototype feature")
		.option("-n, --name <name>", "Feature name")
		.action((options) => {
			logger.info("Creating new prototype feature...");
			console.log(chalk.dim("Mock feature data:"), {
				name: options.name || "test-feature",
				status: "experimental",
				created: new Date().toISOString(),
			});
		});

	prototype
		.command("list")
		.description("List all prototype features")
		.action(() => {
			const mockFeatures = [
				{ name: "dark-mode", status: "active", created: "2024-02-01" },
				{ name: "new-header", status: "disabled", created: "2024-02-15" },
			];
			logger.info("Current prototype features:");
			logger.table(mockFeatures);
		});

	prototype
		.command("toggle")
		.description("Toggle prototype feature")
		.argument("<name>", "Feature name")
		.action((name) => {
			logger.success(`Toggled feature: ${name}`);
		});
}
