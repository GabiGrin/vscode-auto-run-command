import { parseCondition, ParsedConditionType} from './../src/lib/condition-parser';
import { checkCondition} from './../src/lib/condition-checker';
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as myExtension from '../src/extension';
import { runShellCommand } from '../src/lib/run-shell-command';

// Defines a Mocha test suite to group tests of similar kind together
suite('rule parsing', () => {
	test('Should work for always', () => {
		const rule = 'always';
		const expectedResult = {type: ParsedConditionType.always, args: []};
		assert.deepEqual(parseCondition(rule), expectedResult);
	});

	test('Should work for hasFile', () => {
		const rule = 'hasFile: bob.js ';
		const expectedResult = {type: ParsedConditionType.hasFile, args: ['bob.js']};
		assert.deepEqual(parseCondition(rule), expectedResult);
	});

	test('Should work for isLanguage', () => {
		const rule = 'isLanguage: MozzieScript ';
		const expectedResult = {type: ParsedConditionType.isLanguage, args: ['MozzieScript']};
		assert.deepEqual(parseCondition(rule), expectedResult);
	});

	test('should work for isRootFolder', () => {
		const rule = 'isRootFolder: vscode-autorun-command';
		const expectedResult = {type: ParsedConditionType.isRootFolder, args: ['vscode-autorun-command']};
		assert.deepEqual(parseCondition(rule), expectedResult);
	});

	test('should work for isRunningInContainer', () => {
		const rule = 'isRunningInContainer';
		const expectedResult = {type: ParsedConditionType.isRunningInContainer, args: []};
		assert.deepEqual(parseCondition(rule), expectedResult);
	});

	test('should work for isExtensionEnabled', () => {
		const rule = 'isExtensionEnabled: vscode-autorun-command';
		const expectedResult = {type: ParsedConditionType.isExtensionEnabled, args: ['vscode-autorun-command']};
		assert.deepEqual(parseCondition(rule), expectedResult);
	});

	test('should throw for unknown', () => {
		const rule = 'hasFlyingSaucerOfColor: Red'; //TODO - change this test once this rule is implemented!
		assert.throws(() => parseCondition(rule));
	});
});

suite('rule checking', () => {
	test('should always be ok for always', async  () => {
		const parsed = {type: ParsedConditionType.always, args: []};
		const checked = await checkCondition(parsed);
		assert.equal(checked, true);
	});

	test('should sometimes be true for isRunningInContainer', async  () => {
		const parsed = {type: ParsedConditionType.isRunningInContainer, args: []};
		const checked = await checkCondition(parsed);
		const isDocker = require('is-docker')
		const inCont = isDocker();
		assert.equal(checked, inCont);
	});

	test('should be true for isExtensionEnabled with this extension', async  () => {
		const parsed = {type: ParsedConditionType.isExtensionEnabled, args: ['gabrielgrinberg.auto-run-command']};
		const checked = await checkCondition(parsed);
		assert.equal(checked, true);
	});

});

suite('shellCommandTesting', () => {
	test('test bad shell command', async  () => {
		var retVal = false;
		await runShellCommand("command ; exit 1").then(
			() => retVal = false,
			(_) => retVal = true
		);
		assert.equal(retVal, true);
	})

	test('test good shell command', async  () => {
		var retVal = false;
		await runShellCommand("command ; exit 0").then(
			() => retVal = true,
			(_) => retVal = false
		);
		assert.equal(retVal, true);
	})
})