export enum ParsedConditionType {
	always = 1,
	hasFile = 2,
	isLanguage = 3,
	isRootFolder = 4,
	isRunningInContainer = 5
}

export type ParsedCondition = {type: ParsedConditionType, args: string[]};

class AmbiguousRuleError extends Error {};
class UnknownRuleError extends Error {};

export const parseCondition = (rule: string): ParsedCondition =>  {

	const ruleMatchers = [
		{
			pattern: /^always$/,
			type: ParsedConditionType.always
		},
		{
			pattern: /^hasFile:\s*([^\s]+)\s*/,
			type: ParsedConditionType.hasFile
		},
		{
			pattern: /isLanguage:\s*([^\s]+)\s*/,
			type: ParsedConditionType.isLanguage
		},
		{
			pattern: /isRootFolder:\s*([^\s]+)\s*/,
			type: ParsedConditionType.isRootFolder
		},
		{
			pattern: /isRunningInContainer$/,
			type: ParsedConditionType.isRunningInContainer
		}
	];

	const matchedRules = ruleMatchers.filter(matcher => rule.match(matcher.pattern));

	if (matchedRules.length > 1) {
		throw new AmbiguousRuleError('Please open an issue. ');
	} else if (matchedRules.length === 0) {
		throw new UnknownRuleError(`Unable to parse rule - [${rule}], please make sure you are using a known rule pattern`);
	} else {
		const matchedRule = matchedRules[0];
		const [firstMatch, ...tailMatches] = rule.match(matchedRule.pattern);
		return {
			type: matchedRule.type,
			args: tailMatches.map(arg => arg.toString())
		};
	};
};
