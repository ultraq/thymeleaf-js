/* 
 * Copyright 2018, Emanuel Rabina (http://www.ultraq.net.nz/)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import InputBuffer from './InputBuffer';

// TODO: This processor can probably supersede all the other expression types!
//       However, it makes parsing a lot harder as things like whitespace
//       between tokens need to be included in the regex.

/**
 * A special kind of expression that understands matched portions of regular
 * expressions to run processing over, which may lead to additional parsing
 * expressions.
 * 
 * @author Emanuel Rabina
 */
export default class RegularExpressionMatchProcessor {

	/**
	 * Create a new match processor where each function in the list of processors
	 * is what is run for the corresponding matching group in the expression.  eg:
	 * Expression matching group 0 executes processors[0].
	 * 
	 * @param {RegExp} expression
	 * @param {Array<Function>} processors
	 */
	constructor(expression, processors) {

		this.expression = expression;
		this.processors = processors;
	}

	/**
	 * Match the regular expression to the current input.  A succesful match is
	 * only if the entire regular expression matches the remaining input.
	 * 
	 * @param {InputBuffer} input
	 * @param {Parser} parser
	 * @return {Object}
	 */
	match(input, parser) {

		return input.markAndClearOrReset(() => {
			let result = input.read(this.expression);
			if (result) {
				let parseResults = [result[0]];
				for (let i = 1; i < result.length; i++) {
					let match = result[i];
					if (match !== undefined) {
						let parseResult = parser.parseWithExpression(new InputBuffer(match), this.processors[i - 1]);
						if (parseResult === null) {
							return null;
						}
						parseResults.push(parseResult);
					}
				}
				return parseResults;
			}
			return null;
		});
	}
}