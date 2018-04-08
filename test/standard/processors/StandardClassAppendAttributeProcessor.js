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

import StandardClassAppendAttributeProcessor from '../../../src/standard/processors/StandardClassAppendAttributeProcessor';
import {createThymeleafAttributeValue}       from '../../../src/utilities/Dom';

import h  from 'hyperscript';
import hh from 'hyperscript-helpers';

const {div} = hh(h);

/**
 * Tests for the `th:classappend` processor.
 */
describe('standard/processors/StandardClassAppendAttributeProcessor', function() {

	let processor;
	let attribute;
	beforeAll(function() {
		processor = new StandardClassAppendAttributeProcessor('test');
		attribute = `${processor.name}:${processor.prefix}`;
	});


	test('Adds a class to an element', function() {
		let extraClass = 'added';
		let attributeValue = extraClass;
		let element = createThymeleafAttributeValue(div(), attribute, attributeValue);

		processor.process(element, attribute, attributeValue);

		expect(element.classList.contains(extraClass)).toBeTrue();
	});

});
