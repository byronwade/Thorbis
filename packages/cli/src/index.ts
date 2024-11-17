#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { registerComponentCommands } from "./commands/component";
import { registerPrototypeCommands } from "./commands/prototype";
import { registerAnalyticsCommands } from "./commands/analytics";
import { registerAICommands } from "./commands/ai";
import { registerProjectCommands } from "./commands/project";

const program = new Command();

// Add banner
console.log(
	chalk.cyan(`
╔════════════════════════════════════════╗
║             THORBIS CLI                ║
╚════════════════════════════════════════╝
`)
);

program.name("thorbis").description("Thorbis CLI - Component Management and AI-Driven Development Tools").version("0.1.0");

// Register all command modules
registerProjectCommands(program);
registerComponentCommands(program);
registerPrototypeCommands(program);
registerAnalyticsCommands(program);
registerAICommands(program);

program.parse();
