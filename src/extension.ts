import { checkCondition } from './lib/condition-checker';
import { parseCondition } from './lib/condition-parser';
import { runShellCommand } from './lib/run-shell-command';

import * as vscode from 'vscode';

const nameSpace = 'auto-run-command';

interface Rule {
	command: string | string[];
	condition: string | string [];
	shellCommand?: boolean;
	message?: string;
}

interface Config {
	rules: Rule[];
}

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand(`${nameSpace}.placeholder-command`, () => {
		vscode.window.showInformationMessage('Auto run command is working. Check out the README to make it do something useful!');
	});

	context.subscriptions.push(disposable);

	const nsConfig = vscode.workspace.getConfiguration(nameSpace);
	const rules = nsConfig.get('rules') as Rule[];


	const runCommandDelayed = (command: string, message: string, shellCommand: boolean) => {

		const safetyDelay = 5000; //to ensure other extensions got their moves on
		const commands = command.split(" "); // commands may contain specified to separate arguments

		if(commands.length < 1) {
			return;
		}
		const [cmd, ...args] = commands;



		setTimeout(() => {
			if (shellCommand)
			{
				runShellCommand(command)
								.then(
									() => vscode.window.setStatusBarMessage(`[Auto Run Command] Condition met - ${message}`, 3000),
									(reason) => vscode.window.showErrorMessage(`[Auto Run Command] Condition met but command [${command}] raised an error - [${reason}] `)
								);
			}
			else
			{
				vscode.commands.executeCommand(cmd, ...args)
								.then(
									() => vscode.window.setStatusBarMessage(`[Auto Run Command] Condition met - ${message}`, 3000),
									(reason) => vscode.window.showErrorMessage(`[Auto Run Command] Condition met but command [${command}] raised an error - [${reason}] `)
					    		);
			}
		}, safetyDelay);
	};

	rules.forEach(rule => {
		console.log(rule);
		const conditions: string[] = typeof rule.condition === 'string' ? [rule.condition] : rule.condition || [];
		const shellCommand: boolean = rule.shellCommand;
		const commands: string[] = typeof rule.command === 'string' ? [rule.command] : rule.command || [];
		const message = rule.message || conditions.join(' and ');

		try {
			const parsed = conditions.map(parseCondition);
			const checkPromises = parsed.map(checkCondition);
			return Promise.all(checkPromises)
				.then(values => {
					if (values.every(id => !!id)) {
						commands.forEach(cmd => runCommandDelayed(cmd, message, shellCommand));
				}
			});
		} catch (e) {
			vscode.window.showErrorMessage(`[Auto Run Command] ${e}`);
		}
	});
}

// this method is called when your extension is deactivated
export function deactivate() {
	//console.
}
