import { spawn } from "child_process";
import chalk from "chalk";

function runCommand(command: string, args: string[]) {
	const process = spawn(command, args, {
		stdio: "inherit",
		shell: true,
	});

	return new Promise((resolve, reject) => {
		process.on("error", reject);
		process.on("exit", (code) => {
			if (code === 0) {
				resolve(code);
			} else {
				reject(new Error(`Command exited with code ${code}`));
			}
		});
	});
}

async function main() {
	console.log(chalk.cyan("\n🚀 Starting Thorbis Events development...\n"));

	try {
		// Run both processes
		await Promise.all([runCommand("bun", ["run", "dev:build"]), runCommand("bun", ["run", "dev:server"])]);
	} catch (error) {
		console.error(chalk.red("Error running development servers:"), error);
		process.exit(1);
	}
}

main();
