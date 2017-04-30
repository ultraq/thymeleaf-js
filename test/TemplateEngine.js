/* 
 * Copyright 2017, Emanuel Rabina (http://www.ultraq.net.nz/)
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

import {TemplateEngine} from '../src/Thymeleaf';

import {assert} from 'chai';
import fs       from 'fs';
import path     from 'path';

/**
 * Tests for the Thymeleaf processing functions.
 */
describe('TemplateEngine', function() {

	it('#processFile', function() {
		let inputTemplatePath = path.join(__dirname, 'template.html');

		let templateEngine = new TemplateEngine();
		return templateEngine.processFile(inputTemplatePath, {
			greeting: 'Hello!',
			showGreeting: true
		})
			.then(template => {
				let expectedTemplate = fs.readFileSync(path.join(__dirname, 'template-expected.html')).toString();
				assert.strictEqual(template.replace(/(\t|\n)/g, ''), expectedTemplate.replace(/(\t|\n)/g, ''));
			});
	});
});