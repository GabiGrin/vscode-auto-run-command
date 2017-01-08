import { checkCondition } from './lib/condition-checker';
import { parseCondition } from './lib/condition-parser';

import * as vscode from 'vscode';

const nameSpace = 'auto-run-command';

interface Rule {
	command: string | string[];
	condition: string | string [];
	message?: string;
}

interface Config {
	rules: Rule[];
}

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand(`${nameSpace}.placeholder-command`, () => {
		vscode.window.showInformationMessage('Auto run command is working. Checkout the README to make it do something useful!');
	});

	context.subscriptions.push(disposable);

	const nsConfig = vscode.workspace.getConfiguration(nameSpace);
	const rules = nsConfig.get('rules') as Rule[];


	const runCommandDelayed = (command: string, message: string) => {

		const safetyDelay = 5000; //to ensure other extensions got their moves on

		setTimeout(() => {
			vscode.commands.executeCommand(command)
							.then(
								() => vscode.window.setStatusBarMessage(`[Auto Run Command] Condition met - ${message}`, 3000),
								(reason) => vscode.window.showErrorMessage(`[Auto Run Command] Condition met but command [${command}] raised an error - [${reason}] `)
							);
		}, safetyDelay);
	};

	rules.forEach(rule => {
		console.log(rule);
		const conditions: string[] = typeof rule.condition === 'string' ? [rule.condition] : rule.condition || [];
		const commands: string[] = typeof rule.command === 'string' ? [rule.command] : rule.command || [];
		const message = rule.message || conditions.join(' and ');

		try {
			const parsed = conditions.map(parseCondition);
			const checkPromises = parsed.map(checkCondition);
			return Promise.all(checkPromises)
				.then(values => {
					if (values.every(id => !!id)) {
						commands.forEach(cmd => runCommandDelayed(cmd, message));
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
