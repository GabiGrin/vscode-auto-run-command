import { ParsedCondition, ParsedConditionType } from './condition-parser';
import * as vscode from 'vscode';

export const checkCondition = async (rule: ParsedCondition): Promise<boolean> => {
	const args = rule.args;
	const editor = vscode.window.activeTextEditor;

	switch (rule.type) {
		case ParsedConditionType.always:
			return true;
		case ParsedConditionType.isLanguage:
			return editor && editor.document.languageId === args[0];
		case ParsedConditionType.hasFile:
			const results = await vscode.workspace.findFiles(args[0], '', 1);
			return Array.isArray(results) && results.length > 0;
		case ParsedConditionType.isRootFolder:
			const rootPath = vscode.workspace.rootPath || '';
			const folderMatches = rootPath.match(/([^\/]*)\/*$/);
			const match = folderMatches && folderMatches[1];
			return match && match === args[0];
	}
};

