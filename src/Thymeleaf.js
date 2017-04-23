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
'use strict';

const StandardDialect = require('./standard/StandardDialect');

const Promise                    = require('bluebird');
const {jsdom, serializeDocument} = require('jsdom');

const fs = require('fs');


const XML_NAMESPACE_ATTRIBUTE = 'xmlns:th';

// TODO: To make a configurable template processor, everything in this file
//       needs to be made into a class so that this standard dialect can live
//       there, instead of being this static const.
const standardDialect = new StandardDialect();
const standardProcessors = standardDialect.processors;

/**
 * Process a DOM element.
 * 
 * @param {Element} element
 * @param {Object} context
 */
function processNode(element, context) {

	// Process the current element
	standardProcessors.forEach(attributeProcessor => {
		let attribute = `${standardDialect.prefix}:${attributeProcessor.name}`;
		if (!element.hasAttribute(attribute)) {
			attribute = `data-${standardDialect.prefix}-${attributeProcessor.name}`;
			if (!element.hasAttribute(attribute)) {
				return;
			}
		}
		let attributeValue = element.getAttribute(attribute);
		attributeProcessor.process(element, attribute, attributeValue, context);
	});

	// Process this element's children
	Array.from(element.children).forEach(child => {
		processNode(child, context);
	});
}

/**
 * Process the Thymeleaf template data, returning the processed template.
 * 
 * @param {String} template
 * @param {Object} context
 * @return {Promise}
 *   Bluebird promise resolved with the processed template, or rejected with an
 *   error message.
 */
function process(template, context) {

	return new Promise((resolve, reject) => {
		try {
			let document = jsdom(template, {
				features: {
					FetchExternalResources: false,
					ProcessExternalResources: false
				}
			});

			let htmlElement = document.documentElement;
			processNode(htmlElement, context);

			// TODO: Special case, remove the xmlns:th namespace from the document.
			//       This should be handled like in main Thymeleaf where it's just
			//       another processor that runs on the document.
			if (htmlElement.hasAttribute(XML_NAMESPACE_ATTRIBUTE)) {
				htmlElement.removeAttribute(XML_NAMESPACE_ATTRIBUTE);
			}

			let documentAsString = serializeDocument(document);
			resolve(documentAsString);
		}
		catch (exception) {
			reject(exception);
		}
	});
}

exports.process = process;

/**
 * Process the Thymeleaf template at the given path, returning a promise of the
 * processed template.
 * 
 * @param {String} filePath
 * @param {Object} context
 * @return {Promise}
 *   Bluebird promise resolved with the processed template, or rejected with an
 *   error message.
 */
function processFile(filePath, context) {

	return new Promise((resolve, reject) => {
		fs.readFile(filePath, (error, data) => {
			if (error) {
				reject(error);
			}
			else {
				resolve(process(data, context));
			}
		});
	});
}

exports.processFile = processFile;